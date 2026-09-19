/**
 * 프록시 경유 Riot API 클라이언트.
 *
 * 앱은 Riot API 키를 절대 갖지 않는다. 모든 Riot 요청은
 *   ${API_BASE}/api/riot/<hostKey>/<riot path>
 * 형태로 프록시(server/)에 전달되고, 프록시가 키를 주입한다.
 *
 * hostKey 예: 'kr', 'na1' (platform) / 'asia', 'americas' (regional)
 */

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** HTTP 상태코드를 사용자 친화 메시지로 변환 */
function messageForStatus(status: number, fallback: string): string {
  switch (status) {
    case 400:
      return '잘못된 요청입니다. 입력값을 확인해 주세요.';
    case 401:
    case 403:
      return 'API 키가 유효하지 않거나 만료되었습니다. (개발 키는 24시간마다 갱신 필요)';
    case 404:
      return '해당 소환사 또는 데이터를 찾을 수 없습니다.';
    case 429:
      return '요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해 주세요.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Riot 서버 또는 프록시에 일시적 오류가 발생했습니다.';
    default:
      return fallback || '알 수 없는 오류가 발생했습니다.';
  }
}

export type QueryParams = Record<string, string | number | undefined>;

function buildUrl(hostKey: string, path: string, query?: QueryParams): string {
  const cleanPath = path.replace(/^\//, '');
  const url = new URL(`${API_BASE}/api/riot/${hostKey}/${cleanPath}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function riotFetch<T>(
  hostKey: string,
  path: string,
  query?: QueryParams,
): Promise<T> {
  const url = buildUrl(hostKey, path, query);

  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (e) {
    throw new ApiError(
      0,
      '서버에 연결할 수 없습니다. 프록시(API_BASE)가 실행 중인지 확인해 주세요.',
    );
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.status?.message ?? body?.message ?? '';
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, messageForStatus(res.status, detail));
  }

  return (await res.json()) as T;
}
