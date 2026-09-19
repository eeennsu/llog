import { Feather } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';

import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { SummonerRef } from '@/store/useAppStore';
import { colors, radii, spacing } from '@/theme';

export function SummonerRow({
  item,
  onPress,
  favorite,
  onToggleFavorite,
  onRemove,
}: {
  item: SummonerRef;
  onPress: () => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onRemove?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.hover }]}
    >
      <ProfileAvatar iconId={item.profileIconId} size={36} />
      <View style={styles.center}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {item.gameName}
          <Text variant="body" color="textMuted">
            {' #'}
            {item.tagLine}
          </Text>
        </Text>
        {item.summonerLevel !== undefined ? (
          <Text variant="caption" color="textMuted">
            Lv. {item.summonerLevel}
          </Text>
        ) : null}
      </View>

      {onToggleFavorite ? (
        <Pressable onPress={onToggleFavorite} hitSlop={10} style={styles.action}>
          <Feather
            name="star"
            size={18}
            color={favorite ? colors.primary : colors.textMuted}
          />
        </Pressable>
      ) : null}
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={10} style={styles.action}>
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  center: { flex: 1, gap: 2 },
  action: { padding: spacing.xs },
});
