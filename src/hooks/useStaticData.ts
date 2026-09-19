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
