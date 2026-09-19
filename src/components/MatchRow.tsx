import { Feather } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';

import { isRetryable } from '@/api/client';
import { BadgeList } from '@/components/BadgeList';
import { ChampionIcon } from '@/components/ChampionIcon';
import { ItemSlots } from '@/components/ItemSlots';
import { SpellRunes } from '@/components/SpellRunes';
import { Text } from '@/components/ui/Text';
import { useMatch } from '@/hooks/riot';
import { useChampionName } from '@/hooks/useStaticData';
import { computeMatchBadges } from '@/lib/badges';
import { goToMatch } from '@/lib/nav';
import {
  csPerMin,
  formatDuration,
  formatKda,
  isRemake,
  outcomeLabel,
  queueName,
  timeAgo,
  totalCs,
} from '@/lib/lol';
import { colors, outcomeColors, radii, spacing, touchTarget } from '@/theme';

export function MatchRow({
  matchId,
  puuid,
  now,
}: {
  matchId: string;
  puuid: string;
  now: number;
}) {
  const { data, isLoading, isError, error, refetch } = useMatch(matchId);
  const championName = useChampionName();

  if (isLoading) return <MatchRowSkeleton />;
  // 실패한 매치를 목록에서 지우지 않고 재시도할 수 있게 남긴다
  if (isError || !data) {
    return <MatchRowError onRetry={isRetryable(error) ? () => refetch() : undefined} />;
  }

  const me = data.info.participants.find((p) => p.puuid === puuid);
  if (!me) return null;

  const remake = isRemake(data.info.gameDuration);
  const oc = outcomeColors(me.win, remake);
  const cs = totalCs(me);
  const cspm = csPerMin(cs, data.info.gameDuration);
  const badges = computeMatchBadges(data)[puuid] ?? [];
  const queue = queueName(data.info.queueId);
  const ago = timeAgo(data.info.gameStartTimestamp, now);
  const result = outcomeLabel(me.win, remake);

  const a11yLabel = [
    `${queue} ${result}`,
    championName(me.championId, me.championName),
    `${me.kills}킬 ${me.deaths}데스 ${me.assists}어시스트`,
    badges.length ? badges.map((b) => b.label).join(', ') : null,
    ago,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={() => goToMatch(matchId, puuid)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="매치 상세 보기"
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? colors.hover : oc.surface, borderColor: oc.border },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: oc.main }]} />

      <View style={styles.main}>
        <ChampionIcon championName={me.championName} size={44} level={me.champLevel} />
        <SpellRunes p={me} size={16} />

        <View style={styles.center}>
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {queue} · {ago}
          </Text>
          <Text variant="bodyStrong" tabular style={{ marginTop: 2 }}>
            {me.kills} / <Text color="loss">{me.deaths}</Text> / {me.assists}
          </Text>
          <Text variant="caption" color="textSecondary" tabular>
            {formatKda(me.kills, me.deaths, me.assists)}
          </Text>
        </View>

        <View style={styles.right}>
          <Text variant="bodyStrong" style={{ color: oc.main }}>
            {result}
          </Text>
          <Text variant="caption" color="textMuted" tabular>
            {formatDuration(data.info.gameDuration)}
          </Text>
        </View>
      </View>

      <BadgeList badges={badges} />

      <View style={styles.bottom}>
        <ItemSlots p={me} size={20} />
        <Text variant="caption" color="textMuted" tabular>
          CS {cs} · {cspm.toFixed(1)}/분
        </Text>
      </View>
    </Pressable>
  );
}

/** 불러오기 실패 행. 재시도로 풀릴 수 있는 실패(429·5xx·연결)만 누를 수 있다 */
function MatchRowError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Pressable
      onPress={onRetry}
      accessibilityRole={onRetry ? 'button' : undefined}
      accessibilityLabel={
        onRetry ? '이 전적을 불러오지 못했습니다. 다시 시도' : '이 전적을 불러오지 못했습니다'
      }
      style={({ pressed }) => [
        styles.container,
        styles.skeleton,
        styles.error,
        pressed && onRetry && { backgroundColor: colors.hover },
      ]}
    >
      <Text variant="caption" color="textSecondary">
        이 전적을 불러오지 못했습니다
      </Text>
      {onRetry ? (
        <View style={styles.retry}>
          <Feather name="rotate-cw" size={14} color={colors.primary} />
          <Text variant="caption" color="primary">
            다시 시도
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** 실제 행과 같은 3줄 구조 — 로드 후 높이가 튀지 않게 */
export function MatchRowSkeleton() {
  return (
    <View
      style={[styles.container, styles.skeleton]}
      accessible
      accessibilityLabel="전적 불러오는 중"
    >
      <View style={styles.main}>
        <View style={[styles.box, { width: 44, height: 44 }]} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[styles.box, { width: 120, height: 10 }]} />
          <View style={[styles.box, { width: 80, height: 14 }]} />
          <View style={[styles.box, { width: 56, height: 10 }]} />
        </View>
        <View style={[styles.box, { width: 40, height: 28 }]} />
      </View>
      <View style={styles.bottom}>
        <View style={[styles.box, { width: 160, height: 20 }]} />
        <View style={[styles.box, { width: 72, height: 10 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    overflow: 'hidden',
    gap: spacing.md,
  },
  skeleton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  error: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retry: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  center: { flex: 1, gap: 1 },
  right: { alignItems: 'flex-end', gap: 2 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  box: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.sm,
  },
});
