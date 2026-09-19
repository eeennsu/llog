import { View, StyleSheet } from 'react-native';

import { colors } from '@/theme';

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={[styles.line, { marginHorizontal: inset }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
