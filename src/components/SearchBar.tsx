import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radii, spacing, touchTarget, typography } from '@/theme';

export function SearchBar({
  onSubmit,
  onChangeText,
  error,
  autoFocus,
}: {
  onSubmit: (raw: string) => void;
  /** 입력 중 값 (최근검색 필터 등) */
  onChangeText?: (value: string) => void;
  error?: string | null;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const change = (next: string) => {
    setValue(next);
    onChangeText?.(next);
  };

  const submit = () => {
    if (value.trim()) onSubmit(value);
  };

  return (
    <View>
      <View
        style={[
          styles.bar,
          { borderColor: focused ? colors.primaryBorder : colors.border },
        ]}
      >
        <Feather name="search" size={18} color={focused ? colors.primary : colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={change}
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="소환사명#태그"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Riot ID 검색"
          accessibilityHint="소환사명#태그 형식으로 입력"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          returnKeyType="search"
          style={styles.input}
          selectionColor={colors.primary}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => change('')}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="입력 지우기"
          >
            <Feather name="x" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text
          variant="caption"
          color="loss"
          accessibilityLiveRegion="polite"
          style={{ marginTop: spacing.sm, marginLeft: spacing.xs }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceSunken,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.title.fontSize,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
  },
});
