import { Feather } from '@expo/vector-icons';
import { Pressable, View, StyleSheet } from 'react-native';

import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { SummonerRef } from '@/store/useAppStore';
import { colors, radii, spacing, touchTarget } from '@/theme';

/**
 * 최근검색/즐겨찾기 행.
 * 본문과 액션 버튼을 형제로 둔다 — Pressable 중첩은 Android 스크린리더가 안쪽 버튼에 닿지 못한다.
 */
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
  const riotId = `${item.gameName}#${item.tagLine}`;
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          item.summonerLevel !== undefined ? `${riotId}, 레벨 ${item.summonerLevel}` : riotId
        }
        accessibilityHint="전적 보기"
        style={({ pressed }) => [styles.main, pressed && { backgroundColor: colors.hover }]}
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
      </Pressable>

      {onToggleFavorite ? (
        <Pressable
          onPress={onToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={favorite ? `${riotId} 즐겨찾기 해제` : `${riotId} 즐겨찾기 추가`}
          accessibilityState={{ selected: !!favorite }}
          style={({ pressed }) => [styles.action, pressed && { backgroundColor: colors.hover }]}
        >
          <Feather name="star" size={18} color={favorite ? colors.primary : colors.textMuted} />
        </Pressable>
      ) : null}
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`${riotId} 최근 검색에서 삭제`}
          style={({ pressed }) => [styles.action, pressed && { backgroundColor: colors.hover }]}
        >
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: touchTarget,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  center: { flex: 1, gap: 2 },
  action: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
});
