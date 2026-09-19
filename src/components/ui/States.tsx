import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, View, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radii, spacing, touchTarget } from '@/theme';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.center} accessible accessibilityLabel={label ?? '불러오는 중'}>
      <ActivityIndicator color={colors.primary} />
      {label ? (
        <Text variant="caption" color="textMuted" style={{ marginTop: spacing.md }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Feather name="alert-triangle" size={28} color={colors.textMuted} />
      <Text
        variant="body"
        color="textSecondary"
        align="center"
        style={{ marginTop: spacing.md, maxWidth: 280 }}
      >
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="다시 시도"
          style={({ pressed }) => [styles.retry, pressed && { backgroundColor: colors.hover }]}
        >
          <Feather name="rotate-cw" size={14} color={colors.primary} />
          <Text variant="bodyStrong" color="primary">
            다시 시도
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.center}>
      <Feather name={icon} size={28} color={colors.textDisabled} />
      <Text variant="title" color="textSecondary" style={{ marginTop: spacing.md }}>
        {title}
      </Text>
      {description ? (
        <Text
          variant="caption"
          color="textMuted"
          align="center"
          style={{ marginTop: spacing.xs, maxWidth: 280 }}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primarySurface,
  },
});
