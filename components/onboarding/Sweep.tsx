import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '../theme';

const BAR = 40;
const soft = Easing.bezier(...motion.ease.soft);

/**
 * A calm gold light sweeping down the analysis photo. Loops while the real
 * analysis runs, so the wait reads as "working", never a spinner. Pure cosmetic;
 * the success/failure is driven by the actual request, not this animation.
 */
export function Sweep() {
  const [height, setHeight] = useState(0);
  const progress = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h && h !== height) {
      setHeight(h);
      progress.value = 0;
      progress.value = withRepeat(withTiming(1, { duration: 2400, easing: soft }), -1, false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -BAR + progress.value * (height + BAR) }],
    opacity: progress.value < 0.2 || progress.value > 0.8 ? 0 : 1,
  }));

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={onLayout}>
      <Animated.View style={[styles.bar, animatedStyle]}>
        <LinearGradient
          colors={['rgba(176,137,83,0)', 'rgba(176,137,83,0.35)', 'rgba(176,137,83,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BAR,
  },
});
