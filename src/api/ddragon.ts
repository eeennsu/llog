/**
 * Data Dragon (정적 데이터) — 챔피언/아이템/룬/스펠/프로필 아이콘.
 *
 * DDragon 은 CORS 를 허용하고 API 키가 필요 없으므로 앱에서 직접 호출한다.
 * 버전과 룩업 맵은 한 번만 로드해 캐시한다.
 */

const DDRAGON = 'https://ddragon.leagueoflegends.com';
const LANG = 'ko_KR';

export type ChampionEntry = { key: string; id: string; name: string };
export type SpellEntry = { key: string; id: string; name: string };
export type RuneStyleEntry = { id: number; icon: string; name: string };
export type RunePerkEntry = { id: number; icon: string; name: string };

export type StaticData = {
  version: string;
  /** numericKey -> 챔피언 (id 는 이미지 파일명) */
  champions: Record<string, ChampionEntry>;
  /** numericKey -> 소환사 주문 */
  summonerSpells: Record<string, SpellEntry>;
  /** styleId -> 룬 계열 */
  runeStyles: Record<number, RuneStyleEntry>;
  /** perkId -> 개별 룬 */
  runePerks: Record<number, RunePerkEntry>;
};

let cached: Promise<StaticData> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`DDragon 요청 실패 (${res.status}): ${url}`);
  return (await res.json()) as T;
}

async function loadStaticData(): Promise<StaticData> {
  const versions = await fetchJson<string[]>(`${DDRAGON}/api/versions.json`);
  const version = versions[0];

  const [championJson, summonerJson, runesJson] = await Promise.all([
    fetchJson<{ data: Record<string, { key: string; id: string; name: string }> }>(
      `${DDRAGON}/cdn/${version}/data/${LANG}/champion.json`,
    ),
    fetchJson<{ data: Record<string, { key: string; id: string; name: string }> }>(
      `${DDRAGON}/cdn/${version}/data/${LANG}/summoner.json`,
    ),
    fetchJson<
      {
        id: number;
        key: string;
        icon: string;
        name: string;
        slots: { runes: { id: number; icon: string; name: string }[] }[];
      }[]
    >(`${DDRAGON}/cdn/${version}/data/${LANG}/runesReforged.json`),
  ]);

  const champions: Record<string, ChampionEntry> = {};
  for (const c of Object.values(championJson.data)) {
    champions[c.key] = { key: c.key, id: c.id, name: c.name };
  }

  const summonerSpells: Record<string, SpellEntry> = {};
  for (const s of Object.values(summonerJson.data)) {
    summonerSpells[s.key] = { key: s.key, id: s.id, name: s.name };
  }

  const runeStyles: Record<number, RuneStyleEntry> = {};
  const runePerks: Record<number, RunePerkEntry> = {};
  for (const style of runesJson) {
    runeStyles[style.id] = { id: style.id, icon: style.icon, name: style.name };
    for (const slot of style.slots) {
      for (const rune of slot.runes) {
        runePerks[rune.id] = { id: rune.id, icon: rune.icon, name: rune.name };
      }
    }
  }

  return { version, champions, summonerSpells, runeStyles, runePerks };
}

/** 정적 데이터 로드 (캐시) */
export function getStaticData(): Promise<StaticData> {
  if (!cached) cached = loadStaticData().catch((e) => {
    cached = null; // 실패 시 다음 호출에서 재시도 허용
    throw e;
  });
  return cached;
}

/* ---------- 이미지 URL 빌더 ---------- */

export function profileIconUrl(version: string, iconId: number): string {
  return `${DDRAGON}/cdn/${version}/img/profileicon/${iconId}.png`;
}

/** championImageId 는 DDragon 의 champion id (예: 'Aatrox', 'MonkeyKing') */
export function championIconUrl(version: string, championImageId: string): string {
  return `${DDRAGON}/cdn/${version}/img/champion/${championImageId}.png`;
}

/** itemId 0 은 빈 슬롯 → null */
export function itemIconUrl(version: string, itemId: number): string | null {
  if (!itemId) return null;
  return `${DDRAGON}/cdn/${version}/img/item/${itemId}.png`;
}

/** spellImageId 는 DDragon spell id (예: 'SummonerFlash') */
export function summonerSpellIconUrl(version: string, spellImageId: string): string {
  return `${DDRAGON}/cdn/${version}/img/spell/${spellImageId}.png`;
}

/** 룬/룬계열 아이콘 (버전 비종속, cdn/img/ 하위) */
export function runeIconUrl(iconPath: string): string {
  return `${DDRAGON}/cdn/img/${iconPath}`;
}
