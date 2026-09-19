import { View, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { tierColor, tierLabel, winRate } from '@/lib/lol';
import { LeagueEntryDto } from '@/types/riot';
import { colors, radii, spacing } from '@/theme';

export function RankCard({
  label,
  entry,
}: {
  label: string;
  entry?: LeagueEntryDto;
}) {
  if (!entry) {
    return (
      <Card style={styles.card}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <Text variant="title" color="textSecondary" style={{ marginTop: spacing.xs }}>
          Unranked
        </Text>
      </Card>
    );
  }

  const wr = winRate(entry.wins, entry.losses);
  const color = tierColor(entry.tier);

  return (
    <Card style={styles.card}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Text variant="title" style={{ marginTop: spacing.xs, color }}>
        {tierLabel(entry.tier)} {entry.rank}
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
});
