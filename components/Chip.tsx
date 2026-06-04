import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from './Text';
import { colors, radii } from './theme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  style?: ViewStyle;
};

/** Filter / choice pill. Hairline outline when off, solid ink when on. */
export function Chip({ label, active, onPress, icon, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.on : styles.off,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text variant="label" color={active ? colors.paper : colors.secondary}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 18,
    borderRadius: radii.chip,
  },
  off: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  on: {
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    flexShrink: 0,
  },
});
