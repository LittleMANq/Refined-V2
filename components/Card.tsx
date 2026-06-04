import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows } from './theme';

type Props = {
  children?: ReactNode;
  /** soft = white with a warm soft shadow · surface = flat surface tone, no shadow. */
  variant?: 'soft' | 'surface';
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

/** Soft card. The default container for grouped content. */
export function Card({ children, variant = 'soft', padding, style }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'soft' ? styles.soft : styles.surface,
        padding != null && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
  },
  soft: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  surface: {
    backgroundColor: colors.surface,
  },
});
