import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, TypographyVariant, typography } from '@/theme';

type Color = keyof Pick<
  typeof colors,
  'text' | 'textSecondary' | 'textMuted' | 'textDisabled' | 'primary' | 'onPrimary'
>;

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: Color | string;
  align?: 'left' | 'center' | 'right';
  /** 숫자 정렬용 고정폭 숫자 */
  tabular?: boolean;
};

export function Text({
  variant = 'body',
  color = 'text',
  align,
  tabular,
  style,
  ...rest
}: TextProps) {
  const resolved = (colors as Record<string, string>)[color] ?? color;
  return (
    <RNText
      style={[
        typography[variant],
        { color: resolved },
        align ? { textAlign: align } : null,
        tabular ? styles.tabular : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});
