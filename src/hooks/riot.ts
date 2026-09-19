/** Riot 데이터 React Query 훅 (지역 KR 고정) */

import {
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import {
  getAccountByRiotId,
  getChampionMasteries,
  getLeagueEntriesByPuuid,
  getMatch,
  getMatchIdsByPuuid,
  getSummonerByPuuid,
} from '@/api/riot';
import {
  AccountDto,
  ChampionMasteryDto,
  LeagueEntryDto,
  MatchDto,
  SummonerDto,
} from '@/types/riot';

const MATCH_PAGE_SIZE = 10;

export const qk = {
  account: (gameName: string, tagLine: string) =>
    ['account', gameName.toLowerCase(), tagLine.toLowerCase()] as const,
  summoner: (puuid: string) => ['summoner', puuid] as const,
  ranks: (puuid: string) => ['ranks', puuid] as const,
  matchIds: (puuid: string) => ['matchIds', puuid] as const,
  match: (matchId: string) => ['match', matchId] as const,
  masteries: (puuid: string) => ['masteries', puuid] as const,
};

/** Riot ID → 계정(PUUID) */
export function useAccount(gameName?: string, tagLine?: string) {
  return useQuery<AccountDto>({
    queryKey: qk.account(gameName ?? '', tagLine ?? ''),
    queryFn: () => getAccountByRiotId(gameName!, tagLine!),
    enabled: !!gameName && !!tagLine,
    staleTime: 5 * 60_000,
  });
}

/** PUUID → 소환사 프로필 */
export function useSummoner(puuid?: string) {
  return useQuery<SummonerDto>({
    queryKey: qk.summoner(puuid ?? ''),
    queryFn: () => getSummonerByPuuid(puuid!),
    enabled: !!puuid,
    staleTime: 5 * 60_000,
  });
}

/** PUUID → 랭크 */
export function useRanks(puuid?: string) {
  return useQuery<LeagueEntryDto[]>({
    queryKey: qk.ranks(puuid ?? ''),
    queryFn: () => getLeagueEntriesByPuuid(puuid!),
    enabled: !!puuid,
    staleTime: 5 * 60_000,
  });
}

/** PUUID → 매치 ID 무한 목록 */
export function useMatchIds(puuid?: string) {
  return useInfiniteQuery<string[]>({
    queryKey: qk.matchIds(puuid ?? ''),
    queryFn: ({ pageParam }) =>
      getMatchIdsByPuuid(puuid!, { start: pageParam as number, count: MATCH_PAGE_SIZE }),
    enabled: !!puuid,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < MATCH_PAGE_SIZE ? undefined : allPages.length * MATCH_PAGE_SIZE,
    staleTime: 60_000,
  });
}

/** 매치 ID → 매치 상세 (immutable, 길게 캐시) */
export function useMatch(matchId?: string) {
  return useQuery<MatchDto>({
    queryKey: qk.match(matchId ?? ''),
    queryFn: () => getMatch(matchId!),
    enabled: !!matchId,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
  });
}

/** PUUID → 챔피언 숙련도 상위 */
export function useMasteries(puuid?: string, count = 8) {
  return useQuery<ChampionMasteryDto[]>({
    queryKey: [...qk.masteries(puuid ?? ''), count],
    queryFn: () => getChampionMasteries(puuid!, count),
    enabled: !!puuid,
    staleTime: 5 * 60_000,
  });
}
