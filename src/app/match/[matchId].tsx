import { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { TeamScoreboard } from '@/components/Scoreboard';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { ErrorView, Loading } from '@/components/ui/States';
import { useMatch } from '@/hooks/riot';
import { formatDuration, formatKda, queueName, timeAgo } from '@/lib/lol';
import { colors, outcomeColors, spacing } from '@/theme';

export default function MatchScreen() {
  const { matchId, puuid } = useLocalSearchParams<{ matchId: string; puuid: string }>();
  const { data, isLoading, isError, error, refetch } = useMatch(matchId);

  const now = useMemo(() => Date.now(), []);

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
        <ErrorView message={error?.message ?? '매치를 불러오지 못했습니다.'} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  const me = data.info.participants.find((p) => p.puuid === puuid);
  const maxDamage = Math.max(
    ...data.info.participants.map((p) => p.totalDamageDealtToChampions),
    1,
  );

  const blue = data.info.participants.filter((p) => p.teamId === 100);
  const red = data.info.participants.filter((p) => p.teamId === 200);
  const blueTeam = data.info.teams.find((t) => t.teamId === 100);
  const redTeam = data.info.teams.find((t) => t.teamId === 200);
  const remake = data.info.gameDuration < 300;

  const oc = me ? outcomeColors(me.win) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summary}>
          <View style={styles.summaryTop}>
            <Text variant="title">{queueName(data.info.queueId)}</Text>
            {me && oc ? (
              <Text variant="title" style={{ color: oc.main }}>
                {remake ? '다시하기' : me.win ? '승리' : '패배'}
              </Text>
            ) : null}
          </View>
          <Text variant="caption" color="textMuted" tabular>
            {timeAgo(data.info.gameStartTimestamp, now)} · {formatDuration(data.info.gameDuration)}
          </Text>
          {me ? (
            <Text variant="caption" color="textSecondary" tabular style={{ marginTop: spacing.xs }}>
              {me.championName} · {me.kills}/{me.deaths}/{me.assists} (
              {formatKda(me.kills, me.deaths, me.assists)})
            </Text>
          ) : null}
        </Card>

        {blueTeam ? (
          <TeamScoreboard
            team={blueTeam}
            participants={blue}
            mePuuid={puuid ?? ''}
            maxDamage={maxDamage}
            sideLabel="블루팀"
          />
        ) : null}

        {redTeam ? (
          <TeamScoreboard
            team={redTeam}
            participants={red}
            mePuuid={puuid ?? ''}
            maxDamage={maxDamage}
            sideLabel="레드팀"
          />
        ) : null}
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
