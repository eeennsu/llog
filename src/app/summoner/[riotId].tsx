import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ChampionStatsView } from '@/components/ChampionStatsView';
import { MasteryStrip } from '@/components/MasteryStrip';
import { MatchRow } from '@/components/MatchRow';
import { ProfileHeader } from '@/components/ProfileHeader';
import { QueueFilter } from '@/components/QueueFilter';
import { RankCard } from '@/components/RankCard';
import { RecentSummary } from '@/components/RecentSummary';
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
import { ApiError, isRetryable } from '@/api/client';
import { parseRiotId } from '@/lib/lol';
import { matchInCategory, QUEUE_CATEGORIES, QueueCategoryKey } from '@/lib/stats';
import { useAppStore } from '@/store/useAppStore';
import { colors, radii, spacing, touchTarget } from '@/theme';

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

  const { byId, settledCount, total } = useMatchDetails(allMatchIds);

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
    const notFound = account.error instanceof ApiError && account.error.status === 404;
    const msg = notFound
      ? `'${parsed.gameName}#${parsed.tagLine}' 소환사를 찾을 수 없습니다. 이름과 태그를 확인해 주세요. (예: 소환사명#KR1)`
      : account.error instanceof ApiError
        ? account.error.message
        : '소환사를 찾을 수 없습니다.';
    return (
      <Wrapper title={parsed.gameName}>
        <ErrorView
          message={msg}
          onRetry={!notFound && isRetryable(account.error) ? () => account.refetch() : undefined}
        />
      </Wrapper>
    );
  }

  const solo = ranks.data?.find((e) => e.queueType === 'RANKED_SOLO_5x5');
  const flex = ranks.data?.find((e) => e.queueType === 'RANKED_FLEX_SR');
  // 새로고침 실패 시 캐시된 데이터가 있으면 그대로 보여준다
  const rankStatus = ranks.isLoading ? 'loading' : ranks.isError && !ranks.data ? 'error' : 'success';
  const detailsLoading = settledCount < total;
  const queueLabel = QUEUE_CATEGORIES.find((c) => c.key === queue)?.label ?? '';
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
        <RankCard label="솔로 랭크" entry={solo} status={rankStatus} />
        <RankCard label="자유 랭크" entry={flex} status={rankStatus} />
      </View>

      {/* 정찰용 한눈 판정: 선택된 큐 기준으로 집계해 아래 목록과 같은 표본을 말한다 */}
      <RecentSummary
        matches={filteredMatches}
        puuid={puuid}
        queueLabel={queue === 'all' ? undefined : queueLabel}
        loading={matchIds.isLoading || detailsLoading}
      />

      <Text variant="caption" color="textMuted" style={[styles.label, { marginTop: spacing.sm }]}>
        최근 전적
      </Text>

      {/* 굵은 선택(무엇을 볼지) → 세부 선택(어느 큐) 순서 */}
      <SegmentedToggle options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />
      <QueueFilter value={queue} onChange={setQueue} />

      {viewMode === 'stats' ? (
        <>
          <ChampionStatsView
            matches={filteredMatches}
            puuid={puuid}
            loading={detailsLoading}
          />
          {/* 숙련도는 누적 기록이라 정찰 경로가 아닌 통계 뷰에 둔다 */}
          {masteries.isError && !masteries.data ? (
            <Text variant="caption" color="textMuted" style={styles.label}>
              챔피언 숙련도를 불러오지 못했습니다 · 당겨서 새로고침
            </Text>
          ) : masteries.data && masteries.data.length > 0 ? (
            <View style={styles.masterySection}>
              <Text variant="caption" color="textMuted" style={styles.label}>
                챔피언 숙련도
              </Text>
              <MasteryStrip masteries={masteries.data} />
            </View>
          ) : null}
        </>
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
          ) : matchIds.isError ? (
            <ErrorView
              message={matchIds.error?.message ?? '전적을 불러오지 못했습니다.'}
              onRetry={isRetryable(matchIds.error) ? () => matchIds.refetch() : undefined}
            />
          ) : queue !== 'all' && detailsLoading ? (
            // 상세가 아직 안 와서 큐를 판별하지 못한 상태 — "없음"으로 단정하지 않는다
            <Loading label="필터 적용 중…" />
          ) : queue !== 'all' ? (
            <EmptyState
              icon="filter"
              title={`${queueLabel} 전적이 없습니다`}
              description="불러온 최근 전적 기준이에요. 필터를 '전체'로 바꾸거나 전적을 더 불러와 보세요."
            />
          ) : (
            <EmptyState icon="inbox" title="최근 전적이 없습니다" />
          )
        }
        ListFooterComponent={
          matchIds.isFetchingNextPage ? (
            <View style={{ paddingVertical: spacing.lg }}>
              <Loading />
            </View>
          ) : viewMode === 'stats' && matchIds.hasNextPage ? (
            // 통계 모드는 리스트가 비어 onEndReached 가 안 뜨므로 수동 버튼으로 표본 보충
            <Pressable
              onPress={() => matchIds.fetchNextPage()}
              accessibilityRole="button"
              style={({ pressed }) => [styles.loadMore, pressed && { backgroundColor: colors.hover }]}
            >
              <Text variant="bodyStrong" color="primary" align="center">
                전적 더 불러오기
              </Text>
            </Pressable>
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
  loadMore: {
    marginTop: spacing.md,
    minHeight: touchTarget,
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primarySurface,
  },
});
