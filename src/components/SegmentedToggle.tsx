import { Pressable, View, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radii, spacing, touchTarget } from '@/theme';

type Option<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (key: T) => void;
};

/** 재사용 가능한 세그먼트 토글. 선택 세그먼트만 옅은 시안 표면 + 시안 텍스트 */
export function SegmentedToggle<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {options.map((opt) => {
        const selected = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && !selected && { backgroundColor: colors.hover },
            ]}
          >
            <Text
              variant="bodyStrong"
              color={selected ? 'primary' : 'textSecondary'}
              align="center"
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },
  segment: {
    flex: 1,
    // 트랙 패딩(2+2) 포함 48dp
    minHeight: touchTarget - spacing.xxs * 2,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  segmentSelected: {
    backgroundColor: colors.primarySurface,
  },
});
