# LLog

리그 오브 레전드 **전적검색 모바일 앱** (Expo + React Native + TypeScript).
Riot ID(`소환사명#태그`)로 한국(KR) 서버의 소환사 프로필 · 랭크 · 매치 히스토리 · 매치 상세를 조회합니다.

> 지역은 **한국(KR) 고정**입니다. (platform=`kr`, regional=`asia`)

## 구조

```
LLog/
  src/
    app/                     # Expo Router 화면
      index.tsx              # 검색 + 최근검색 + 즐겨찾기
      summoner/[riotId].tsx  # 프로필 + 랭크 + 숙련도 + 매치 히스토리(무한스크롤)
      match/[matchId].tsx    # 매치 상세 스코어보드
    api/                     # 프록시 클라이언트 / Riot 엔드포인트 / DDragon / 지역 상수
    hooks/                   # React Query 훅 (riot, useStaticData)
    components/              # UI 컴포넌트 (ui/ 프리미티브 포함)
    store/                   # Zustand (최근검색/즐겨찾기, AsyncStorage 영속)
    lib/                     # 포맷·도메인 유틸, 네비게이션, QueryClient
    theme/                   # 디자인 토큰 (다크 전용, 시안 단일 강조 + 중립 그레이)
    types/                   # Riot API 타입
  server/                    # Riot API 키를 은닉하는 Vercel 프록시 (독립 배포)
```

## 아키텍처 핵심

- **API 키는 앱에 절대 두지 않는다.** Riot은 CORS 미지원 + 클라이언트 키 노출을 금지하므로,
  모든 Riot 요청은 `server/` 프록시를 경유한다(`X-Riot-Token` 주입). 앱은 `EXPO_PUBLIC_API_BASE` 만 안다.
- **Riot ID 표준**: `account-v1`로 PUUID 해석 → `summoner-v4`/`league-v4`/`match-v5`/`champion-mastery-v4` 호출.
- **정적 데이터**: Data Dragon은 CORS 허용 + 키 불필요 → 앱에서 직접 호출(챔피언/아이템/룬/스펠/프로필 아이콘).
- **상태**: 서버 상태는 TanStack Query(캐싱/무한스크롤/재시도), 클라이언트 상태는 Zustand(+persist).

## 실행

### 1) 프록시 (server)

```bash
cd server
npm install
cp .env.example .env.local      # RIOT_API_KEY 입력 (https://developer.riotgames.com, 24h마다 갱신)
npm run dev                     # http://localhost:3000
```

### 2) 앱

```bash
# 루트에서
cp .env.example .env            # EXPO_PUBLIC_API_BASE=http://localhost:3000
npm install
npm run start                   # Expo Dev Server (a: Android / i: iOS / w: Web)
```

> 실기기에서 테스트할 때는 `EXPO_PUBLIC_API_BASE` 를 PC의 LAN IP(예: `http://192.168.0.x:3000`)로 바꾸세요.

## 검증

- `npm run typecheck` — 타입 통과
- 프록시 + 앱 동시 구동 후 KR 계정 1건 조회: 프로필 → 랭크 → 매치목록 → 매치상세
- 에러 케이스: 잘못된 Riot ID(404) / 만료 키(403) / rate limit(429) → 에러 뷰 표시

## 디자인 원칙

다크 전용. 강조색은 **시안 하나**(활성/포커스/핵심 수치 등 의도 있는 지점에만). 승/패는 블루/레드(시맨틱 한정),
베이스는 중립 그레이. 8pt 그리드, 명확한 타이포 위계, 얇은 보더 + 미묘한 표면 단차로 영역 분리.
모든 색/간격/타이포는 `src/theme` 토큰을 사용한다.
