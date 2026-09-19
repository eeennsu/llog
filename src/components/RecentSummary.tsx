import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { ChampionIcon } from '@/components/ChampionIcon';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useChampionName } from '@/hooks/useStaticData';
import { winRate } from '@/lib/lol';
import { aggregateChampionStats } from '@/lib/stats';
import { MatchDto } from '@/types/riot';
import { colors, radii, spacing } from '@/theme';

const TOP_CHAMPIONS = 3;

/**
 * 한눈 판정: 불러온 최근 전적의 승패·승률과 가장 많이 한 챔피언 3개.
 * 로딩 화면 정찰 시 스크롤 없이 상대 폼을 읽게 하는 요약 (다시하기 제외).
 * matches 는 선택된 큐 필터가 적용된 목록이고, queueLabel 로 그 기준을 밝힌다('전체'면 생략).
 */
export function RecentSummary({
  matches,
  puuid,
  queueLabel,
  loading,
}: {
  matches: MatchDto[];
  puuid: string;
  queueLabel?: string;
  loading?: boolean;
}) {
  const stats = useMemo(() => aggregateChampionStats(matches, puuid), [matches, puuid]);
  const championName = useChampionName();
  const wins = stats.reduce((sum, s) => sum + s.wins, 0);
  const losses = stats.reduce((sum, s) => sum + s.losses, 0);
  const games = wins + losses;

  // 첫 상세가 오기 전에는 자리를 잡아 두어 아래 목록이 밀리지 않게 한다
  if (games === 0) return loading ? <RecentSummarySkeleton /> : null;

  const wr = winRate(wins, losses);
  const top = stats.slice(0, TOP_CHAMPIONS);
  const scope = queueLabel ? `${queueLabel} 최근 ${games}판` : `최근 ${games}판`;

  return (
    <Card
      style={styles.card}
      accessible
      accessibilityLabel={`${scope} ${wins}승 ${losses}패, 승률 ${wr}%. 주 챔피언 ${top
        .map((s) => `${championName(s.championId, s.championName)} ${s.games}판`)
        .join(', ')}`}
    >
      <View style={styles.record}>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {scope}{loading ? ' · 집계 중' : ''}
        </Text>
        <View style={styles.recordLine}>
          <Text variant="h2" tabular style={{ color: colors.win }}>
            {wins}승
          </Text>
          <Text variant="h2" tabular style={{ color: colors.loss }}>
            {losses}패
          </Text>
          <Text variant="title" color="textSecondary" tabular>
            {wr}%
          </Text>
        </View>
      </View>

      <View style={styles.champs}>
        {top.map((s) => (
          <View key={s.championName} style={styles.champ}>
            <ChampionIcon championName={s.championName} size={32} />
            <Text variant="micro" color="textSecondary" tabular>
              {s.games}판 {s.winRate}%
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** 실제 카드와 같은 줄 높이(caption 16 · h2 24 / 아이콘 32 · micro 14)로 자리를 잡는다 */
function RecentSummarySkeleton() {
  return (
    <Card style={styles.card} accessible accessibilityLabel="최근 전적 집계 중">
      <View style={styles.record}>
        <View style={[styles.box, { width: 72, height: 16 }]} />
        <View style={[styles.box, { width: 120, height: 24 }]} />
      </View>
      <View style={styles.champs}>
        {Array.from({ length: TOP_CHAMPIONS }, (_, i) => (
          <View key={i} style={styles.champ}>
            <View style={[styles.box, { width: 32, height: 32 }]} />
            <View style={[styles.box, { width: 40, height: 14 }]} />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  record: { flexShrink: 1, gap: spacing.xxs },
  recordLine: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  champs: { flexDirection: 'row', gap: spacing.md },
  champ: { alignItems: 'center', gap: spacing.xs },
  box: { backgroundColor: colors.surfaceElevated, borderRadius: radii.sm },
});
