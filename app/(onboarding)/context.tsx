import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PillButton, ScreenHeader, spacing, Text } from '@/components';
import { ContextRow, GenderTile, StepScreen } from '@/components/onboarding';
import { useTranslation, type Gender } from '@/i18n';
import { ONBOARDING_STEPS, ROUTES, useOnboarding } from '@/lib/onboarding';

const CONTEXT_IDS = ['work', 'casual', 'evening', 'smart'] as const;

export default function ContextScreen() {
  const { t } = useTranslation();
  const c = t.onboarding.context;
  const { gender, contexts, setGender, toggleContext } = useOnboarding();
  // gender defaults to 'unspecified' (a valid choice too), so track an explicit tap.
  const [genderPicked, setGenderPicked] = useState(false);

  const genders: { id: Gender; label: string }[] = [
    { id: 'woman', label: c.genderWoman },
    { id: 'man', label: c.genderMan },
    { id: 'unspecified', label: c.genderUnspecified },
  ];
  const contextLabels: Record<(typeof CONTEXT_IDS)[number], string> = {
    work: c.contextWork,
    casual: c.contextCasual,
    evening: c.contextEvening,
    smart: c.contextSmart,
  };

  const choose = (g: Gender) => {
    setGender(g);
    setGenderPicked(true);
  };
  const ready = genderPicked && contexts.length > 0;

  return (
    <StepScreen
      onBack={() => router.back()}
      step={1}
      total={ONBOARDING_STEPS}
      footer={
        <PillButton
          label={t.common.continue}
          disabled={!ready}
          onPress={() => router.push(ROUTES.archetype)}
        />
      }
    >
      <ScreenHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} titleSize={30} style={styles.header} />

      <View style={styles.genders}>
        {genders.map((g) => (
          <GenderTile
            key={g.id}
            label={g.label}
            selected={genderPicked && gender === g.id}
            onPress={() => choose(g.id)}
          />
        ))}
      </View>

      <Text variant="label" style={styles.contextLabel}>
        {c.contextQuestion}
      </Text>
      <View style={styles.contexts}>
        {CONTEXT_IDS.map((id) => (
          <View key={id} style={styles.contextCell}>
            <ContextRow
              label={contextLabels[id]}
              selected={contexts.includes(id)}
              onPress={() => toggleContext(id)}
            />
          </View>
        ))}
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.g26 },
  genders: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl },
  contextLabel: { marginBottom: spacing.md },
  contexts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  contextCell: { width: '47.8%', flexGrow: 1 },
});
