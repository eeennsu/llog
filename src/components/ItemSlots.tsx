import { View, StyleSheet } from 'react-native';

import { itemIconUrl } from '@/api/ddragon';
import { Sprite } from '@/components/ui/Sprite';
import { useStaticData } from '@/hooks/useStaticData';
import { ParticipantDto } from '@/types/riot';
import { spacing } from '@/theme';

/** 아이템 6칸 + 장신구(item6) */
export function ItemSlots({ p, size = 22 }: { p: ParticipantDto; size?: number }) {
  const { data } = useStaticData();
  const version = data?.version;

  const main = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5];

  return (
    <View style={styles.row}>
      {main.map((id, i) => (
        <Sprite key={i} uri={version ? itemIconUrl(version, id) : null} size={size} />
      ))}
      <View style={{ width: spacing.xxs }} />
      <Sprite uri={version ? itemIconUrl(version, p.item6) : null} size={size} rounded />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
