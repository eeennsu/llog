/** LoL 도메인 포맷/매핑 유틸 */

import { ParticipantDto } from '@/types/riot';

/** 큐 ID → 한글 이름 (자주 쓰이는 것 위주) */
const QUEUE_NAMES: Record<number, string> = {
  400: '일반 (드래프트)',
  420: '솔로 랭크',
  430: '일반 (블라인드)',
  440: '자유 랭크',
  450: '무작위 총력전',
  490: '빠른 대전',
  700: '격전',
  720: '격전 (ARAM)',
  830: 'AI 입문',
  840: 'AI 초급',
  850: 'AI 중급',
  900: 'URF',
  1020: '단일 챔피언',
  1300: '돌격! 넥서스',
  1400: '궁극기 주문서',
  1700: '아레나',
  1900: 'URF',
};

export function queueName(queueId: number): string {
  return QUEUE_NAMES[queueId] ?? '기타';
}

/** 초 → "MM:SS" */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** ms 타임스탬프 → "n분/시간/일 전" */
export function timeAgo(timestampMs: number, nowMs: number): string {
  const diff = Math.max(0, nowMs - timestampMs);
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}개월 전`;
  return `${Math.floor(month / 12)}년 전`;
}

/** KDA 비율 (Perfect 처리는 호출부에서) */
export function kdaRatio(kills: number, deaths: number, assists: number): number {
  if (deaths === 0) return kills + assists;
  return (kills + assists) / deaths;
}

export function formatKda(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return 'Perfect';
  return `${kdaRatio(kills, deaths, assists).toFixed(2)}:1`;
}

/** 총 CS (미니언 + 정글) */
export function totalCs(p: Pick<ParticipantDto, 'totalMinionsKilled' | 'neutralMinionsKilled'>): number {
  return p.totalMinionsKilled + p.neutralMinionsKilled;
}

/** 분당 CS */
export function csPerMin(cs: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return cs / (durationSeconds / 60);
}

/** 포지션 라벨 */
export function positionLabel(teamPosition: string): string {
  switch (teamPosition) {
    case 'TOP':
      return '탑';
    case 'JUNGLE':
      return '정글';
    case 'MIDDLE':
      return '미드';
    case 'BOTTOM':
      return '원딜';
    case 'UTILITY':
      return '서폿';
    default:
      return '';
  }
}

/** 티어 한글 라벨 */
const TIER_LABELS: Record<string, string> = {
  IRON: '아이언',
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
  PLATINUM: '플래티넘',
  EMERALD: '에메랄드',
  DIAMOND: '다이아몬드',
  MASTER: '마스터',
  GRANDMASTER: '그랜드마스터',
  CHALLENGER: '챌린저',
};

export function tierLabel(tier: string): string {
  return TIER_LABELS[tier?.toUpperCase()] ?? tier;
}

/** 마스터 이상은 단계(I~IV)가 없으므로 티어명만 쓴다 */
const APEX_TIERS = new Set(['MASTER', 'GRANDMASTER', 'CHALLENGER']);

/** 티어 + 단계 표기 (예: '골드 II', '챌린저') */
export function tierRankLabel(tier: string, rank: string): string {
  const label = tierLabel(tier);
  return APEX_TIERS.has(tier?.toUpperCase()) ? label : `${label} ${rank}`;
}

/** 티어 대표 색상 */
export function tierColor(tier: string): string {
  switch (tier?.toUpperCase()) {
    case 'IRON':
      return '#6b6b6b';
    case 'BRONZE':
      return '#a0673f';
    case 'SILVER':
      return '#9aa4ad';
    case 'GOLD':
      return '#f0b232';
    case 'PLATINUM':
      return '#3fb6a8';
    case 'EMERALD':
      return '#1fa856';
    case 'DIAMOND':
      return '#4f7bf0';
    case 'MASTER':
      return '#9d4edd';
    case 'GRANDMASTER':
      return '#e0405e';
    case 'CHALLENGER':
      return '#f4c542';
    default:
      return '#8a8f98';
  }
}

/** 큐 타입(랭크) 라벨 */
export function queueTypeLabel(queueType: string): string {
  switch (queueType) {
    case 'RANKED_SOLO_5x5':
      return '솔로 랭크';
    case 'RANKED_FLEX_SR':
      return '자유 랭크';
    default:
      return queueType;
  }
}

/** 승률(%) 정수 */
export function winRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

/** 다시하기(remake) 기준: 게임 시간 5분 미만 */
export function isRemake(gameDurationSec: number): boolean {
  return gameDurationSec < 300;
}

/** 게임 결과 라벨 */
export function outcomeLabel(win: boolean, remake: boolean): string {
  return remake ? '다시하기' : win ? '승리' : '패배';
}

/** Riot ID 파싱: "이름#태그" → { gameName, tagLine }. 태그 없으면 KR 기본 'KR1' 미적용, null 반환 */
export function parseRiotId(
  raw: string,
): { gameName: string; tagLine: string } | null {
  const trimmed = raw.trim();
  const idx = trimmed.lastIndexOf('#');
  if (idx <= 0 || idx === trimmed.length - 1) return null;
  const gameName = trimmed.slice(0, idx).trim();
  const tagLine = trimmed.slice(idx + 1).trim();
  if (!gameName || !tagLine) return null;
  return { gameName, tagLine };
}
