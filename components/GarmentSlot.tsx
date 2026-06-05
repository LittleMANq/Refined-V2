import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';

import { fontFamilies } from './fonts';
import { Text } from './Text';
import { colors, radii, slotTones, type SlotTone } from './theme';

type Props = {
  tone?: SlotTone;
  /**
   * Real garment photo. When present it fills the slot (cover, 3:4) over the toned
   * fill (which shows as the load placeholder). Omit for the intentional toned
   * placeholder reserved for pieces without a photo.
   */
  source?: ImageSourcePropType;
  /** Shows a calm working overlay (e.g. while the piece is being auto-tagged). */
  loading?: boolean;
  /** Centered mono caption (e.g. "LOOK 01"). Reserved for real photography later. */
  label?: string;
  /** Fixed width; height follows the 3:4 ratio. Omit to fill the parent column. */
  width?: number;
  radius?: number;
  /** Adds a bottom dark gradient so overlaid text stays legible. */
  scrim?: boolean;
  /** Overlay content (rendered above the toned fill, e.g. a heart or caption). */
  children?: ReactNode;
  style?: ViewStyle;
};

const HIGHLIGHT: Record<'light' | 'ink', readonly [string, string]> = {
  light: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)'],
  ink: ['rgba(176,137,83,0.28)', 'rgba(176,137,83,0)'],
};
const SHADE: Record<'light' | 'ink', readonly [string, string]> = {
  light: ['rgba(27,23,20,0)', 'rgba(27,23,20,0.12)'],
  ink: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.32)'],
};

/**
 * The warm 3:4 portrait placeholder. The toned fill is intentional, reserved for
 * real photography. Never square. Built from layered gradients (soft top-left
 * highlight + bottom shade) over the tone color.
 */
export function GarmentSlot({
  tone = 'a',
  source,
  loading,
  label,
  width,
  radius = radii.slot,
  scrim,
  children,
  style,
}: Props) {
  const isInk = tone === 'ink';
  const key = isInk ? 'ink' : 'light';
  return (
    <View
      style={[
        styles.slot,
        {
          width,
          borderRadius: radius,
          backgroundColor: slotTones[tone],
          borderColor: isInk ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
        },
        style,
      ]}
    >
      {source ? (
        // Real photo: fill the slot (cover). The toned background shows while it loads.
        <Image source={source} resizeMode="cover" style={StyleSheet.absoluteFill} />
      ) : (
        // Toned placeholder: layered highlight + shade over the tone color.
        <>
          <LinearGradient
            pointerEvents="none"
            colors={HIGHLIGHT[key]}
            start={{ x: 0.22, y: 0.1 }}
            end={{ x: 0.75, y: 0.62 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            pointerEvents="none"
            colors={SHADE[key]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}
      {scrim ? (
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(27,23,20,0)', 'rgba(27,23,20,0.62)']}
          start={{ x: 0, y: 0.45 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {children}

      {label ? (
        <View style={styles.labelWrap} pointerEvents="none">
          <Text style={[styles.label, isInk && { color: '#D8CFC2' }]} align="center">
            {label}
          </Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color={colors.gold} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  labelWrap: {
    position: 'absolute',
    backgroundColor: colors.paper80,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink12,
  },
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: 10.5,
    letterSpacing: 1.3,
    color: colors.secondary,
    textTransform: 'uppercase',
  },
});
