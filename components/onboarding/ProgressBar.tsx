import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '../theme';

type Props = {
  step: number;
  total: number;
  style?: ViewStyle;
};

/** Slim progress track; the gold fill grows from the start edge (right, in RTL). */
export function ProgressBar({ step, total, style }: Props) {
  const pct = Math.max(0, Math.min(1, total ? step / total : 0));
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.hairline,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    // start edge: right in RTL, left in LTR — logical inset follows the writing direction.
    insetInlineEnd: 0,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
});
