import { View, StyleSheet } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import { Badge } from '@/lib/badges';
import { colors, spacing } from '@/theme';

/** 매치 뱃지 칩 묶음. MVP·펜타킬만 시안, 나머지는 중립 */
export function BadgeList({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {badges.map((b) =>
        b.highlight ? (
          <Pill
            key={b.key}
            label={b.label}
            color={colors.primary}
            surface={colors.primarySurface}
            border={colors.primaryBorder}
          />
        ) : (
          <Pill
            key={b.key}
            label={b.label}
            color={colors.textSecondary}
            surface={colors.surfaceElevated}
            border={colors.borderStrong}
          />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
