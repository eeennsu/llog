# Autopilot Spec — 챔피언별 전적 통계 (LLog)

## 목표
소환사 화면에서 최근 매치를 집계해 **챔피언별 전적 통계**를 보여주고, **큐 타입 필터**로 전적/통계를 함께 거른다.

## 기능 요구사항
1. 최근 로드된 매치들을 챔피언별로 집계: 게임 수, 승/패, 승률, 평균 KDA(K/D/A + 비율), 평균 CS.
2. 소환사 화면(`src/app/summoner/[riotId].tsx`)에 **[전적] / [챔피언 통계]** 세그먼트 토글 추가.
3. **큐 필터** 칩: 전체 / 솔로랭크(420) / 자유랭크(440) / 일반(400,430) / ARAM(450). 필터는 전적 목록과 통계 양쪽에 동시 적용.
4. 집계 표본 수("최근 N경기 기준") 표시. 게임 수 desc 정렬, 상위 N(기본 전체 표시하되 충분).

## 제약 (필수)
- 지역 KR 고정 유지. 새 지역/플랫폼 로직 금지.
- 디자인: `src/theme` 토큰만. 강조색 시안 1개, 승/패만 블루/레드. 새 강조색·그라데이션·네온·이모지 금지.
- 기존 훅(`src/hooks/riot.ts`: `useMatchIds`, `useMatch`, `qk.match`, `getMatch`)·유틸(`src/lib/lol.ts`)·UI 프리미티브(`src/components/ui/*`) 재사용.
- **중복 fetch 금지**: 매치 상세는 `qk.match(id)` 캐시를 공유하는 `useQueries`로 가져와 `MatchRow`와 캐시 공유.

## 설계 (구현 지침)

### 신규 파일
- `src/lib/stats.ts` (순수 함수)
  - `export type QueueCategoryKey = 'all' | 'solo' | 'flex' | 'normal' | 'aram'`
  - `export const QUEUE_CATEGORIES: { key: QueueCategoryKey; label: string }[]`
    - all=전체, solo=솔로랭크, flex=자유랭크, normal=일반, aram=ARAM
  - `export function matchInCategory(queueId: number, key: QueueCategoryKey): boolean`
    - all→true, solo→420, flex→440, normal→[400,430], aram→450
  - `export type ChampionStat = { championName: string; games: number; wins: number; losses: number; winRate: number; kills: number; deaths: number; assists: number; kdaRatio: number; csAvg: number }`
  - `export function aggregateChampionStats(matches: MatchDto[], puuid: string): ChampionStat[]`
    - 각 match에서 `participants.find(p=>p.puuid===puuid)`로 내 참가자 추출, championName 키로 누적.
    - 평균은 합계/게임수. winRate=round(wins/games*100). kdaRatio=lib/lol `kdaRatio` 재사용(합산 K,D,A 기준). csAvg=평균 totalCs(lib/lol `totalCs`). games desc 정렬.
    - remake(gameDuration<300)는 제외(집계 왜곡 방지). 정렬 동률 시 winRate desc.

### 신규 훅
- `src/hooks/useMatchDetails.ts`
  - `export function useMatchDetails(matchIds: string[])`
  - `useQueries`로 각 id를 `{ queryKey: qk.match(id), queryFn: () => getMatch(id), staleTime: Infinity }` 조회(=MatchRow와 동일 키 → 캐시 공유, 중복 fetch 없음).
  - 반환: `{ matches: MatchDto[] (로드된 것만), byId: Record<string,MatchDto>, loadedCount, total }`.

### 신규 컴포넌트 (theme 토큰만, Feather 아이콘 허용)
- `src/components/QueueFilter.tsx` — 칩 행. props: `value, onChange`. 선택 칩은 시안 보더+옅은 시안 표면(`colors.primarySurface/primaryBorder`), 비선택은 중립 보더.
- `src/components/SegmentedToggle.tsx` — 2개 세그먼트 토글(재사용 가능하게 options 배열). 선택 세그먼트만 시안 텍스트/표면.
- `src/components/ChampionStatRow.tsx` — props: `stat: ChampionStat`. `ChampionIcon(championName, size 40)` + 이름/게임수 + 우측 승률(승/패) + KDA + CS. 승률 텍스트 색은 중립(시맨틱 승/패 색은 막대 등에만 절제 사용; 과용 금지 — 승률은 textSecondary, 옆에 얇은 win/loss 미니 바 정도만).
- `src/components/ChampionStatsView.tsx` — props: `matches, puuid, sampleCount`. 내부에서 `aggregateChampionStats` 호출, 헤더 "최근 N경기 기준", 빈 상태(`EmptyState`) 처리, 리스트 렌더(ScrollView 아님 — 부모 FlatList 헤더/단일 뷰로 들어감).

### 화면 통합 — `src/app/summoner/[riotId].tsx`
- 로컬 상태: `viewMode: 'matches'|'stats'`, `queue: QueueCategoryKey` (기본 'all').
- `allMatchIds`에서 `useMatchDetails(allMatchIds)`로 상세 맵 확보.
- `filteredIds = allMatchIds.filter(id => byId[id] ? matchInCategory(byId[id].info.queueId, queue) : queue==='all')` — 로딩 중 미상세는 all에서만 노출(필터 적용 시 상세 도착 후 표시).
- `filteredMatches = filteredIds.map(id=>byId[id]).filter(Boolean)`.
- ListHeader: 기존 프로필/랭크/숙련도 + **QueueFilter** + **SegmentedToggle**.
- viewMode==='matches': FlatList data=filteredIds (기존 MatchRow 유지, now 전달).
- viewMode==='stats': FlatList data=[] + ListHeader에 `ChampionStatsView` 포함(또는 분기 렌더). 단순화를 위해 stats 모드에서는 FlatList 대신 헤더 영역에 통계 뷰 렌더하고 매치 리스트 숨김.
- 큐 필터가 'all'이 아니고 더 많은 표본이 필요하면 기존 무한스크롤 `fetchNextPage`로 보충(있는 만큼 집계, 표본 수 표시로 정직하게).

## 검증
- `npm run typecheck` 통과.
- `npx expo export --platform android --output-dir .expo-export-check` 성공(이후 삭제).
- 잔존 하드코딩 색 없음(grep), 새 강조색 없음.
