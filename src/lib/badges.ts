/** 매치 뱃지 계산 (순수 함수) — 한 매치의 참가자 전원을 비교해 해당하는 뱃지를 모두 부여 */

import { csPerMin, kdaRatio, totalCs } from '@/lib/lol';
import { MatchDto, ParticipantDto } from '@/types/riot';

export type BadgeKey =
  | 'mvp'
  | 'ace'
  | 'penta'
  | 'quadra'
  | 'triple'
  | 'deathless'
  | 'damage'
  | 'kills'
  | 'cs'
  | 'gold'
  | 'vision'
  | 'tank'
  | 'demolish'
  | 'killParticipation'
  | 'soloKills';

export type Badge = {
  key: BadgeKey;
  label: string;
  /** 시안 강조 여부 (MVP·펜타킬만) */
  highlight: boolean;
};

/** 표시 순서 = 이 배열 순서 */
const BADGES: Record<BadgeKey, Omit<Badge, 'key'>> = {
  mvp: { label: 'MVP', highlight: true },
  ace: { label: 'ACE', highlight: false },
  penta: { label: '펜타킬', highlight: true },
  quadra: { label: '쿼드라킬', highlight: false },
  triple: { label: '트리플킬', highlight: false },
  deathless: { label: '불사', highlight: false },
  damage: { label: 'PK신', highlight: false },
  kills: { label: '킬왕', highlight: false },
  cs: { label: 'CS왕', highlight: false },
  gold: { label: '부자', highlight: false },
  vision: { label: '시야왕', highlight: false },
  tank: { label: '탱커', highlight: false },
  demolish: { label: '철거반', highlight: false },
  killParticipation: { label: '관여왕', highlight: false },
  soloKills: { label: '솔킬왕', highlight: false },
};
const ORDER = Object.keys(BADGES) as BadgeKey[];

/** remake(다시하기) 기준: 5분 미만 — stats.ts 와 동일 */
const REMAKE_DURATION = 300;
/** 불사: 너무 짧은 게임의 0데스는 의미 없음 */
const DEATHLESS_MIN_DURATION = 15 * 60;
/** CS왕: 로비 최고 분당 CS 가 이보다 낮으면 CS 가 무의미한 모드(아레나 등)로 보고 생략 */
const CS_MODE_MIN_CSPM = 3;
/** 시야왕: 소환사의 협곡에서만 (칼바람 등은 시야 개념이 약함) */
const SUMMONERS_RIFT_MAP_ID = 11;

type Metric = { key: BadgeKey; value: (p: ParticipantDto) => number };

/** "10명 중 1등" 류 지표. 최고값이 0 이면 아무도 받지 않고, 동점은 모두 받는다 */
const TOP_METRICS: Metric[] = [
  { key: 'damage', value: (p) => p.totalDamageDealtToChampions },
  { key: 'kills', value: (p) => p.kills },
  { key: 'cs', value: (p) => totalCs(p) },
  { key: 'gold', value: (p) => p.goldEarned },
  { key: 'vision', value: (p) => p.visionScore },
  { key: 'tank', value: (p) => p.totalDamageTaken ?? 0 },
  { key: 'demolish', value: (p) => p.damageDealtToBuildings ?? 0 },
  { key: 'killParticipation', value: (p) => p.challenges?.killParticipation ?? 0 },
  { key: 'soloKills', value: (p) => p.challenges?.soloKills ?? 0 },
];

function teamKills(participants: ParticipantDto[], teamId: number): number {
  return participants.filter((p) => p.teamId === teamId).reduce((s, p) => s + p.kills, 0);
}

/** MVP/ACE 점수: KDA(10 상한) + 팀 내 킬관여·딜 비중 */
function performanceScore(p: ParticipantDto, participants: ParticipantDto[]): number {
  const tk = teamKills(participants, p.teamId);
  const kp = p.challenges?.killParticipation ?? (tk > 0 ? (p.kills + p.assists) / tk : 0);
  const teamDamage = participants
    .filter((q) => q.teamId === p.teamId)
    .reduce((s, q) => s + q.totalDamageDealtToChampions, 0);
  const dmgShare = teamDamage > 0 ? p.totalDamageDealtToChampions / teamDamage : 0;
  return Math.min(kdaRatio(p.kills, p.deaths, p.assists), 10) + kp * 10 + dmgShare * 10;
}

/** 매치의 참가자별 뱃지 (puuid → 표시 순서대로 정렬된 뱃지 목록) */
export function computeMatchBadges(match: MatchDto): Record<string, Badge[]> {
  const { participants, gameDuration, mapId } = match.info;
  const earned = new Map<string, Set<BadgeKey>>(
    participants.map((p) => [p.puuid, new Set<BadgeKey>()]),
  );
  const result: Record<string, Badge[]> = {};

  if (gameDuration < REMAKE_DURATION || participants.length === 0) {
    for (const p of participants) result[p.puuid] = [];
    return result;
  }

  const give = (p: ParticipantDto, key: BadgeKey) => earned.get(p.puuid)!.add(key);

  // 1등 지표
  const maxCspm = Math.max(...participants.map((p) => csPerMin(totalCs(p), gameDuration)));
  for (const metric of TOP_METRICS) {
    if (metric.key === 'cs' && maxCspm < CS_MODE_MIN_CSPM) continue;
    if (metric.key === 'vision' && mapId !== SUMMONERS_RIFT_MAP_ID) continue;
    const max = Math.max(...participants.map(metric.value));
    if (max <= 0) continue;
    for (const p of participants) if (metric.value(p) === max) give(p, metric.key);
  }

  // MVP(승리팀 최고점) / ACE(패배팀 최고점) — 블루/레드 2팀 구조일 때만 (아레나 등 다팀 모드 제외)
  const twoTeams = participants.every((p) => p.teamId === 100 || p.teamId === 200);
  for (const [won, key] of twoTeams
    ? ([
        [true, 'mvp'],
        [false, 'ace'],
      ] as const)
    : []) {
    const side = participants.filter((p) => p.win === won);
    if (side.length === 0) continue;
    const scores = side.map((p) => performanceScore(p, participants));
    const best = Math.max(...scores);
    side.forEach((p, i) => scores[i] === best && give(p, key));
  }

  // 개인 조건
  for (const p of participants) {
    if (p.pentaKills > 0) give(p, 'penta');
    else if (p.quadraKills > 0) give(p, 'quadra');
    else if (p.tripleKills > 0) give(p, 'triple');
    if (p.deaths === 0 && gameDuration >= DEATHLESS_MIN_DURATION) give(p, 'deathless');
  }

  for (const p of participants) {
    const keys = earned.get(p.puuid)!;
    result[p.puuid] = ORDER.filter((k) => keys.has(k)).map((k) => ({ key: k, ...BADGES[k] }));
  }
  return result;
}
