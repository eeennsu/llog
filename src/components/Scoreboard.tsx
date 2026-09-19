import { Pressable, View, StyleSheet } from 'react-native';

import { ChampionIcon } from '@/components/ChampionIcon';
import { ItemSlots } from '@/components/ItemSlots';
import { SpellRunes } from '@/components/SpellRunes';
import { Text } from '@/components/ui/Text';
import { goToSummoner } from '@/lib/nav';
import { formatKda, positionLabel, totalCs } from '@/lib/lol';
import { ParticipantDto, TeamDto } from '@/types/riot';
import { colors, outcomeColors, radii, spacing } from '@/theme';

export function TeamScoreboard({
  team,
  participants,
  mePuuid,
  maxDamage,
  sideLabel,
}: {
  team: TeamDto;
  participants: ParticipantDto[];
  mePuuid: string;
  maxDamage: number;
  sideLabel: string;
}) {
  const oc = outcomeColors(team.win);
  const obj = team.objectives;

  return (
    <View style={styles.team}>
      <View style={[styles.teamHeader, { borderColor: oc.border, backgroundColor: oc.surface }]}>
        <View style={styles.teamHeaderLeft}>
          <View style={[styles.dot, { backgroundColor: oc.main }]} />
          <Text variant="bodyStrong" style={{ color: oc.main }}>
            {sideLabel} {team.win ? '승리' : '패배'}
          </Text>
        </View>
        <Text variant="caption" color="textMuted" tabular>
          {obj.champion.kills}킬 · 용 {obj.dragon.kills} · 바론 {obj.baron.kills} · 타워{' '}
          {obj.tower.kills}
        </Text>
      </View>

      {participants.map((p) => (
        <ScoreboardRow
          key={p.puuid}
          p={p}
          me={p.puuid === mePuuid}
          maxDamage={maxDamage}
        />
      ))}
    </View>
  );
}

function ScoreboardRow({
  p,
  me,
  maxDamage,
}: {
  p: ParticipantDto;
  me: boolean;
  maxDamage: number;
}) {
  const cs = totalCs(p);
  const dmgPct = maxDamage > 0 ? p.totalDamageDealtToChampions / maxDamage : 0;
  const name = p.riotIdGameName || p.summonerName || '';

  return (
    <Pressable
      onPress={() =>
        p.riotIdGameName && p.riotIdTagline
          ? goToSummoner(p.riotIdGameName, p.riotIdTagline)
          : undefined
      }
      style={[styles.row, me && styles.rowMe]}
    >
      <ChampionIcon championName={p.championName} size={36} level={p.champLevel} />
      <SpellRunes p={p} size={15} />

      <View style={styles.rowCenter}>
        <Text variant="caption" color={me ? 'primary' : 'text'} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaLine}>
          <Text variant="micro" color="textMuted" tabular>
            {p.kills}/{p.deaths}/{p.assists} · {formatKda(p.kills, p.deaths, p.assists)}
          </Text>
          {positionLabel(p.teamPosition) ? (
            <Text variant="micro" color="textDisabled">
              {positionLabel(p.teamPosition)}
            </Text>
          ) : null}
        </View>
        <ItemSlots p={p} size={18} />
      </View>

      <View style={styles.rowRight}>
        <Text variant="micro" color="textSecondary" tabular>
          CS {cs}
        </Text>
        <View style={styles.dmgTrack}>
          <View style={[styles.dmgFill, { width: `${Math.round(dmgPct * 100)}%` }]} />
        </View>
        <Text variant="micro" color="textMuted" tabular>
          {p.totalDamageDealtToChampions.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  team: { gap: spacing.xxs },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.xs,
  },
  teamHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  rowMe: {
    backgroundColor: colors.primarySurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primaryBorder,
  },
  rowCenter: { flex: 1, gap: 3 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowRight: { width: 76, alignItems: 'flex-end', gap: 3 },
  dmgTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
  },
  dmgFill: {
    height: '100%',
    backgroundColor: colors.textMuted,
  },
});
