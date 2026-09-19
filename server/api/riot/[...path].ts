/**
 * Riot API 패스스루 프록시 (Vercel Serverless Function).
 *
 * 앱은 다음 형태로 호출한다:
 *   GET /api/riot/<hostKey>/<riot path...>?<query>
 * 예:
 *   /api/riot/asia/riot/account/v1/accounts/by-riot-id/Hide%20on%20bush/KR1
 *   /api/riot/kr/lol/summoner/v4/summoners/by-puuid/<puuid>
 *
 * 프록시는 RIOT_API_KEY 를 헤더로 주입해 Riot 으로 전달하고 응답을 그대로 반환한다.
 * API 키는 절대 클라이언트로 노출되지 않는다.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

/** SSRF 방지를 위한 허용 호스트 키 화이트리스트 */
const ALLOWED_HOSTS = new Set([
  // platform
  'kr', 'jp1', 'na1', 'br1', 'la1', 'la2', 'oc1',
  'euw1', 'eun1', 'tr1', 'ru', 'ph2', 'sg2', 'th2', 'tw2', 'vn2',
  // regional
  'asia', 'americas', 'europe', 'sea',
]);

type CacheEntry = { expires: number; status: number; body: string };
const cache = new Map<string, CacheEntry>();
const MAX_CACHE = 500;

function cacheTtlMs(riotPath: string): number {
  // 매치 상세는 불변 → 길게, 매치 ID/기타는 짧게
  if (riotPath.includes('/matches/') && !riotPath.endsWith('/ids')) return 60 * 60_000;
  return 30_000;
}

function setCache(key: string, entry: CacheEntry) {
  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, entry);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (Expo web 대응)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ message: 'RIOT_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const raw = req.query.path;
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : [];
  if (segments.length < 2) {
    return res.status(400).json({ message: '잘못된 프록시 경로입니다.' });
  }

  const hostKey = segments[0];
  if (!ALLOWED_HOSTS.has(hostKey)) {
    return res.status(400).json({ message: `허용되지 않은 호스트: ${hostKey}` });
  }

  const riotPath = segments.slice(1).map(encodeURIComponent).join('/');

  // 원본 쿼리스트링 전달 (path 제외)
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k === 'path') continue;
    if (Array.isArray(v)) v.forEach((vv) => params.append(k, vv));
    else if (v !== undefined) params.append(k, v);
  }
  const qs = params.toString();
  const targetUrl = `https://${hostKey}.api.riotgames.com/${riotPath}${qs ? `?${qs}` : ''}`;

  // 캐시 조회
  const cacheKey = targetUrl;
  const hit = cache.get(cacheKey);
  if (hit && hit.expires > Date.now()) {
    res.setHeader('X-Proxy-Cache', 'HIT');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(hit.status).send(hit.body);
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      headers: { 'X-Riot-Token': apiKey, Accept: 'application/json' },
    });
  } catch {
    return res.status(502).json({ message: 'Riot 서버에 연결하지 못했습니다.' });
  }

  const text = await upstream.text();

  // rate limit 헤더 일부 전달 (디버깅용)
  const retryAfter = upstream.headers.get('Retry-After');
  if (retryAfter) res.setHeader('Retry-After', retryAfter);

  if (upstream.ok) {
    setCache(cacheKey, {
      expires: Date.now() + cacheTtlMs(riotPath),
      status: upstream.status,
      body: text,
    });
    res.setHeader('X-Proxy-Cache', 'MISS');
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(upstream.status).send(text);
}
