import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

import { championIconUrl } from '@/api/ddragon';
import { Text } from '@/components/ui/Text';
import { useStaticData } from '@/hooks/useStaticData';
import { colors, radii } from '@/theme';

type Props = {
  /** match-v5 의 championName (이미 이미지 id, 예: 'Aatrox') */
  championName?: string;
  /** 숙련도 등에서 오는 numeric championId */
  championKey?: number;
  size?: number;
  /** 챔피언 레벨 배지 */
  level?: number;
  rounded?: boolean;
};

export function ChampionIcon({
  championName,
  championKey,
  size = 48,
  level,
  rounded,
}: Props) {
  const { data } = useStaticData();

  let imageId = championName;
  if (!imageId && data && championKey !== undefined) {
    imageId = data.champions[String(championKey)]?.id;
  }
  const uri = data && imageId ? championIconUrl(data.version, imageId) : undefined;
  const borderRadius = rounded ? size / 2 : radii.sm;

  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={uri ? { uri } : undefined}
        style={[styles.icon, { width: size, height: size, borderRadius }]}
        contentFit="cover"
        transition={120}
      />
      {level !== undefined ? (
        <View style={styles.levelBadge}>
          <Text variant="micro" color="text" tabular>
            {level}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.surfaceElevated,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    minWidth: 18,
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    alignItems: 'center',
  },
});
