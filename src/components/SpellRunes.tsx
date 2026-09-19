import { View, StyleSheet } from 'react-native';

import { runeIconUrl, summonerSpellIconUrl } from '@/api/ddragon';
import { Sprite } from '@/components/ui/Sprite';
import { useStaticData } from '@/hooks/useStaticData';
import { ParticipantDto } from '@/types/riot';
import { spacing } from '@/theme';

/** 소환사 주문 2개 + 핵심 룬(키스톤) + 보조 룬 계열을 2x2 로 표시 */
export function SpellRunes({ p, size = 18 }: { p: ParticipantDto; size?: number }) {
  const { data } = useStaticData();

  const spell1 = data?.summonerSpells[String(p.summoner1Id)]?.id;
  const spell2 = data?.summonerSpells[String(p.summoner2Id)]?.id;
  const spell1Uri = data && spell1 ? summonerSpellIconUrl(data.version, spell1) : null;
  const spell2Uri = data && spell2 ? summonerSpellIconUrl(data.version, spell2) : null;

  const keystoneId = p.perks?.styles?.[0]?.selections?.[0]?.perk;
  const keystoneIconPath = keystoneId ? data?.runePerks[keystoneId]?.icon : undefined;
  const keystoneUri = keystoneIconPath ? runeIconUrl(keystoneIconPath) : null;

  const secondaryStyleId = p.perks?.styles?.[1]?.style;
  const secondaryIconPath = secondaryStyleId ? data?.runeStyles[secondaryStyleId]?.icon : undefined;
  const secondaryUri = secondaryIconPath ? runeIconUrl(secondaryIconPath) : null;

  return (
    <View style={styles.grid}>
      <View style={styles.col}>
        <Sprite uri={spell1Uri} size={size} />
        <Sprite uri={spell2Uri} size={size} />
      </View>
      <View style={styles.col}>
        <Sprite uri={keystoneUri} size={size} rounded />
        <Sprite uri={secondaryUri} size={size} rounded />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: spacing.xxs },
  col: { gap: spacing.xxs },
});
