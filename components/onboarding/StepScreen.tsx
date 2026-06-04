import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';
import { OnboardingHeader } from './OnboardingHeader';

type Props = {
  children: ReactNode;
  /** Sticky bottom CTA region. A soft paper fade sits above it. */
  footer?: ReactNode;
  onBack?: () => void;
  step?: number;
  total?: number;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

/**
 * The shared onboarding scaffold: paper screen, the back+progress header, a
 * scrollable body, and a sticky footer with a soft fade. Calm screens (context,
 * archetype, capture, review, taste) compose this; cinematic ones (intro, analysis,
 * reveal) lay out by hand.
 */
export function StepScreen({
  children,
  footer,
  onBack,
  step,
  total,
  scroll = true,
  contentStyle,
}: Props) {
  const body = <View style={[styles.body, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <OnboardingHeader onBack={onBack} step={step} total={total} />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{body}</View>
      )}
      {footer ? (
        <View style={styles.footer}>
          <LinearGradient
            pointerEvents="none"
            colors={[colors.paper0, colors.paper]}
            style={styles.footerFade}
          />
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  footerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -28,
    height: 28,
  },
});
