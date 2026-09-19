import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radii, spacing, typography } from '@/theme';

export function SearchBar({
  onSubmit,
  error,
  autoFocus,
}: {
  onSubmit: (raw: string) => void;
  error?: string | null;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

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
          onChangeText={setValue}
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="소환사명 #태그"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          returnKeyType="search"
          style={styles.input}
          selectionColor={colors.primary}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => setValue('')} hitSlop={8}>
            <Feather name="x" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color="loss" style={{ marginTop: spacing.sm, marginLeft: spacing.xs }}>
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
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.surfaceSunken,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.title.fontSize,
    padding: 0,
  },
});
