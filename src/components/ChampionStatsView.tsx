import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { ChampionStatRow } from '@/components/ChampionStatRow';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/ui/States';
import { aggregateChampionStats } from '@/lib/stats';
import { MatchDto } from '@/types/riot';
import { spacing } from '@/theme';

type Props = {
  matches: MatchDto[];
  puuid: string;
  loading?: boolean;
};

/** 챔피언별 통계 뷰 (부모 FlatList 헤더/단일 뷰로 들어감 — 자체 ScrollView 없음) */
export function ChampionStatsView({ matches, puuid, loading }: Props) {
  const stats = useMemo(() => aggregateChampionStats(matches, puuid), [matches, puuid]);
  // remake 제외 후 실제 집계된 게임 수 (헤더 표기와 집계 결과 일치 보장)
  const totalGames = stats.reduce((sum, s) => sum + s.games, 0);

  if (stats.length === 0) {
    return (
      <EmptyState
        icon="bar-chart-2"
        title="집계할 전적이 없습니다"
        description="전적을 더 불러오거나 큐 필터를 변경해 보세요."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="caption" color="textMuted" style={styles.header}>
        최근 {totalGames}경기 기준{loading ? ' · 불러오는 중…' : ''}
      </Text>
      {stats.map((stat) => (
        <ChampionStatRow key={stat.championName} stat={stat} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { marginLeft: spacing.xs, letterSpacing: 0.5 },
});
