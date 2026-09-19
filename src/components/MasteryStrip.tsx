import { ScrollView, View, StyleSheet } from 'react-native';

import { ChampionIcon } from '@/components/ChampionIcon';
import { Text } from '@/components/ui/Text';
import { useStaticData } from '@/hooks/useStaticData';
import { ChampionMasteryDto } from '@/types/riot';
import { spacing } from '@/theme';

function formatPoints(points: number): string {
  if (points >= 10000) return `${(points / 10000).toFixed(1)}만`;
  return points.toLocaleString();
}

export function MasteryStrip({ masteries }: { masteries: ChampionMasteryDto[] }) {
  const { data } = useStaticData();
  if (masteries.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {masteries.map((m) => {
        const name = data?.champions[String(m.championId)]?.name;
        return (
          <View
            key={m.championId}
            style={styles.item}
            accessible
            accessibilityLabel={`${name ?? '챔피언'} 숙련도 ${m.championLevel}레벨, ${formatPoints(m.championPoints)}점`}
          >
            <ChampionIcon championKey={m.championId} size={44} level={m.championLevel} />
            <Text variant="micro" color="textMuted" tabular style={{ marginTop: spacing.sm }}>
              {formatPoints(m.championPoints)}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  item: { alignItems: 'center', minWidth: 44 },
});
