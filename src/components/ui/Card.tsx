import { View, ViewProps, StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/theme';

export type CardProps = ViewProps & {
  /** 표면 단차: base(surface) | elevated */
  elevated?: boolean;
  padded?: boolean;
};

/** 얇은 보더 + 미묘한 표면 단차로 영역을 분리하는 기본 카드 (드롭섀도 미사용) */
export function Card({ elevated, padded = true, style, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: elevated ? colors.surfaceElevated : colors.surface },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  padded: {
    padding: spacing.lg,
  },
});
