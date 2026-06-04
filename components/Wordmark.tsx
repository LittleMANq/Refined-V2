import { StyleSheet, View } from 'react-native';

import { fontFamilies } from './fonts';
import { Text } from './Text';
import { colors } from './theme';

type Props = {
  size?: number;
  /** Use on dark backgrounds. */
  light?: boolean;
};

/** The brand wordmark: a single gold dot and the serif name. */
export function Wordmark({ size = 20, light }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text
        style={{
          fontFamily: fontFamilies.serifMedium,
          fontSize: size,
          letterSpacing: 0.4,
          color: light ? colors.paper : colors.ink,
        }}
      >
        Refined
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
});
