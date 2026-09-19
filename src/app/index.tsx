import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/SearchBar';
import { SummonerRow } from '@/components/SummonerRow';
import { EmptyState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { parseRiotId } from '@/lib/lol';
import { goToSummoner } from '@/lib/nav';
import { SummonerRef, summonerKey, useAppStore } from '@/store/useAppStore';
import { colors, radii, spacing, touchTarget } from '@/theme';

/** 태그 없이 입력했을 때 제안하는 KR 서버 기본 태그 */
const DEFAULT_TAG = 'KR1';

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  // 화면에 돌아올 때마다 검색창을 새로 마운트 → 이전 입력 비우고 자동 포커스 (연속 조회용)
  const [searchKey, setSearchKey] = useState(0);
  const recentSearches = useAppStore((s) => s.recentSearches);
  const favorites = useAppStore((s) => s.favorites);
  const removeRecent = useAppStore((s) => s.removeRecent);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);

  useFocusEffect(
    useCallback(() => {
      setSearchKey((k) => k + 1);
      setQuery('');
      setError(null);
      setSuggestion(null);
    }, []),
  );

  const handleSubmit = (raw: string) => {
    const parsed = parseRiotId(raw);
    if (!parsed) {
      const name = raw.trim();
      if (name && !name.includes('#')) {
        setError('태그(#)가 빠졌어요.');
        setSuggestion(`${name}#${DEFAULT_TAG}`);
      } else {
        setError('소환사명#태그 형식으로 입력해 주세요. (예: 소환사명#KR1)');
        setSuggestion(null);
      }
      return;
    }
    setError(null);
    setSuggestion(null);
    goToSummoner(parsed.gameName, parsed.tagLine);
  };

  // 입력 중에는 최근검색·즐겨찾기를 입력값으로 걸러 바로 고를 수 있게 한다
  const q = query.trim().toLowerCase();
  const matches = (item: SummonerRef) => !q || summonerKey(item.gameName, item.tagLine).includes(q);
  const shownFavorites = favorites.filter(matches);
  const shownRecents = recentSearches.filter(matches);
  const hasLists = favorites.length > 0 || recentSearches.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <Text variant="display" accessibilityRole="header">
            LLog
          </Text>
          <Text variant="caption" color="textMuted" style={{ marginTop: spacing.xs }}>
            한국(KR) 서버 · Riot ID 전적검색
          </Text>
        </View>

        <View>
          <SearchBar
            key={searchKey}
            autoFocus
            onSubmit={handleSubmit}
            onChangeText={(v) => {
              setQuery(v);
              if (error) {
                setError(null);
                setSuggestion(null);
              }
            }}
            error={error}
          />
          {suggestion ? (
            <Pressable
              onPress={() => handleSubmit(suggestion)}
              accessibilityRole="button"
              accessibilityLabel={`${suggestion}로 검색`}
              style={({ pressed }) => [styles.suggestion, pressed && { backgroundColor: colors.hover }]}
            >
              <Text variant="caption" color="textSecondary">
                <Text variant="caption" color="primary">
                  {suggestion}
                </Text>
                로 검색
              </Text>
            </Pressable>
          ) : null}
        </View>

        {shownFavorites.length > 0 ? (
          <Section title="즐겨찾기">
            {shownFavorites.map((item) => (
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

        {shownRecents.length > 0 ? (
          <Section title="최근 검색">
            {shownRecents.map((item) => (
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
      <Text
        variant="caption"
        color="textMuted"
        accessibilityRole="header"
        style={styles.sectionTitle}
      >
        {title}
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
  suggestion: {
    alignSelf: 'flex-start',
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radii.md,
  },
  section: { gap: spacing.xs },
  sectionTitle: { marginLeft: spacing.md, letterSpacing: 0.5 },
  emptyWrap: { paddingTop: spacing.huge },
});
