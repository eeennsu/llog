import { useQuery } from '@tanstack/react-query';

import { getStaticData, StaticData } from '@/api/ddragon';

/** DDragon 정적 데이터 (버전/챔피언/아이템/룬/스펠 맵) */
export function useStaticData() {
  return useQuery<StaticData>({
    queryKey: ['ddragon'],
    queryFn: getStaticData,
    staleTime: 24 * 60 * 60_000, // 하루
    gcTime: Infinity,
  });
}

/**
 * championId(숫자 key) → 한국어 챔피언 이름.
 * 정적 데이터 로드 전이거나 신규 챔피언이라 맵에 없으면 match-v5 의 championName(영문 id)으로 대체한다.
 */
export function useChampionName() {
  const { data } = useStaticData();
  return (championId: number, fallback: string) =>
    data?.champions[String(championId)]?.name ?? fallback;
}
