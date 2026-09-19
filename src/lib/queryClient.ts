import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1분
      gcTime: 10 * 60_000,
      retry: (failureCount, error) => {
        // 4xx (잘못된 요청/404/403)는 재시도하지 않음, 429/5xx만 1회 재시도
        if (error instanceof ApiError) {
          if (error.status === 429 || error.status >= 500) return failureCount < 1;
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
