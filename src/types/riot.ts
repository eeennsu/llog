/** Riot API 응답 타입 (앱에서 사용하는 필드 위주로 정의) */

/** account-v1 */
export type AccountDto = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

/** summoner-v4 */
export type SummonerDto = {
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  /** 일부 응답에서만 제공 */
  id?: string;
  accountId?: string;
};

/** league-v4 ranked entry */
export type LeagueEntryDto = {
  leagueId: string;
  queueType: string; // RANKED_SOLO_5x5 | RANKED_FLEX_SR ...
  tier: string; // IRON ... CHALLENGER
  rank: string; // I ~ IV
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  summonerId?: string;
  puuid?: string;
};

/** champion-mastery-v4 */
export type ChampionMasteryDto = {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  chestGranted?: boolean;
  tokensEarned?: number;
};

/** match-v5 perks (룬) */
export type PerkStyleSelection = { perk: number; var1: number; var2: number; var3: number };
export type PerkStyle = {
  description: string; // primaryStyle | subStyle
  style: number; // 룬 계열 id
  selections: PerkStyleSelection[];
};
export type ParticipantPerks = {
  statPerks: { defense: number; flex: number; offense: number };
  styles: PerkStyle[];
};

/** match-v5 participant */
export type ParticipantDto = {
  puuid: string;
  riotIdGameName?: string;
  riotIdTagline?: string;
  summonerName?: string;
  championId: number;
  championName: string;
  champLevel: number;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  win: boolean;
  teamId: number; // 100 | 200
  teamPosition: string; // TOP JUNGLE MIDDLE BOTTOM UTILITY
  individualPosition?: string;
  summoner1Id: number;
  summoner2Id: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  perks: ParticipantPerks;
};

export type TeamObjective = { first: boolean; kills: number };
export type TeamDto = {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives: {
    baron: TeamObjective;
    champion: TeamObjective;
    dragon: TeamObjective;
    inhibitor: TeamObjective;
    riftHerald: TeamObjective;
    tower: TeamObjective;
  };
};

export type MatchInfoDto = {
  gameCreation: number;
  gameStartTimestamp: number;
  gameEndTimestamp?: number;
  gameDuration: number; // 초
  gameMode: string;
  gameType: string;
  queueId: number;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  teams: TeamDto[];
};

export type MatchDto = {
  metadata: {
    matchId: string;
    participants: string[]; // puuid 목록
  };
  info: MatchInfoDto;
};

/** 에러 표준화 */
export type RiotApiError = {
  status: number;
  message: string;
};
