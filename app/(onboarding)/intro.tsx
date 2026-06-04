import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  colors,
  Eyebrow,
  GarmentSlot,
  PillButton,
  radii,
  Reveal,
  spacing,
  stagger,
  Text,
  Wordmark,
} from '@/components';
import { Icon, PaletteStrip } from '@/components/onboarding';
import { ROUTES } from '@/lib/onboarding';
import { useTranslation } from '@/i18n';

const FLATTERS = ['שמנת', 'חול', 'טאופ', 'קוניאק'];

function HeroVisual() {
  return (
    <View style={styles.hero}>
      <View style={[styles.heroSlot, styles.heroBack, { transform: [{ rotate: '-10deg' }] }]}>
        <GarmentSlot tone="c" width={92} radius={radii.md} />
      </View>
      <View style={[styles.heroSlot, styles.heroBackRight, { transform: [{ rotate: '9deg' }] }]}>
        <GarmentSlot tone="b" width={86} radius={radii.md} />
      </View>
      <View style={[styles.heroSlot, styles.heroFront, { transform: [{ rotate: '-3deg' }] }]}>
        <GarmentSlot tone="a" width={132} radius={radii.lg} label="LOOK 01" />
      </View>
      <Card padding={spacing.md} style={styles.heroChip}>
        <View style={styles.chipRow}>
          <View style={styles.goldDot} />
          <Text variant="labelSm">אביב חם</Text>
        </View>
        <PaletteStrip palette={FLATTERS} height={16} style={styles.chipPalette} />
      </Card>
    </View>
  );
}

function FeatureVisual({ tone, chipIcon, chipLabel }: { tone: 'a' | 'b' | 'c'; chipIcon: 'sun' | 'heart' | 'grid'; chipLabel: string }) {
  return (
    <View style={styles.feature}>
      <GarmentSlot tone={tone} width={170} radius={radii.card} />
      <Card padding={spacing.sm} style={styles.featureChip}>
        <Icon name={chipIcon} size={16} color={colors.gold} />
        <Text variant="labelSm">{chipLabel}</Text>
      </Card>
    </View>
  );
}

export default function IntroScreen() {
  const { t } = useTranslation();
  const slides = t.onboarding.intro.slides;
  const [index, setIndex] = useState(0);
  const last = index === slides.length - 1;
  const slide = slides[index];

  const visuals = [
    <HeroVisual key="0" />,
    <FeatureVisual key="1" tone="b" chipIcon="sun" chipLabel="עונת אביב חם" />,
    <FeatureVisual key="2" tone="a" chipIcon="heart" chipLabel="מתאים לקו שלך" />,
    <FeatureVisual key="3" tone="c" chipIcon="grid" chipLabel="הארון שלך" />,
  ];

  const advance = () => (last ? router.push(ROUTES.context) : setIndex((i) => i + 1));

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.topbar}>
        <Wordmark size={18} />
        <Pressable onPress={() => router.push(ROUTES.context)} hitSlop={10}>
          <Text variant="label" color={colors.secondary}>
            {t.onboarding.intro.skip}
          </Text>
        </Pressable>
      </View>

      <View style={styles.stage} key={index}>
        <Reveal fromScale={0.94} translateY={10} style={styles.visualWrap}>
          {visuals[index]}
        </Reveal>
        <View style={styles.copy}>
          <Reveal delay={stagger(0)}>
            <Eyebrow style={styles.eyebrow}>{slide.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={stagger(1)}>
            <Text variant="serifXl">{slide.title}</Text>
          </Reveal>
          <Reveal delay={stagger(2)}>
            <Text variant="subtitle" style={styles.body}>
              {slide.body}
            </Text>
          </Reveal>
        </View>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setIndex(i)}
            hitSlop={8}
            style={[styles.dot, i === index ? styles.dotOn : styles.dotOff]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <PillButton label={last ? t.onboarding.intro.start : t.onboarding.intro.next} onPress={advance} />
      </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  stage: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.gutter },
  visualWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  copy: {},
  eyebrow: { marginBottom: spacing.md },
  body: { marginTop: spacing.md, maxWidth: 320 },
  hero: { width: 280, height: 300, alignSelf: 'center' },
  heroSlot: { position: 'absolute' },
  heroBack: { top: 54, insetInlineStart: 4 },
  heroBackRight: { top: 62, insetInlineEnd: 4 },
  heroFront: { top: 20, alignSelf: 'center' },
  heroChip: { position: 'absolute', bottom: 0, insetInlineStart: 0, width: 150 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  goldDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.gold },
  chipPalette: {},
  feature: { width: 230, height: 300, alignItems: 'center', justifyContent: 'center' },
  featureChip: {
    position: 'absolute',
    top: 30,
    insetInlineEnd: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dots: { flexDirection: 'row-reverse', justifyContent: 'center', gap: 7, paddingVertical: spacing.lg },
  dot: { height: 7, borderRadius: 999 },
  dotOn: { width: 22, backgroundColor: colors.gold },
  dotOff: { width: 7, backgroundColor: colors.hairline },
  footer: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.sm },
});
