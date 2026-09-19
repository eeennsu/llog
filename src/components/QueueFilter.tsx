import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { QUEUE_CATEGORIES, QueueCategoryKey } from '@/lib/stats';
import { colors, radii, spacing, touchTarget } from '@/theme';

type Props = {
  value: QueueCategoryKey;
  onChange: (key: QueueCategoryKey) => void;
};

/** 큐 타입 필터 칩 행. 선택 칩만 옅은 시안 표면 + 시안 보더/텍스트.
 *  칩은 작게 보이되 터치 영역은 48dp (바깥 Pressable 이 세로 여백을 가짐) */
export function QueueFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {QUEUE_CATEGORIES.map((cat) => {
        const selected = cat.key === value;
        return (
          <Pressable
            key={cat.key}
            onPress={() => onChange(cat.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${cat.label} 필터`}
            style={styles.hit}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipDefault,
                  pressed && !selected && { backgroundColor: colors.hover },
                ]}
              >
                <Text variant="caption" color={selected ? 'primary' : 'textSecondary'}>
                  {cat.label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // 48dp 터치 영역이 만드는 세로 여백을 주변 간격과 상쇄
  scroll: { marginVertical: -spacing.md },
  row: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.xxs,
  },
  hit: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipDefault: {
    backgroundColor: colors.transparent,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primaryBorder,
  },
});
