import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PillButton, ScreenHeader, spacing, type SlotTone } from '@/components';
import { ArchetypeTile, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ONBOARDING_STEPS, ROUTES, useOnboarding } from '@/lib/onboarding';

export default function ArchetypeScreen() {
  const { t } = useTranslation();
  const a = t.onboarding.archetype;
  const { archetypes, toggleArchetype } = useOnboarding();

  const tiles: { id: string; label: string; sub: string; tone: SlotTone }[] = [
    { id: 'quiet', tone: 'a', ...a.quiet },
    { id: 'street', tone: 'b', ...a.street },
    { id: 'minimal', tone: 'c', ...a.minimal },
    { id: 'high', tone: 'b', ...a.high },
    { id: 'sport', tone: 'a', ...a.sport },
    { id: 'classic', tone: 'c', ...a.classic },
  ];
  const count = archetypes.length;

  return (
    <StepScreen
      onBack={() => router.back()}
      step={2}
      total={ONBOARDING_STEPS}
      footer={
        <PillButton
          label={count ? `${t.common.continue} · ${t.common.selected} ${count}` : a.chooseAtLeastOne}
          disabled={!count}
          onPress={() => router.push(ROUTES.capture)}
        />
      }
    >
      <ScreenHeader eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle} style={styles.header} />
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <View key={tile.id} style={styles.cell}>
            <ArchetypeTile
              label={tile.label}
              sub={tile.sub}
              tone={tile.tone}
              selected={archetypes.includes(tile.id)}
              onPress={() => toggleArchetype(tile.id)}
            />
          </View>
        ))}
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingBottom: spacing.lg },
  cell: { width: '47%', flexGrow: 1 },
});
