import { Feather } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';

import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { colors, radii, spacing } from '@/theme';

export function ProfileHeader({
  gameName,
  tagLine,
  profileIconId,
  level,
  favorite,
  onToggleFavorite,
}: {
  gameName: string;
  tagLine: string;
  profileIconId?: number;
  level?: number;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <View style={styles.row}>
      <ProfileAvatar iconId={profileIconId} size={72} level={level} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text variant="h1" numberOfLines={1} style={styles.name}>
            {gameName}
          </Text>
          <Text variant="title" color="textMuted">
            #{tagLine}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onToggleFavorite}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        accessibilityState={{ selected: favorite }}
        style={({ pressed }) => [
          styles.favBtn,
          {
            borderColor: favorite ? colors.primaryBorder : colors.border,
            backgroundColor: favorite ? colors.primarySurface : colors.transparent,
          },
          pressed && { backgroundColor: colors.hover },
        ]}
      >
        <Feather name="star" size={18} color={favorite ? colors.primary : colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  info: { flex: 1, gap: 2 },
  nameRow: { gap: 2 },
  name: { maxWidth: '100%' },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
