import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  GarmentSlot,
  PillButton,
  radii,
  ScreenHeader,
  spacing,
  Text,
  type SlotTone,
} from '@/components';
import { Icon, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ONBOARDING_STEPS, ROUTES, useOnboarding } from '@/lib/onboarding';
import type { ExtractedItem } from '@/lib/analysis';

const TONES: SlotTone[] = ['a', 'c', 'b'];

function itemDetail(item: ExtractedItem): string {
  return [item.color, item.pattern, item.attributes?.silhouette, item.attributes?.formality]
    .filter(Boolean)
    .join(' · ');
}

export default function ReviewScreen() {
  const { t } = useTranslation();
  const r = t.onboarding.review;
  const { analysis, keptItems, isItemKept, setItemKept } = useOnboarding();

  useEffect(() => {
    if (!analysis) router.replace(ROUTES.capture);
  }, [analysis]);

  if (!analysis) return null;

  const items = analysis.extracted_items;
  const keptCount = keptItems.length;

  return (
    <StepScreen
      onBack={() => router.back()}
      step={4}
      total={ONBOARDING_STEPS}
      bodyPaddingTop={spacing.g16}
      footer={
        <PillButton label={r.addToCloset} onPress={() => router.push(ROUTES.taste)} />
      }
    >
      <ScreenHeader
        eyebrow={r.eyebrow}
        title={`${r.found} ${items.length} ${r.items}`}
        subtitle={r.subtitle}
        titleSize={28}
        style={styles.header}
      />

      <View style={styles.list}>
        {items.map((item, i) => {
          const kept = isItemKept(i);
          return (
            <Card key={i} padding={spacing.md} style={[styles.card, !kept && styles.cardOff]}>
              <GarmentSlot tone={TONES[i % TONES.length]} width={64} radius={radii.sm} />
              <View style={styles.body}>
                <Text variant="mono" color={colors.gold} style={styles.caption}>
                  {r.item} {i + 1}
                </Text>
                <Text variant="label" style={styles.itemTitle}>
                  {item.type}
                </Text>
                {itemDetail(item) ? (
                  <Text variant="subtitle" style={styles.detail}>
                    {itemDetail(item)}
                  </Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={kept ? r.remove : r.keep}
                onPress={() => setItemKept(i, !kept)}
                style={[styles.toggle, kept ? styles.toggleKept : styles.toggleRemoved]}
              >
                <Icon
                  name={kept ? 'check' : 'plus'}
                  size={18}
                  color={kept ? colors.paper : colors.secondary}
                />
              </Pressable>
            </Card>
          );
        })}
      </View>

      <View style={styles.summary}>
        <Text variant="labelSm" color={colors.secondary} align="center">
          {r.savedPrefix} {keptCount} {r.savedSuffix} · {r.doneBody}
        </Text>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  list: { gap: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardOff: { opacity: 0.45 },
  body: { flex: 1 },
  caption: { marginBottom: 5 },
  itemTitle: { fontSize: 16 },
  detail: { fontSize: 13.5, marginTop: 2 },
  toggle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleKept: { backgroundColor: colors.gold },
  toggleRemoved: { borderWidth: 1.5, borderColor: colors.hairline },
  summary: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
});
