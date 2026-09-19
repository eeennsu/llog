import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { QUEUE_CATEGORIES, QueueCategoryKey } from '@/lib/stats';
import { colors, radii, spacing } from '@/theme';

type Props = {
  value: QueueCategoryKey;
  onChange: (key: QueueCategoryKey) => void;
};

/** 큐 타입 필터 칩 행. 선택 칩만 옅은 시안 표면 + 시안 보더/텍스트 */
export function QueueFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {QUEUE_CATEGORIES.map((cat) => {
        const selected = cat.key === value;
        return (
          <Pressable
            key={cat.key}
            onPress={() => onChange(cat.key)}
            style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
          >
            <Text
              variant="caption"
              color={selected ? 'primary' : 'textSecondary'}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
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
