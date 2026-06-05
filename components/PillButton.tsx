import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { fontFamilies } from './fonts';
import { Text } from './Text';
import { colors, radii, shadows } from './theme';

export type PillVariant = 'primary' | 'gold' | 'ghost' | 'surface';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: PillVariant;
  disabled?: boolean;
  /** md = the full 58px CTA · sm = a lighter 50px secondary (e.g. paired footer actions). */
  size?: 'md' | 'sm';
  /** Optional leading icon (already colored to match the variant). */
  icon?: ReactNode;
  style?: ViewStyle;
};

const BACKGROUNDS: Record<PillVariant, string> = {
  primary: colors.ink,
  gold: colors.gold,
  ghost: 'transparent',
  surface: colors.surface,
};

const TEXT_COLORS: Record<PillVariant, string> = {
  primary: colors.paper,
  gold: colors.paper,
  ghost: colors.ink,
  surface: colors.ink,
};

/**
 * Full-width pill CTA. Ink is the primary action color everywhere; gold is the
 * one premium exception (the paywall / upgrade CTA). Ghost and surface are quiet
 * secondary actions.
 */
export function PillButton({ label, onPress, variant = 'primary', disabled, size = 'md', icon, style }: Props) {
  const hasShadow = (variant === 'primary' || variant === 'gold') && !disabled;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        size === 'sm' && styles.pillSm,
        { backgroundColor: BACKGROUNDS[variant] },
        variant === 'ghost' && styles.ghostBorder,
        hasShadow && shadows.pill,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[size === 'sm' ? styles.labelSm : styles.label, { color: TEXT_COLORS[variant] }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 58,
    borderRadius: radii.pill,
  },
  pillSm: {
    height: 50,
    gap: 8,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  label: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 17,
    lineHeight: 22,
  },
  labelSm: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  icon: {
    flexShrink: 0,
  },
  pressed: {
    transform: [{ scale: 0.975 }],
  },
  disabled: {
    opacity: 0.35,
  },
});
