import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  colors,
  Eyebrow,
  GarmentSlot,
  Hairline,
  PillButton,
  radii,
  Reveal,
  spacing,
  stagger,
  Text,
  type SlotTone,
} from '@/components';
import { Icon, LookCard, OnboardingHeader, PaletteStrip } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ROUTES, useOnboarding } from '@/lib/onboarding';

const LOOK_TONES: SlotTone[] = ['a', 'c', 'b'];
const FLOATS: { tone: SlotTone; top: number; side: 'start' | 'end'; offset: number; rot: string; w: number; delay: number }[] = [
  { tone: 'a', top: 70, side: 'start', offset: -8, rot: '-10deg', w: 74, delay: 200 },
  { tone: 'c', top: 50, side: 'end', offset: -10, rot: '9deg', w: 84, delay: 280 },
  { tone: 'b', top: 250, side: 'start', offset: 6, rot: '7deg', w: 62, delay: 360 },
  { tone: 'a', top: 268, side: 'end', offset: 8, rot: '-8deg', w: 68, delay: 440 },
];

export default function RevealScreen() {
  const { t } = useTranslation();
  const rv = t.onboarding.reveal;
  const { analysis, persist } = useOnboarding();
  const scrollRef = useRef<ScrollView>(null);
  const [beat, setBeat] = useState(0); // remount key to replay beat 1
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!analysis) router.replace(ROUTES.capture);
  }, [analysis]);

  if (!analysis) return null;

  const looks = analysis.looks.slice(0, 3);

  const save = async () => {
    setSaving(true);
    setError(false);
    try {
      await persist();
      router.push(ROUTES.signup);
    } catch {
      setError(true);
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <OnboardingHeader onBack={() => router.back()} step={6} total={7} />

      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== BEAT 1 — the moment ===== */}
        <View style={styles.beat1} key={beat}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {FLOATS.map((f, i) => (
              <Reveal
                key={i}
                delay={f.delay}
                translateY={0}
                fromScale={0.7}
                duration={1100}
                style={[
                  styles.float,
                  { top: f.top, transform: [{ rotate: f.rot }] },
                  f.side === 'start' ? { insetInlineStart: f.offset } : { insetInlineEnd: f.offset },
                ]}
              >
                <GarmentSlot tone={f.tone} width={f.w} radius={radii.md} style={styles.floatSlot} />
              </Reveal>
            ))}
          </View>

          <View style={styles.nameBlock}>
            <Reveal delay={stagger(0)}>
              <Eyebrow align="center" style={styles.eyebrow}>
                {rv.eyebrow}
              </Eyebrow>
            </Reveal>
            <Reveal delay={stagger(1)} fromScale={0.96}>
              <View style={styles.rule}>
                <View style={styles.ruleLine} />
                <View style={styles.ruleDot} />
                <View style={styles.ruleLine} />
              </View>
            </Reveal>
            <Reveal delay={stagger(2)} fromScale={0.94}>
              <Text variant="serifHero" align="center" style={styles.name}>
                {analysis.styleIdentity.name}
              </Text>
            </Reveal>
            {analysis.color_season ? (
              <Reveal delay={stagger(3)}>
                <Text variant="mono" color={colors.secondary} align="center" style={styles.season}>
                  {analysis.color_season}
                </Text>
              </Reveal>
            ) : null}
          </View>

          <Reveal delay={stagger(4)} style={styles.scrollHint}>
            <Text variant="mono" color={colors.secondary} align="center">
              {rv.scrollHint}
            </Text>
            <Icon name="chevron-down" size={18} color={colors.gold} />
          </Reveal>
        </View>

        {/* ===== BEAT 2 — the details ===== */}
        <Hairline style={styles.divider} />

        {analysis.styleIdentity.description ? (
          <Text variant="serifTitle" style={styles.description}>
            {analysis.styleIdentity.description}
          </Text>
        ) : null}

        {analysis.bodyInsight ? (
          <View style={styles.insight}>
            <Icon name="star" size={16} color={colors.gold} />
            <Text variant="body" style={styles.insightText}>
              {analysis.bodyInsight}
            </Text>
          </View>
        ) : null}

        {/* COLOR PALETTE */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text variant="label">{rv.paletteLabel}</Text>
            {analysis.color_season ? (
              <Text variant="mono" color={colors.gold}>
                {analysis.color_season}
              </Text>
            ) : null}
          </View>
          <PaletteStrip palette={analysis.color_palette.flatters} showNames />
        </View>

        {/* THREE FIRST LOOKS */}
        <View style={styles.section}>
          <Text variant="label" style={styles.looksLabel}>
            {rv.looksLabel}
          </Text>
          <View style={styles.looks}>
            {looks.map((look, i) => (
              <LookCard
                key={i}
                caption={`${t.common.look} ${String(i + 1).padStart(2, '0')}`}
                title={look.title}
                why={look.description}
                tone={LOOK_TONES[i % LOOK_TONES.length]}
              />
            ))}
          </View>
        </View>

        {/* NEXT ITEM — the Day-0 shopping seed, framed as advice */}
        {analysis.nextItem ? (
          <Card padding={spacing.lg} style={styles.nextItem}>
            <View style={styles.nextHead}>
              <Icon name="shopping-bag" size={16} color={colors.gold} />
              <Text variant="mono" color={colors.gold}>
                {rv.nextItemLabel}
              </Text>
            </View>
            <Text variant="label" style={styles.nextName}>
              {analysis.nextItem.item}
            </Text>
            <Text variant="subtitle" style={styles.nextWhy}>
              {analysis.nextItem.why}
            </Text>
          </Card>
        ) : null}

        {/* CONFIRM */}
        <View style={styles.confirm}>
          <Text variant="subtitle" align="center" style={styles.confirmLabel}>
            {rv.feelsRight}
          </Text>
          <View style={styles.confirmRow}>
            <View style={styles.confirmChipOn}>
              <Icon name="check" size={16} color={colors.paper} />
              <Text variant="label" color={colors.paper}>
                {rv.spotOn}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
                setBeat((b) => b + 1);
              }}
              style={styles.confirmChipOff}
            >
              <Icon name="refresh-cw" size={16} color={colors.ink} />
              <Text variant="label">{rv.fineTune}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {error ? (
          <Text variant="labelSm" color={colors.gold} align="center" style={styles.saveError}>
            {rv.saveError}
          </Text>
        ) : null}
        <PillButton label={saving ? rv.saving : rv.save} disabled={saving} onPress={save} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.xxl },
  beat1: {
    minHeight: 560,
    alignItems: 'center',
    justifyContent: 'center',
  },
  float: { position: 'absolute', opacity: 0.8 },
  floatSlot: { opacity: 0.85 },
  nameBlock: { alignItems: 'center' },
  eyebrow: { marginBottom: spacing.lg },
  rule: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  ruleLine: { width: 28, height: 1, backgroundColor: colors.gold },
  ruleDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: colors.gold, marginHorizontal: 8 },
  name: { fontSize: 54, lineHeight: 58 },
  season: { marginTop: spacing.lg },
  scrollHint: { position: 'absolute', bottom: 0, alignItems: 'center', gap: 4 },
  divider: { marginBottom: spacing.xl },
  description: {
    marginBottom: spacing.xl,
    lineHeight: 33,
  },
  insight: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  insightText: { flex: 1, lineHeight: 25 },
  section: { marginBottom: spacing.xxl },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  looksLabel: { marginBottom: spacing.md },
  looks: { gap: spacing.md },
  nextItem: { marginBottom: spacing.xxl },
  nextHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  nextName: { fontSize: 17 },
  nextWhy: { fontSize: 14, marginTop: 4 },
  confirm: { alignItems: 'center', paddingVertical: spacing.lg },
  confirmLabel: { marginBottom: spacing.md },
  confirmRow: { flexDirection: 'row', gap: spacing.sm },
  confirmChipOn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: colors.ink,
  },
  confirmChipOff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  footer: { paddingHorizontal: spacing.gutter, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  saveError: {},
});
