import { Pressable, View, StyleSheet } from 'react-native';

import { ChampionIcon } from '@/components/ChampionIcon';
import { ItemSlots } from '@/components/ItemSlots';
import { SpellRunes } from '@/components/SpellRunes';
import { Text } from '@/components/ui/Text';
import { useMatch } from '@/hooks/riot';
import { goToMatch } from '@/lib/nav';
import {
  csPerMin,
  formatDuration,
  formatKda,
  queueName,
  timeAgo,
  totalCs,
} from '@/lib/lol';
import { colors, outcomeColors, radii, spacing } from '@/theme';

export function MatchRow({
  matchId,
  puuid,
  now,
}: {
  matchId: string;
  puuid: string;
  now: number;
}) {
  const { data, isLoading, isError } = useMatch(matchId);

  if (isLoading) return <MatchRowSkeleton />;
  if (isError || !data) return null;

  const me = data.info.participants.find((p) => p.puuid === puuid);
  if (!me) return null;

  const oc = outcomeColors(me.win);
  const cs = totalCs(me);
  const cspm = csPerMin(cs, data.info.gameDuration);
  const remake = data.info.gameDuration < 300;

  return (
    <Pressable
      onPress={() => goToMatch(matchId, puuid)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: oc.surface, borderColor: oc.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: oc.main }]} />

      <View style={styles.main}>
        <ChampionIcon championName={me.championName} size={44} level={me.champLevel} />
        <SpellRunes p={me} size={16} />

        <View style={styles.center}>
          <Text variant="caption" color="textMuted">
            {queueName(data.info.queueId)} · {timeAgo(data.info.gameStartTimestamp, now)}
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
            {remake ? '다시하기' : me.win ? '승리' : '패배'}
          </Text>
          <Text variant="caption" color="textMuted" tabular>
            {formatDuration(data.info.gameDuration)}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <ItemSlots p={me} size={20} />
        <Text variant="caption" color="textMuted" tabular>
          CS {cs} · {cspm.toFixed(1)}/분
        </Text>
      </View>
    </Pressable>
  );
}

export function MatchRowSkeleton() {
  return (
    <View style={[styles.container, styles.skeleton]}>
      <View style={styles.main}>
        <View style={[styles.box, { width: 44, height: 44 }]} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[styles.box, { width: 120, height: 10 }]} />
          <View style={[styles.box, { width: 80, height: 14 }]} />
        </View>
        <View style={[styles.box, { width: 40, height: 28 }]} />
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
