import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Chip, PillButton, ScreenHeader, spacing, Text, type SlotTone } from '@/components';
import { ArchetypeTile, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ONBOARDING_STEPS, ROUTES, useOnboarding, type Fit, type Taste } from '@/lib/onboarding';

export default function TasteScreen() {
  const { t } = useTranslation();
  const ts = t.onboarding.taste;
  const { taste, fit, setTaste, setFit } = useOnboarding();

  const tasteOptions: { id: Taste; label: string; note: string; tone: SlotTone }[] = [
    { id: 'soft', label: ts.softLabel, note: ts.softNote, tone: 'c' },
    { id: 'sharp', label: ts.sharpLabel, note: ts.sharpNote, tone: 'a' },
  ];
  const fits: { id: Fit; label: string }[] = [
    { id: 'tailored', label: ts.fitTailored },
    { id: 'regular', label: ts.fitRegular },
    { id: 'relaxed', label: ts.fitRelaxed },
  ];
  const ready = !!taste && !!fit;

  return (
    <StepScreen
      onBack={() => router.back()}
      step={5}
      total={ONBOARDING_STEPS}
      footer={<PillButton label={ts.cta} disabled={!ready} onPress={() => router.push(ROUTES.reveal)} />}
    >
      <ScreenHeader eyebrow={ts.eyebrow} title={ts.title} subtitle={ts.subtitle} style={styles.header} />

      <View style={styles.tasteGrid}>
        {tasteOptions.map((opt) => (
          <View key={opt.id} style={styles.tasteCell}>
            <ArchetypeTile
              label={opt.label}
              sub={opt.note}
              tone={opt.tone}
              selected={taste === opt.id}
              onPress={() => setTaste(opt.id)}
            />
          </View>
        ))}
      </View>

      <Text variant="label" style={styles.fitLabel}>
        {ts.fitQuestion}
      </Text>
      <View style={styles.fits}>
        {fits.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            active={fit === f.id}
            onPress={() => setFit(f.id)}
            style={styles.fitChip}
          />
        ))}
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  tasteGrid: { flexDirection: 'row', gap: spacing.md },
  tasteCell: { flex: 1 },
  fitLabel: { marginTop: spacing.xxl, marginBottom: spacing.md },
  fits: { flexDirection: 'row', gap: spacing.sm },
  fitChip: { flex: 1, justifyContent: 'center', height: 46 },
});
