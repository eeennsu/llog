/**
 * Vercel 로그인 없이 프록시를 로컬에서 띄우는 최소 dev 서버.
 *
 * `vercel dev` 는 계정 로그인 + 프로젝트 링크가 필요하다. 이 스크립트는
 * `api/riot/[...path].ts` 핸들러를 Node http 로 직접 감싸서 동일한 경로
 * (`/api/riot/<hostKey>/<riot path>`)로 서비스한다.
 *
 * 실행:  npm run dev:local   (node --experimental-strip-types --env-file=.env.local dev.ts)
 */

import http from 'node:http';

import handler from './api/riot/[...path].ts';

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const match = url.pathname.match(/^\/api\/riot\/(.+)$/);
  if (!match) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  // Vercel 의 req.query 형태 재현: 쿼리스트링 + catch-all 세그먼트(path)
  const query: Record<string, string | string[]> = {};
  for (const [k, v] of url.searchParams) {
    const prev = query[k];
    if (prev === undefined) query[k] = v;
    else query[k] = Array.isArray(prev) ? [...prev, v] : [prev, v];
  }
  query.path = match[1].split('/').map(decodeURIComponent);

  const vres = Object.assign(res, {
    status(code: number) {
      res.statusCode = code;
      return vres;
    },
    json(body: unknown) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(body));
      return vres;
    },
    send(body: string) {
      res.end(body);
      return vres;
    },
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({ method: req.method, headers: req.headers, query } as any, vres as any);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'dev server error' }));
    } else if (!res.writableEnded) {
      res.end();
    }
  }
});

server.listen(PORT, () => {
  console.log(`LLog proxy (local) → http://localhost:${PORT}/api/riot/<hostKey>/<path>`);
  if (!process.env.RIOT_API_KEY) console.warn('RIOT_API_KEY 가 비어 있습니다 (.env.local 확인)');
});
