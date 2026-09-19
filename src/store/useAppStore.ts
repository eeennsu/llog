/** 앱 클라이언트 상태: 최근 검색, 즐겨찾기 (AsyncStorage 영속). 지역은 KR 고정이라 저장하지 않음. */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SummonerRef = {
  gameName: string;
  tagLine: string;
  puuid?: string;
  profileIconId?: number;
  summonerLevel?: number;
  updatedAt: number;
};

export function summonerKey(gameName: string, tagLine: string): string {
  return `${gameName.toLowerCase()}#${tagLine.toLowerCase()}`;
}

const MAX_RECENT = 15;

type AppState = {
  recentSearches: SummonerRef[];
  favorites: SummonerRef[];
  addRecent: (ref: SummonerRef) => void;
  removeRecent: (key: string) => void;
  clearRecent: () => void;
  toggleFavorite: (ref: SummonerRef) => void;
  isFavorite: (gameName: string, tagLine: string) => boolean;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      favorites: [],

      addRecent: (ref) =>
        set((state) => {
          const key = summonerKey(ref.gameName, ref.tagLine);
          const filtered = state.recentSearches.filter(
            (r) => summonerKey(r.gameName, r.tagLine) !== key,
          );
          return { recentSearches: [ref, ...filtered].slice(0, MAX_RECENT) };
        }),

      removeRecent: (key) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (r) => summonerKey(r.gameName, r.tagLine) !== key,
          ),
        })),

      clearRecent: () => set({ recentSearches: [] }),

      toggleFavorite: (ref) =>
        set((state) => {
          const key = summonerKey(ref.gameName, ref.tagLine);
          const exists = state.favorites.some(
            (r) => summonerKey(r.gameName, r.tagLine) === key,
          );
          return {
            favorites: exists
              ? state.favorites.filter((r) => summonerKey(r.gameName, r.tagLine) !== key)
              : [ref, ...state.favorites],
          };
        }),

      isFavorite: (gameName, tagLine) => {
        const key = summonerKey(gameName, tagLine);
        return get().favorites.some((r) => summonerKey(r.gameName, r.tagLine) === key);
      },
    }),
    {
      name: 'llog-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favorites: state.favorites,
      }),
    },
  ),
);
