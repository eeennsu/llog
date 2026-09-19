import { router } from 'expo-router';

/** "gameName#tagLine" 형태로 라우트 파라미터를 구성 */
export function toRiotId(gameName: string, tagLine: string): string {
  return `${gameName}#${tagLine}`;
}

export function goToSummoner(gameName: string, tagLine: string) {
  router.push({
    pathname: '/summoner/[riotId]',
    params: { riotId: toRiotId(gameName, tagLine) },
  });
}

export function goToMatch(matchId: string, puuid: string) {
  router.push({
    pathname: '/match/[matchId]',
    params: { matchId, puuid },
  });
}
