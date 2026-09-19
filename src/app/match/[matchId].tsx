import { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { BadgeList } from '@/components/BadgeList';
import { TeamScoreboard } from '@/components/Scoreboard';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ErrorView, Loading } from '@/components/ui/States';
import { isRetryable } from '@/api/client';
import { useMatch } from '@/hooks/riot';
import { useChampionName } from '@/hooks/useStaticData';
import { computeMatchBadges } from '@/lib/badges';
import {
  formatDuration,
  formatKda,
  isRemake,
  outcomeLabel,
  queueName,
  timeAgo,
} from '@/lib/lol';
import { colors, outcomeColors, spacing } from '@/theme';

export default function MatchScreen() {
  const { matchId, puuid } = useLocalSearchParams<{ matchId: string; puuid: string }>();
  const { data, isLoading, isError, error, refetch } = useMatch(matchId);

  const now = useMemo(() => Date.now(), []);
  const championName = useChampionName();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Loading label="매치 정보를 불러오는 중…" />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ErrorView
          message={error?.message ?? '매치를 불러오지 못했습니다.'}
          onRetry={isRetryable(error) ? () => refetch() : undefined}
        />
      </SafeAreaView>
    );
  }

  const me = data.info.participants.find((p) => p.puuid === puuid);
  const maxDamage = Math.max(
    ...data.info.participants.map((p) => p.totalDamageDealtToChampions),
    1,
  );

  const remake = isRemake(data.info.gameDuration);
  const badges = computeMatchBadges(data);
  const myBadges = me ? badges[me.puuid] ?? [] : [];

  // 내 팀을 먼저 보여준다 (기준 플레이어가 없으면 블루 → 레드)
  const sides = [
    { teamId: 100, label: '블루팀' },
    { teamId: 200, label: '레드팀' },
  ];
  if (me?.teamId === 200) sides.reverse();

  const oc = me ? outcomeColors(me.win, remake) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summary}>
          <View style={styles.summaryTop}>
            <Text variant="title">{queueName(data.info.queueId)}</Text>
            {me && oc ? (
              <Text variant="title" style={{ color: oc.main }}>
                {outcomeLabel(me.win, remake)}
              </Text>
            ) : null}
          </View>
          <Text variant="caption" color="textMuted" tabular>
            {timeAgo(data.info.gameStartTimestamp, now)} · {formatDuration(data.info.gameDuration)}
          </Text>
          {me ? (
            <Text variant="caption" color="textSecondary" tabular style={{ marginTop: spacing.xs }}>
              {championName(me.championId, me.championName)} · {me.kills}/{me.deaths}/{me.assists} (
              {formatKda(me.kills, me.deaths, me.assists)})
            </Text>
          ) : null}
          {remake ? (
            <Text variant="caption" color="textMuted">
              5분 미만 다시하기 게임은 통계에 포함되지 않습니다.
            </Text>
          ) : null}
          {myBadges.length > 0 ? (
            <View style={{ marginTop: spacing.sm }}>
              <BadgeList badges={myBadges} />
            </View>
          ) : null}
        </Card>

        {sides.map(({ teamId, label }) => {
          const team = data.info.teams.find((t) => t.teamId === teamId);
          if (!team) return null;
          return (
            <TeamScoreboard
              key={teamId}
              team={team}
              participants={data.info.participants.filter((p) => p.teamId === teamId)}
              mePuuid={puuid ?? ''}
              maxDamage={maxDamage}
              sideLabel={label}
              badges={badges}
              remake={remake}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.huge },
  summary: { gap: spacing.xs },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
