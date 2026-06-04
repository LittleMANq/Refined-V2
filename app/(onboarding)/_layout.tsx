import { Stack } from 'expo-router';

import { colors } from '@/components';
import { OnboardingProvider } from '@/lib/onboarding';

/**
 * Onboarding stack. One provider holds the flow state (inputs, the live analysis,
 * kept items) across every screen, so the cinematic moment carries the same data
 * from capture to reveal to persist. Calm fade transitions, no header.
 */
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.paper },
        }}
      />
    </OnboardingProvider>
  );
}
