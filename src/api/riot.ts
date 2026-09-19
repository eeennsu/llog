/** Riot API 엔드포인트 래퍼 (프록시 경유, 지역은 KR 고정) */

import { riotFetch } from '@/api/client';
import { ACCOUNT_REGIONAL, PLATFORM, REGIONAL } from '@/api/regions';
import {
  AccountDto,
  ChampionMasteryDto,
  LeagueEntryDto,
  MatchDto,
  SummonerDto,
} from '@/types/riot';

/** Riot ID (gameName#tagLine) → 계정 정보(PUUID 포함) */
export function getAccountByRiotId(
  gameName: string,
  tagLine: string,
): Promise<AccountDto> {
  return riotFetch<AccountDto>(
    ACCOUNT_REGIONAL,
    `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(
      tagLine,
    )}`,
  );
}

/** PUUID → 소환사 정보 */
export function getSummonerByPuuid(puuid: string): Promise<SummonerDto> {
  return riotFetch<SummonerDto>(
    PLATFORM,
    `/lol/summoner/v4/summoners/by-puuid/${puuid}`,
  );
}

/** PUUID → 랭크 엔트리 목록 (솔로/자유) */
export function getLeagueEntriesByPuuid(puuid: string): Promise<LeagueEntryDto[]> {
  return riotFetch<LeagueEntryDto[]>(
    PLATFORM,
    `/lol/league/v4/entries/by-puuid/${puuid}`,
  );
}

/** PUUID → 매치 ID 목록 */
export function getMatchIdsByPuuid(
  puuid: string,
  opts: { start?: number; count?: number; queue?: number } = {},
): Promise<string[]> {
  return riotFetch<string[]>(REGIONAL, `/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
    start: opts.start ?? 0,
    count: opts.count ?? 20,
    queue: opts.queue,
  });
}

/** 매치 ID → 매치 상세 */
export function getMatch(matchId: string): Promise<MatchDto> {
  return riotFetch<MatchDto>(REGIONAL, `/lol/match/v5/matches/${matchId}`);
}

/** PUUID → 챔피언 숙련도 상위 목록 */
export function getChampionMasteries(
  puuid: string,
  count = 10,
): Promise<ChampionMasteryDto[]> {
  return riotFetch<ChampionMasteryDto[]>(
    PLATFORM,
    `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top`,
    { count },
  );
}
