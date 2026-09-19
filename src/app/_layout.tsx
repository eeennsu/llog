import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/lib/queryClient';
import { colors, typography } from '@/theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
    notification: colors.primary,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navTheme}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTitleStyle: {
                  color: colors.text,
                  fontSize: typography.title.fontSize,
                  fontWeight: typography.title.fontWeight,
                },
                headerTintColor: colors.primary,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              {/* 홈은 자체 워드마크를 가지므로 헤더를 숨긴다 (브랜드 중복·상단 여백 이중 방지) */}
              <Stack.Screen name="index" options={{ title: 'LLog', headerShown: false }} />
              <Stack.Screen name="summoner/[riotId]" options={{ title: '' }} />
              <Stack.Screen name="match/[matchId]" options={{ title: '매치 상세' }} />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
