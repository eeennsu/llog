import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ChampionStatsView } from '@/components/ChampionStatsView';
import { MasteryStrip } from '@/components/MasteryStrip';
import { MatchRow } from '@/components/MatchRow';
import { ProfileHeader } from '@/components/ProfileHeader';
import { QueueFilter } from '@/components/QueueFilter';
import { RankCard } from '@/components/RankCard';
import { SegmentedToggle } from '@/components/SegmentedToggle';
import { Text } from '@/components/ui/Text';
import { EmptyState, ErrorView, Loading } from '@/components/ui/States';
import {
  useAccount,
  useMasteries,
  useMatchIds,
  useRanks,
  useSummoner,
} from '@/hooks/riot';
import { useMatchDetails } from '@/hooks/useMatchDetails';
import { ApiError } from '@/api/client';
import { parseRiotId } from '@/lib/lol';
import { matchInCategory, QueueCategoryKey } from '@/lib/stats';
import { useAppStore } from '@/store/useAppStore';
import { colors, spacing } from '@/theme';

type ViewMode = 'matches' | 'stats';

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'matches', label: '전적' },
  { key: 'stats', label: '챔피언 통계' },
];

export default function SummonerScreen() {
  const { riotId } = useLocalSearchParams<{ riotId: string }>();
  const parsed = useMemo(() => (riotId ? parseRiotId(riotId) : null), [riotId]);

  const account = useAccount(parsed?.gameName, parsed?.tagLine);
  const puuid = account.data?.puuid;

  const summoner = useSummoner(puuid);
  const ranks = useRanks(puuid);
  const masteries = useMasteries(puuid);
  const matchIds = useMatchIds(puuid);

  const addRecent = useAppStore((s) => s.addRecent);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);

  const [now, setNow] = useState(() => Date.now());
  const [viewMode, setViewMode] = useState<ViewMode>('matches');
  const [queue, setQueue] = useState<QueueCategoryKey>('all');

  // 검색 성공 시 최근 검색에 기록
  useEffect(() => {
    if (account.data && summoner.data) {
      addRecent({
        gameName: account.data.gameName,
        tagLine: account.data.tagLine,
        puuid: account.data.puuid,
        profileIconId: summoner.data.profileIconId,
        summonerLevel: summoner.data.summonerLevel,
        updatedAt: Date.now(),
      });
    }
  }, [account.data, summoner.data, addRecent]);

  const allMatchIds = useMemo(
    () => matchIds.data?.pages.flat() ?? [],
    [matchIds.data],
  );

  const { byId, loadedCount, total } = useMatchDetails(allMatchIds);

  const filteredIds = useMemo(
    () =>
      allMatchIds.filter((id) =>
        byId[id] ? matchInCategory(byId[id].info.queueId, queue) : queue === 'all',
      ),
    [allMatchIds, byId, queue],
  );

  const filteredMatches = useMemo(
    () => filteredIds.map((id) => byId[id]).filter(Boolean),
    [filteredIds, byId],
  );

  if (!parsed) {
    return (
      <Wrapper title="">
        <ErrorView message="잘못된 Riot ID 입니다. (소환사명#태그)" />
      </Wrapper>
    );
  }

  if (account.isLoading) {
    return (
      <Wrapper title={parsed.gameName}>
        <Loading label="소환사 정보를 불러오는 중…" />
      </Wrapper>
    );
  }

  if (account.isError || !puuid) {
    const msg =
      account.error instanceof ApiError
        ? account.error.message
        : '소환사를 찾을 수 없습니다.';
    return (
      <Wrapper title={parsed.gameName}>
        <ErrorView message={msg} onRetry={() => account.refetch()} />
      </Wrapper>
    );
  }

  const solo = ranks.data?.find((e) => e.queueType === 'RANKED_SOLO_5x5');
  const flex = ranks.data?.find((e) => e.queueType === 'RANKED_FLEX_SR');
  const fav = isFavorite(account.data!.gameName, account.data!.tagLine);

  const onRefresh = () => {
    setNow(Date.now());
    account.refetch();
    summoner.refetch();
    ranks.refetch();
    masteries.refetch();
    matchIds.refetch();
  };

  const header = (
    <View style={styles.headerWrap}>
      <ProfileHeader
        gameName={account.data!.gameName}
        tagLine={account.data!.tagLine}
        profileIconId={summoner.data?.profileIconId}
        level={summoner.data?.summonerLevel}
        favorite={fav}
        onToggleFavorite={() =>
          toggleFavorite({
            gameName: account.data!.gameName,
            tagLine: account.data!.tagLine,
            puuid,
            profileIconId: summoner.data?.profileIconId,
            summonerLevel: summoner.data?.summonerLevel,
            updatedAt: Date.now(),
          })
        }
      />

      <View style={styles.ranks}>
        <RankCard label="솔로 랭크" entry={solo} />
        <RankCard label="자유 랭크" entry={flex} />
      </View>

      {masteries.data && masteries.data.length > 0 ? (
        <View style={styles.masterySection}>
          <Text variant="caption" color="textMuted" style={styles.label}>
            챔피언 숙련도
          </Text>
          <MasteryStrip masteries={masteries.data} />
        </View>
      ) : null}

      <Text variant="caption" color="textMuted" style={[styles.label, { marginTop: spacing.sm }]}>
        최근 전적
      </Text>

      <QueueFilter value={queue} onChange={setQueue} />
      <SegmentedToggle options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />

      {viewMode === 'stats' ? (
        <ChampionStatsView
          matches={filteredMatches}
          puuid={puuid}
          loading={loadedCount < total}
        />
      ) : null}
    </View>
  );

  return (
    <Wrapper title={account.data!.gameName}>
      <FlatList
        data={viewMode === 'matches' ? filteredIds : []}
        keyExtractor={(id) => id}
        renderItem={({ item }) => <MatchRow matchId={item} puuid={puuid} now={now} />}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (matchIds.hasNextPage && !matchIds.isFetchingNextPage) {
            matchIds.fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={matchIds.isRefetching && !matchIds.isFetchingNextPage}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          viewMode === 'stats' ? null : matchIds.isLoading ? (
            <Loading label="전적을 불러오는 중…" />
          ) : (
            <EmptyState icon="inbox" title="최근 전적이 없습니다" />
          )
        }
        ListFooterComponent={
          matchIds.isFetchingNextPage ? (
            <View style={{ paddingVertical: spacing.lg }}>
              <Loading />
            </View>
          ) : null
        }
      />
    </Wrapper>
  );
}

function Wrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title }} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.huge },
  headerWrap: { gap: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  ranks: { flexDirection: 'row', gap: spacing.md },
  masterySection: { gap: spacing.sm },
  label: { marginLeft: spacing.xs, letterSpacing: 0.5 },
});
