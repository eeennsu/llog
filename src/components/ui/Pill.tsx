import { View, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radii, spacing } from '@/theme';

export type PillProps = {
  label: string;
  /** 텍스트/보더 색 (기본 중립). 강조가 필요한 곳에만 색 지정 */
  color?: string;
  /** 옅은 표면 배경 */
  surface?: string;
  border?: string;
};

/** 작은 라벨/태그. 기본은 보더 없는 중립 텍스트, 색 지정 시 옅은 표면 + 보더 */
export function Pill({ label, color, surface, border }: PillProps) {
  const tinted = !!surface;
  return (
    <View
      style={[
        styles.base,
        tinted && {
          backgroundColor: surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: border ?? 'transparent',
        },
      ]}
    >
      <Text variant="micro" color={color ?? colors.textSecondary}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
});
