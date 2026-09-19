import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/SearchBar';
import { SummonerRow } from '@/components/SummonerRow';
import { EmptyState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { goToSummoner } from '@/lib/nav';
import { parseRiotId } from '@/lib/lol';
import { summonerKey, useAppStore } from '@/store/useAppStore';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);
  const recentSearches = useAppStore((s) => s.recentSearches);
  const favorites = useAppStore((s) => s.favorites);
  const removeRecent = useAppStore((s) => s.removeRecent);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);

  const handleSubmit = (raw: string) => {
    const parsed = parseRiotId(raw);
    if (!parsed) {
      setError('소환사명#태그 형식으로 입력해 주세요. (예: Hide on bush#KR1)');
      return;
    }
    setError(null);
    goToSummoner(parsed.gameName, parsed.tagLine);
  };

  const hasLists = favorites.length > 0 || recentSearches.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <Text variant="display">
            <Text variant="display" color="primary">LL</Text>og
          </Text>
          <Text variant="caption" color="textMuted" style={{ marginTop: spacing.xs }}>
            한국(KR) 서버 · Riot ID 전적검색
          </Text>
        </View>

        <SearchBar onSubmit={handleSubmit} error={error} />

        {favorites.length > 0 ? (
          <Section title="즐겨찾기">
            {favorites.map((item) => (
              <SummonerRow
                key={summonerKey(item.gameName, item.tagLine)}
                item={item}
                favorite
                onToggleFavorite={() => toggleFavorite(item)}
                onPress={() => goToSummoner(item.gameName, item.tagLine)}
              />
            ))}
          </Section>
        ) : null}

        {recentSearches.length > 0 ? (
          <Section title="최근 검색">
            {recentSearches.map((item) => (
              <SummonerRow
                key={summonerKey(item.gameName, item.tagLine)}
                item={item}
                favorite={isFavorite(item.gameName, item.tagLine)}
                onToggleFavorite={() => toggleFavorite(item)}
                onRemove={() => removeRecent(summonerKey(item.gameName, item.tagLine))}
                onPress={() => goToSummoner(item.gameName, item.tagLine)}
              />
            ))}
          </Section>
        ) : null}

        {!hasLists ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="search"
              title="소환사를 검색해 보세요"
              description="Riot ID(소환사명#태그)를 입력하면 프로필과 전적을 볼 수 있어요."
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="caption" color="textMuted" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.xl,
  },
  brand: { marginTop: spacing.sm },
  section: { gap: spacing.xs },
  sectionTitle: { marginLeft: spacing.md, letterSpacing: 0.5 },
  emptyWrap: { paddingTop: spacing.huge },
});
