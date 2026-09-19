# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

LLog — 리그 오브 레전드 전적검색 모바일 앱 (Expo SDK 56 + React Native 0.85 + TypeScript, Expo Router).
Riot ID(`gameName#tagLine`)로 소환사 프로필·랭크·숙련도·매치 히스토리·매치 상세를 조회한다. **지역은 KR 고정**(지역 선택 기능 없음).

두 개의 독립 패키지로 구성된다:
- 루트: Expo 앱 (`src/`)
- `server/`: Riot API 키를 은닉하는 Vercel Serverless 프록시 (별도 `package.json`, 별도 `tsconfig`, 독립 배포). 루트 `tsconfig.json`은 `server`를 exclude 한다.

## 명령어

```bash
# 프록시 (server/) — 앱보다 먼저 띄운다
cd server && npm install
cp .env.example .env.local        # RIOT_API_KEY 입력 (개발 키는 24시간마다 만료)
npm run dev:local                 # Vercel 로그인 없이 Node http 로 핸들러 직접 서빙 (server/dev.ts, :3000)
npm run dev                       # vercel dev --listen 3000 (vercel login + 프로젝트 링크 필요)

# 앱 (루트)
cp .env.example .env              # EXPO_PUBLIC_API_BASE=http://localhost:3000
npm install
npm run start                     # Expo dev server (a / i / w)
npm run typecheck                 # tsc --noEmit — 주 검증 수단
npm run lint                      # expo lint (ESLint 설정 파일은 아직 없음)
node scripts/generate-brand-assets.js   # 아이콘/스플래시 재생성 (sharp 필요)
```

테스트 러너는 없다. 검증은 `typecheck` + 프록시·앱 동시 구동 후 KR 계정 1건을 프로필 → 랭크 → 매치목록 → 매치상세 순으로 조회하고, 에러 케이스(잘못된 Riot ID 404 / 만료 키 403 / rate limit 429)에서 에러 뷰가 뜨는지 확인한다.
실기기 테스트 시 `EXPO_PUBLIC_API_BASE`를 PC LAN IP로 바꿔야 한다.
Android 에뮬레이터에서는 `adb reverse tcp:3000 tcp:3000`을 걸면 `.env`의 `localhost:3000` 그대로 프록시에 닿는다.

## 아키텍처

### 요청 경로: 앱 → 프록시 → Riot
- **API 키는 앱에 절대 두지 않는다.** 모든 Riot 호출은 `src/api/client.ts`의 `riotFetch(hostKey, path, query)`를 거쳐 `${EXPO_PUBLIC_API_BASE}/api/riot/<hostKey>/<riot path>`로 간다.
- `server/api/riot/[...path].ts`가 `hostKey`를 화이트리스트(SSRF 방지)로 검증하고 `https://<hostKey>.api.riotgames.com/...`에 `X-Riot-Token`을 주입해 패스스루한다. 인메모리 캐시(매치 상세 1시간, 그 외 30초, 최대 500개)와 CORS 헤더(Expo web용)도 여기서 처리.
- `hostKey` 라우팅은 `src/api/regions.ts` 상수로 고정: `PLATFORM='kr'`(summoner/league/mastery), `REGIONAL='asia'`(match-v5), `ACCOUNT_REGIONAL='asia'`(account-v1).
- Riot ID 흐름: `account-v1`로 PUUID 해석 → 이후 모든 호출은 PUUID 기반(`src/api/riot.ts`).
- `riotFetch`는 실패 시 `ApiError(status, 한글 메시지)`를 던진다(status 0 = 프록시 연결 실패). `src/lib/queryClient.ts`의 retry 정책이 이 status를 보고 429/5xx만 1회 재시도, 4xx는 재시도 안 함.

### 정적 데이터
Data Dragon(`src/api/ddragon.ts`)은 CORS 허용·키 불필요라 **앱에서 직접 호출**한다(`ko_KR`). 최신 버전 조회 후 챔피언/스펠/룬 룩업 맵을 한 번 만들어 `useStaticData()`로 공유한다. 챔피언 맵 키는 숫자 `key`(Riot API의 championId), 이미지 파일명은 `id`.

### 상태
- 서버 상태: TanStack Query. 쿼리 키는 `src/hooks/riot.ts`의 `qk` 팩토리를 쓴다 — `useMatchDetails`(`useQueries`)와 `MatchRow`의 `useMatch`가 `qk.match(id)`로 캐시를 공유하므로 키 형식을 어긋나게 만들면 중복 fetch가 생긴다. 매치 상세는 불변이라 `staleTime: Infinity`. 매치 목록은 `useInfiniteQuery`(페이지 10개).
- 클라이언트 상태: Zustand + persist(AsyncStorage) — `src/store/useAppStore.ts` (최근검색·즐겨찾기, 키는 `summonerKey()` 소문자 정규화).

### 라우팅 (`src/app/`, typedRoutes)
- `index.tsx` 검색 / `summoner/[riotId].tsx` (param은 `"gameName#tagLine"` 문자열) / `match/[matchId].tsx` (`puuid` 쿼리 param으로 기준 플레이어 전달).
- 화면 이동은 `src/lib/nav.ts`의 `goToSummoner` / `goToMatch`를 쓴다.
- `app.json`에서 React Compiler가 켜져 있다.

### 도메인 유틸
`src/lib/lol.ts`(큐 이름, KDA/CS 포맷 등), `src/lib/stats.ts`(챔피언별 집계, 큐 카테고리 필터 — 순수 함수). Riot DTO 타입은 `src/types/riot.ts`.

## 디자인 규칙

다크 전용(`userInterfaceStyle: dark`). 모든 색·간격·타이포는 `src/theme` 토큰을 쓴다(하드코딩 금지).
강조색은 **시안 하나**(`colors.primary`)만, 활성/포커스/핵심 수치 등 의도 있는 지점에만. 승/패는 블루/레드(시맨틱 한정), 베이스는 중립 그레이. 8pt 그리드, 얇은 보더 + 미묘한 표면 단차로 영역 분리. 과한 그라데이션/네온 글로우/드롭섀도/이모지 금지.
공용 프리미티브는 `src/components/ui/` (`Text`, `Card`, `Pill`, `Sprite`, `States` 등)를 먼저 재사용한다.

## 주의

- 경로 alias: `@/*` → `src/*`, `@/assets/*` → `assets/*`.
- 사용자 대상 문자열·주석은 한국어.
- `.omc/`와 `.claude/CLAUDE.md`(oh-my-claudecode 보일러플레이트)는 과거 세션 잔재다. OMC 스킬·에이전트·상태 파일은 더 이상 쓰지 않는다.
