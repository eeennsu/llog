import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { colors, radii } from '@/theme';

/** 아이템/스펠/룬 등 작은 정사각 게임 아이콘 */
export function Sprite({
  uri,
  size = 24,
  rounded,
}: {
  uri?: string | null;
  size?: number;
  rounded?: boolean;
}) {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : radii.sm,
        },
      ]}
      contentFit="cover"
      transition={100}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceSunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
