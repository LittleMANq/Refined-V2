/**
 * Dev-only design-system gallery: palette, type scale, and every component.
 * Specimen strings here are illustrative (this screen is a developer tool, not
 * product UI), so they are intentionally literal rather than from i18n.
 */
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  Chip,
  colors,
  Eyebrow,
  GarmentSlot,
  Hairline,
  PillButton,
  radii,
  Reveal,
  ScreenHeader,
  slotTones,
  spacing,
  stagger,
  Text,
  Wordmark,
  type SlotTone,
  type TypeVariant,
} from '@/components';

const PALETTE: { name: string; value: string }[] = [
  { name: 'ink', value: colors.ink },
  { name: 'paper', value: colors.paper },
  { name: 'surface', value: colors.surface },
  { name: 'hairline', value: colors.hairline },
  { name: 'secondary', value: colors.secondary },
  { name: 'gold', value: colors.gold },
];

const TONES: SlotTone[] = ['a', 'b', 'c', 'ink'];

const TYPE_SPECIMENS: { variant: TypeVariant; he: string; en: string }[] = [
  { variant: 'serifHero', he: 'מינימל יוקרתי', en: 'Minimal Luxe' },
  { variant: 'serifXl', he: 'זהות הסטייל שלך', en: 'Your Style Identity' },
  { variant: 'serifTitle', he: 'נקי ומדויק, בלי מאמץ', en: 'Clean and precise, effortless' },
  { variant: 'head', he: 'מה מושך אותך?', en: 'What draws you in?' },
  { variant: 'title', he: 'הלוק היומי שלך', en: 'Your daily look' },
  { variant: 'subtitle', he: 'כמה תמונות טובות, ותוך דקה הכול מוכן.', en: 'A few good photos, ready in a minute.' },
  { variant: 'body', he: 'כל לוק מגיע עם הסבר קצר למה הוא עובד עבורך.', en: 'Every look comes with a short why.' },
  { variant: 'label', he: 'הצבעים שמחמיאים לך', en: 'Colors that flatter you' },
  { variant: 'labelSm', he: 'עונת צבע', en: 'Color season' },
  { variant: 'eyebrow', he: 'סטייליסט אישי', en: 'Personal stylist' },
  { variant: 'mono', he: 'לוק 01 · יום', en: 'LOOK 01' },
];

function Section({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text variant="title">{title}</Text>
        <Eyebrow color={colors.secondary}>{sub}</Eyebrow>
      </View>
      {children}
    </View>
  );
}

export default function GalleryScreen() {
  const [chosen, setChosen] = useState('quiet');
  const [revealKey, setRevealKey] = useState(0);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topbar}>
        <Wordmark size={18} />
        <Chip label="חזרה" onPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="design system"
          title="מערכת העיצוב"
          subtitle="הצבעים, הטיפוגרפיה והרכיבים. מקור האמת החזותי."
          style={styles.pageHeader}
        />

        {/* PALETTE */}
        <Section title="צבעים" sub="palette">
          <View style={styles.swatchRow}>
            {PALETTE.map((c) => (
              <View key={c.name} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: c.value }]} />
                <Text variant="labelSm" style={styles.swatchName}>
                  {c.name}
                </Text>
                <Text variant="mono" color={colors.secondary}>
                  {c.value}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="labelSm" color={colors.secondary} style={styles.note}>
            גווני מילוי לתמונות 3:4
          </Text>
          <View style={styles.swatchRow}>
            {TONES.map((t) => (
              <View key={t} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: slotTones[t] }]} />
                <Text variant="mono" color={colors.secondary}>
                  tone {t}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* TYPE SCALE */}
        <Section title="טיפוגרפיה" sub="type scale">
          <View style={{ gap: spacing.lg }}>
            {TYPE_SPECIMENS.map((s) => (
              <View key={s.variant}>
                <Text variant="mono" color={colors.secondary} style={styles.specimenTag}>
                  {s.variant}
                </Text>
                <Text variant={s.variant}>{s.he}</Text>
                <Text variant={s.variant} color={colors.secondary}>
                  {s.en}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* BUTTONS */}
        <Section title="כפתורים" sub="pill buttons">
          <View style={{ gap: spacing.md }}>
            <PillButton label="בואו נתחיל" />
            <PillButton variant="gold" label="שדרגו ל-Refined Plus" />
            <PillButton variant="ghost" label="אולי אחר כך" />
            <PillButton variant="surface" label="דלג" />
            <PillButton label="בחרו לפחות אחד" disabled />
          </View>
        </Section>

        {/* CARDS */}
        <Section title="כרטיסים" sub="cards">
          <Card padding={spacing.lg} style={styles.stackItem}>
            <Text variant="label">כרטיס רך</Text>
            <Text variant="subtitle" style={styles.cardBody}>
              המכל הרגיל לתוכן מקובץ.
            </Text>
          </Card>
          <Card variant="surface" padding={spacing.lg}>
            <Text variant="label">כרטיס משטח</Text>
            <Text variant="subtitle" style={styles.cardBody}>
              שטוח, בלי צל.
            </Text>
          </Card>
        </Section>

        {/* GARMENT SLOTS */}
        <Section title="משבצות בגד" sub="3:4 slots">
          <View style={styles.slotRow}>
            {TONES.map((t) => (
              <GarmentSlot key={t} tone={t} label={`tone ${t}`} style={styles.flex1} />
            ))}
          </View>
          <View style={[styles.slotRow, styles.stackItem]}>
            <GarmentSlot tone="a" scrim style={styles.flex1}>
              <View style={styles.tileOverlay}>
                <Text variant="label" color={colors.paper}>
                  יוקרה שקטה
                </Text>
                <Text variant="mono" color={colors.paper}>
                  מינימליזם עשיר
                </Text>
              </View>
            </GarmentSlot>
            <GarmentSlot tone="c" scrim style={styles.flex1}>
              <View style={styles.tileOverlay}>
                <Text variant="label" color={colors.paper}>
                  קלאסי
                </Text>
                <Text variant="mono" color={colors.paper}>
                  נצחי ושקול
                </Text>
              </View>
            </GarmentSlot>
          </View>
        </Section>

        {/* DIVIDER + CHIPS */}
        <Section title="קו מפריד וצ'יפים" sub="hairline & chips">
          <Hairline style={styles.stackItem} />
          <View style={styles.chipRow}>
            {['quiet', 'street', 'minimal', 'classic'].map((id) => (
              <Chip
                key={id}
                label={{ quiet: 'יוקרה שקטה', street: 'סטריט', minimal: 'מינימל', classic: 'קלאסי' }[id]!}
                active={chosen === id}
                onPress={() => setChosen(id)}
              />
            ))}
          </View>
        </Section>

        {/* REVEAL MOTION */}
        <Section title="אנימציית חשיפה" sub="reveal motion">
          <Chip label="הרצה מחדש" onPress={() => setRevealKey((k) => k + 1)} style={styles.stackItem} />
          <View key={revealKey}>
            <Reveal delay={stagger(0)} fromScale={0.92}>
              <Eyebrow style={styles.revealEyebrow}>זהות הסטייל שלך</Eyebrow>
            </Reveal>
            <Reveal delay={stagger(1)}>
              <Text variant="serifXl">מינימל יוקרתי</Text>
            </Reveal>
            <Reveal delay={stagger(2)}>
              <Text variant="subtitle" style={styles.cardBody}>
                נקי ומדויק, בלי מאמץ. בסיס שקט עם נגיעות יוקרה.
              </Text>
            </Reveal>
          </View>
        </Section>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.md,
  },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm },
  pageHeader: { marginBottom: spacing.xxl },
  section: { marginBottom: spacing.xxl },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatchItem: { gap: 4 },
  swatch: {
    width: 92,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  swatchName: { textTransform: 'capitalize' },
  note: { marginTop: spacing.lg, marginBottom: spacing.sm },
  specimenTag: { marginBottom: 6 },
  stackItem: { marginBottom: spacing.md },
  cardBody: { marginTop: 6 },
  slotRow: { flexDirection: 'row', gap: spacing.md },
  flex1: { flex: 1 },
  tileOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    gap: 2,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  revealEyebrow: { marginBottom: spacing.md },
  bottomPad: { height: spacing.xxl },
});
