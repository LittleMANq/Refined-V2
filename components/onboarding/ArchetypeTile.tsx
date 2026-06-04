import { Pressable, StyleSheet, View } from 'react-native';

import { GarmentSlot } from '../GarmentSlot';
import { Text } from '../Text';
import { colors, radii, spacing, type SlotTone } from '../theme';
import { Icon } from './Icon';

type Props = {
  label: string;
  sub: string;
  tone: SlotTone;
  selected: boolean;
  onPress: () => void;
};

/**
 * Editorial archetype tile: a 3:4 toned slot (reserved for real photography) with a
 * label and a gold selection ring + check badge. RTL-aligned overlay.
 */
export function ArchetypeTile({ label, sub, tone, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.wrap}
    >
      <GarmentSlot tone={tone} scrim radius={radii.lg}>
        <View style={styles.overlay}>
          <Text variant="label" color={colors.paper}>
            {label}
          </Text>
          <Text variant="mono" color={colors.paper} style={styles.sub}>
            {sub}
          </Text>
        </View>
        {selected ? (
          <View style={styles.badge}>
            <Icon name="check" size={15} color={colors.paper} />
          </View>
        ) : null}
      </GarmentSlot>
      <View
        pointerEvents="none"
        style={[styles.ring, selected ? styles.ringOn : null]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: 2,
  },
  sub: {
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    insetInlineStart: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ringOn: {
    borderColor: colors.gold,
  },
});
