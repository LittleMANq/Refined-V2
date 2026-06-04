import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  Eyebrow,
  GarmentSlot,
  PillButton,
  radii,
  Reveal,
  shadows,
  spacing,
  Text,
  Wordmark,
} from '@/components';
import { Icon, ProgressBar, Sweep } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ROUTES, useOnboarding } from '@/lib/onboarding';

export default function AnalysisScreen() {
  const { t } = useTranslation();
  const an = t.onboarding.analysis;
  const err = t.onboarding.error;
  const { photos, analysis, analysisStatus, runAnalysis } = useOnboarding();
  const [phase, setPhase] = useState(0);

  // Kick off the real analysis once. The provider guards against double-runs and
  // keeps the result, so coming back from review shows the done state immediately.
  useEffect(() => {
    if (analysisStatus === 'idle' || analysisStatus === 'error') {
      void runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle the phase phrases while working (cosmetic). Completion is driven by the
  // real request, never by this timer.
  useEffect(() => {
    if (analysisStatus !== 'working') return;
    const id = setInterval(() => setPhase((p) => (p + 1) % an.phases.length), 900);
    return () => clearInterval(id);
  }, [analysisStatus, an.phases.length]);

  const done = analysisStatus === 'done' && !!analysis;
  const failed = analysisStatus === 'error';
  const cover = photos[0];

  if (failed) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.errorBody}>
          <Reveal fromScale={0.9}>
            <View style={styles.errorIcon}>
              <View style={styles.errorRing} />
              <View style={styles.errorInner}>
                <Icon name="camera" size={28} color={colors.gold} />
              </View>
            </View>
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow align="center" style={styles.errorEyebrow}>
              {err.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={200}>
            <Text variant="serifXl" align="center">
              {err.title}
            </Text>
          </Reveal>
          <Reveal delay={300}>
            <Text variant="subtitle" align="center" style={styles.errorText}>
              {err.body}
            </Text>
          </Reveal>
        </View>
        <View style={styles.footer}>
          <PillButton
            label={err.tryAnother}
            onPress={() => router.replace(ROUTES.capture)}
            icon={<Icon name="refresh-cw" size={19} color={colors.paper} />}
          />
        </View>
      </SafeAreaView>
    );
  }

  const progressStep = done ? 1 : Math.min(0.9, 0.15 + phase * 0.18);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.brand}>
        <Wordmark size={16} />
      </View>

      <View style={styles.stage}>
        <View style={styles.photoFrame}>
          {cover ? (
            <Image source={{ uri: cover.uri }} style={styles.photo} resizeMode="cover" />
          ) : (
            <GarmentSlot tone="ink" radius={radii.lg} style={styles.fillSlot} />
          )}
          {!done ? <Sweep /> : null}
        </View>
      </View>

      <View style={styles.status}>
        <Text variant="body" align="center" style={styles.working}>
          {done ? an.done : an.working}
        </Text>
        <View style={styles.phaseWrap}>
          {!done ? (
            <Text variant="mono" color={colors.gold} align="center">
              {an.phases[phase]}
            </Text>
          ) : null}
        </View>
        <ProgressBar step={progressStep} total={1} style={styles.progress} />
      </View>

      <View style={styles.footer}>
        {done ? (
          <Reveal>
            <PillButton label={an.seeResults} onPress={() => router.push(ROUTES.review)} />
          </Reveal>
        ) : (
          <View style={styles.footerPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  brand: { alignItems: 'center', paddingTop: spacing.xl },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoFrame: {
    width: 188,
    aspectRatio: 3 / 4.4,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.float,
  },
  fillSlot: { width: '100%', height: '100%', aspectRatio: undefined },
  photo: { width: '100%', height: '100%' },
  status: { paddingHorizontal: spacing.xxl, alignItems: 'center' },
  working: { marginBottom: spacing.sm, maxWidth: 300 },
  phaseWrap: { height: 18, marginBottom: spacing.lg, justifyContent: 'center' },
  progress: { width: 200 },
  footer: { paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg, minHeight: 90, justifyContent: 'center' },
  footerPlaceholder: { height: 58 },
  errorBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  errorIcon: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  errorRing: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.gold28,
  },
  errorInner: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEyebrow: { marginBottom: spacing.md },
  errorText: { marginTop: spacing.md, maxWidth: 300 },
});
