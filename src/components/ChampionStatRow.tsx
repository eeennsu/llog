import { View, StyleSheet } from 'react-native';

import { ChampionIcon } from '@/components/ChampionIcon';
import { Text } from '@/components/ui/Text';
import { useChampionName } from '@/hooks/useStaticData';
import { formatKda } from '@/lib/lol';
import { ChampionStat } from '@/lib/stats';
import { colors, radii, spacing } from '@/theme';

/** 챔피언 1행: 아이콘 + 이름/게임수 + 우측 승률/KDA/CS + 얇은 승패 미니 바 */
export function ChampionStatRow({ stat }: { stat: ChampionStat }) {
  const championName = useChampionName();
  const winFlex = stat.games > 0 ? stat.wins / stat.games : 0;

  return (
    <View style={styles.container}>
      <ChampionIcon championName={stat.championName} size={40} />

      <View style={styles.center}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {championName(stat.championId, stat.championName)}
        </Text>
        <Text variant="caption" color="textMuted" tabular>
          {stat.games}경기
        </Text>
        <View style={styles.bar}>
          <View style={[styles.barWin, { flex: winFlex }]} />
          <View style={[styles.barLoss, { flex: 1 - winFlex }]} />
        </View>
      </View>

      <View style={styles.right}>
        <Text variant="caption" color="textSecondary" tabular>
          {stat.wins}승 {stat.losses}패 · {stat.winRate}%
        </Text>
        <Text variant="bodyStrong" color="text" tabular style={{ marginTop: 2 }}>
          {formatKda(stat.kills, stat.deaths, stat.assists)}
        </Text>
        <Text variant="caption" color="textMuted" tabular>
          CS {stat.csAvg.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  center: { flex: 1, gap: 2 },
  right: { alignItems: 'flex-end', gap: 1 },
  bar: {
    flexDirection: 'row',
    height: 3,
    borderRadius: radii.sm,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  barWin: { backgroundColor: colors.win },
  barLoss: { backgroundColor: colors.loss },
});
