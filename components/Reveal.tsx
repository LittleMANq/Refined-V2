import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { motion } from './theme';

const cinema = Easing.bezier(...motion.ease.cinema);

type Props = {
  children: ReactNode;
  /** Stagger delay in ms. Use `stagger(i)` for a sequence. */
  delay?: number;
  /** Upward travel distance. Set 0 for a pure fade. */
  translateY?: number;
  /** Start scale for hero moments (e.g. 0.92 grows to 1). Omit to skip scaling. */
  fromScale?: number;
  duration?: number;
  style?: ViewStyle;
};

/**
 * Staged reveal for hero moments: fade up (+ optional scale), eased on the
 * cinema curve. Reserved for key moments (the Style Identity reveal), not
 * scattered micro-animations. Respects the shared timing tokens.
 */
export function Reveal({
  children,
  delay = 0,
  translateY = 22,
  fromScale,
  duration = motion.duration.reveal,
  style,
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing: cinema }));
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p,
      transform:
        fromScale != null
          ? [{ translateY: (1 - p) * translateY }, { scale: fromScale + (1 - fromScale) * p }]
          : [{ translateY: (1 - p) * translateY }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

/** Even stagger helper: stagger(0)=start, stagger(1)=start+step, ... */
export function stagger(index: number, step = 90, start = 100): number {
  return start + index * step;
}
