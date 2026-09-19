import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

import { profileIconUrl } from '@/api/ddragon';
import { Text } from '@/components/ui/Text';
import { useStaticData } from '@/hooks/useStaticData';
import { colors, radii } from '@/theme';

export function ProfileAvatar({
  iconId,
  size = 64,
  level,
}: {
  iconId?: number;
  size?: number;
  level?: number;
}) {
  const { data } = useStaticData();
  const uri =
    data && iconId !== undefined ? profileIconUrl(data.version, iconId) : undefined;

  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={uri ? { uri } : undefined}
        style={[styles.icon, { width: size, height: size, borderRadius: radii.md }]}
        contentFit="cover"
        transition={150}
      />
      {level !== undefined ? (
        <View style={styles.levelBadge}>
          <Text variant="micro" color="text" tabular>
            {level}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    minWidth: 22,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    alignItems: 'center',
  },
});
