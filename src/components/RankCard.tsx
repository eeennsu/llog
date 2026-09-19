import { View, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { tierColor, tierRankLabel, winRate } from '@/lib/lol';
import { LeagueEntryDto } from '@/types/riot';
import { colors, radii, spacing } from '@/theme';

/**
 * 큐별 랭크 카드.
 * status 로 로딩·실패를 구분한다 — "언랭"은 조회에 성공했고 기록이 없을 때만 보여준다.
 */
export function RankCard({
  label,
  entry,
  status = 'success',
}: {
  label: string;
  entry?: LeagueEntryDto;
  status?: 'loading' | 'error' | 'success';
}) {
  if (status === 'loading') {
    return (
      <Card style={styles.card} accessible accessibilityLabel={`${label} 불러오는 중`}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <View style={[styles.skeleton, { width: 88, height: 18, marginTop: spacing.xs }]} />
        <View style={[styles.skeleton, { width: 48, height: 12, marginTop: spacing.xs }]} />
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card style={styles.card}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <Text variant="bodyStrong" color="textSecondary" style={{ marginTop: spacing.xs }}>
          불러오지 못함
        </Text>
        <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
          당겨서 새로고침
        </Text>
      </Card>
    );
  }

  if (!entry) {
    return (
      <Card style={styles.card}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <Text variant="title" color="textSecondary" style={{ marginTop: spacing.xs }}>
          언랭
        </Text>
      </Card>
    );
  }

  const wr = winRate(entry.wins, entry.losses);
  const color = tierColor(entry.tier);

  return (
    <Card
      style={styles.card}
      accessible
      accessibilityLabel={`${label} ${tierRankLabel(entry.tier, entry.rank)}, ${entry.leaguePoints} LP, ${entry.wins}승 ${entry.losses}패, 승률 ${wr}%`}
    >
      <View style={[styles.accent, { backgroundColor: color }]} />
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Text variant="title" numberOfLines={1} style={{ marginTop: spacing.xs, color }}>
        {tierRankLabel(entry.tier, entry.rank)}
      </Text>
      <Text variant="caption" color="textSecondary" tabular style={{ marginTop: 2 }}>
        {entry.leaguePoints} LP
      </Text>
      <View style={styles.statsRow}>
        <Text variant="caption" color="textMuted" tabular>
          {entry.wins}승 {entry.losses}패
        </Text>
        <Text variant="caption" color="textSecondary" tabular>
          {wr}%
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  skeleton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
  },
});
