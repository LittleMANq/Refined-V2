import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

type Props = {
  onBack?: () => void;
  step?: number;
  total?: number;
  light?: boolean;
};

/**
 * The recurring onboarding top bar: a back chevron on the start edge and a slim
 * progress track. The chevron points toward the start of the line (right, in RTL),
 * which reads as "back". When there is nowhere to go back, the slot stays reserved
 * so the progress bar keeps its position.
 */
export function OnboardingHeader({ onBack, step, total, light }: Props) {
  const tint = light ? colors.paper : colors.ink;
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable accessibilityRole="button" onPress={onBack} hitSlop={10} style={styles.back}>
          <Icon name="chevron-right" size={24} color={tint} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <View style={styles.progressWrap}>
        {total ? <ProgressBar step={step ?? 0} total={total} /> : null}
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.gutter - 2,
    paddingTop: spacing.sm,
  },
  back: {
    width: 24,
    flexShrink: 0,
  },
  spacer: {
    width: 24,
    flexShrink: 0,
  },
  progressWrap: {
    flex: 1,
  },
});
