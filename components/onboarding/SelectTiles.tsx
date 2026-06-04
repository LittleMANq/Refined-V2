import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../Text';
import { colors, radii, shadows, spacing } from '../theme';
import { Icon } from './Icon';

/**
 * Gender choice: a soft card with a circular indicator and a label. Selection is a
 * gold ring + tint (gold is accent-only; the action color stays ink elsewhere).
 */
export function GenderTile({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.genderCard, selected ? styles.genderOn : styles.genderOff]}
    >
      <View style={[styles.genderDot, selected ? styles.genderDotOn : styles.genderDotOff]}>
        {selected ? (
          <Icon name="check" size={17} color={colors.paper} />
        ) : (
          <View style={styles.innerDot} />
        )}
      </View>
      <Text variant="label" align="center">
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Lifestyle / context choice: a full-width row that fills ink when on (ink is the
 * action color), with a gold check in the indicator.
 */
export function ContextRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.row, selected ? styles.rowOn : styles.rowOff]}
    >
      <View style={[styles.rowDot, selected ? styles.rowDotOn : styles.rowDotOff]}>
        {selected ? <Icon name="check" size={13} color={colors.paper} /> : null}
      </View>
      <Text variant="label" color={selected ? colors.paper : colors.ink}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  genderCard: {
    flex: 1,
    height: 104,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  genderOff: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  genderOn: {
    backgroundColor: colors.gold14,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  genderDot: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderDotOn: {
    backgroundColor: colors.gold,
  },
  genderDotOff: {
    backgroundColor: colors.surface,
  },
  innerDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 58,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  rowOff: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  rowOn: {
    backgroundColor: colors.ink,
  },
  rowDot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowDotOn: {
    backgroundColor: colors.gold,
  },
  rowDotOff: {
    borderWidth: 1.5,
    borderColor: colors.hairline,
  },
});
