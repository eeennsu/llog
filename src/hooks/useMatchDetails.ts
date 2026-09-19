/** 매치 ID 목록 → 매치 상세 (MatchRow 와 qk.match 캐시 공유, 중복 fetch 없음) */

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import { getMatch } from '@/api/riot';
import { qk } from '@/hooks/riot';
import { MatchDto } from '@/types/riot';

export function useMatchDetails(matchIds: string[]) {
  const results = useQueries({
    queries: matchIds.map((id) => ({
      queryKey: qk.match(id),
      queryFn: () => getMatch(id),
      staleTime: Infinity,
      enabled: !!id,
    })),
  });

  // results 는 매 렌더 새 배열이므로, 해결된 매치 집합이 바뀔 때만 변하는 안정적 시그니처로 메모이즈
  const signature = matchIds.map((id, i) => (results[i]?.data ? id : '')).join('|');

  return useMemo(() => {
    const byId: Record<string, MatchDto> = {};
    const matches: MatchDto[] = [];
    for (let i = 0; i < matchIds.length; i++) {
      const data = results[i]?.data;
      if (data) {
        byId[matchIds[i]] = data;
        matches.push(data);
      }
    }
    return { matches, byId, loadedCount: matches.length, total: matchIds.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
}
