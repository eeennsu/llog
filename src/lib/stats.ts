/** 챔피언별 전적 통계 집계 (순수 함수) */

import { kdaRatio, totalCs, winRate } from '@/lib/lol';
import { MatchDto } from '@/types/riot';

export type QueueCategoryKey = 'all' | 'solo' | 'flex' | 'normal' | 'aram';

export const QUEUE_CATEGORIES: { key: QueueCategoryKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'solo', label: '솔로랭크' },
  { key: 'flex', label: '자유랭크' },
  { key: 'normal', label: '일반' },
  { key: 'aram', label: 'ARAM' },
];

/** 큐 ID 가 카테고리에 속하는지 */
export function matchInCategory(queueId: number, key: QueueCategoryKey): boolean {
  switch (key) {
    case 'all':
      return true;
    case 'solo':
      return queueId === 420;
    case 'flex':
      return queueId === 440;
    case 'normal':
      return queueId === 400 || queueId === 430;
    case 'aram':
      return queueId === 450;
    default:
      return false;
  }
}

export type ChampionStat = {
  championName: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kdaRatio: number;
  csAvg: number;
};

/** remake(다시하기) 기준: 게임 시간 5분 미만 */
const REMAKE_DURATION = 300;

/** 매치 목록을 챔피언별로 집계 (게임 수 desc, 동률 시 승률 desc) */
export function aggregateChampionStats(matches: MatchDto[], puuid: string): ChampionStat[] {
  const acc = new Map<string, ChampionStat>();
  // csAvg 는 최종 평균만 담도록, 합계는 별도 누산기에 보관
  const csTotals = new Map<string, number>();

  for (const match of matches) {
    if (match.info.gameDuration < REMAKE_DURATION) continue;
    const me = match.info.participants.find((p) => p.puuid === puuid);
    if (!me) continue;

    let stat = acc.get(me.championName);
    if (!stat) {
      stat = {
        championName: me.championName,
        games: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        kdaRatio: 0,
        csAvg: 0,
      };
      acc.set(me.championName, stat);
    }

    stat.games += 1;
    if (me.win) stat.wins += 1;
    else stat.losses += 1;
    stat.kills += me.kills;
    stat.deaths += me.deaths;
    stat.assists += me.assists;
    csTotals.set(me.championName, (csTotals.get(me.championName) ?? 0) + totalCs(me));
  }

  const stats = Array.from(acc.values());
  for (const stat of stats) {
    stat.winRate = winRate(stat.wins, stat.losses);
    stat.kdaRatio = kdaRatio(stat.kills, stat.deaths, stat.assists);
    stat.csAvg = stat.games > 0 ? (csTotals.get(stat.championName) ?? 0) / stat.games : 0;
  }

  stats.sort((a, b) => (b.games - a.games) || (b.winRate - a.winRate));
  return stats;
}
