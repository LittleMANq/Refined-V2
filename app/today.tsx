import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  colors,
  Eyebrow,
  GarmentSlot,
  Hairline,
  Reveal,
  spacing,
  stagger,
  Text,
  Wordmark,
} from '@/components';
import { Icon, PaletteStrip } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { getProfile, listOutfits, listPieces, supabase } from '@/lib/data';
import { ROUTES } from '@/lib/onboarding';

function useTodayData() {
  return useQuery({
    queryKey: ['today'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return null;
      const [profile, outfits, pieces] = await Promise.all([
        getProfile(user.id),
        listOutfits(user.id),
        listPieces(user.id),
      ]);
      return { profile, outfits, pieces };
    },
  });
}

export default function TodayScreen() {
  const { t, toggleLocale } = useTranslation();
  const { data, isLoading } = useTodayData();

  // No session, send the user into onboarding (e.g. signed out / fresh install).
  useEffect(() => {
    if (!isLoading && data === null) router.replace(ROUTES.intro);
  }, [isLoading, data]);

  if (isLoading || !data) {
    return (
      <View style={styles.center}>
        <Wordmark size={22} />
      </View>
    );
  }

  const { profile, outfits, pieces } = data;
  const identity = profile?.style_identity;
  const palette = profile?.analysis?.color_palette?.flatters ?? [];
  const todayLook = outfits.find((o) => o.saved) ?? outfits[0] ?? null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View>
            <Text variant="mono" color={colors.secondary} style={styles.greeting}>
              {t.today.greeting}
            </Text>
            {identity?.name ? <Text variant="title">{identity.name}</Text> : null}
          </View>
          <Wordmark size={18} />
        </View>

        {/* the earned identity */}
        <Reveal delay={stagger(0)} style={styles.section}>
          <Eyebrow style={styles.eyebrow}>{t.today.identityEyebrow}</Eyebrow>
          {identity?.description ? (
            <Text variant="serifTitle" style={styles.identityDesc}>
              {identity.description}
            </Text>
          ) : null}
          {palette.length ? (
            <View style={styles.palette}>
              <View style={styles.paletteHead}>
                <Text variant="labelSm" color={colors.secondary}>
                  {t.today.paletteLabel}
                </Text>
                {profile?.analysis?.color_season ? (
                  <Text variant="mono" color={colors.gold}>
                    {profile.analysis.color_season}
                  </Text>
                ) : null}
              </View>
              <PaletteStrip palette={palette} height={44} />
            </View>
          ) : null}
        </Reveal>

        {/* today's look + reasoning */}
        <Reveal delay={stagger(1)} style={styles.section}>
          <Eyebrow style={styles.eyebrow}>{t.today.todayLookEyebrow}</Eyebrow>
          {todayLook ? (
            <Card style={styles.lookCard}>
              <GarmentSlot tone="a" radius={0} style={styles.lookSlot} label="TODAY" />
              <View style={styles.lookBody}>
                <View style={styles.whyRow}>
                  <Icon name="star" size={15} color={colors.gold} />
                  <Text variant="mono" color={colors.gold}>
                    {t.today.whyThis}
                  </Text>
                </View>
                <Text variant="body" style={styles.reasoning}>
                  {todayLook.reasoning}
                </Text>
              </View>
            </Card>
          ) : (
            <Card padding={spacing.lg}>
              <Text variant="label">{t.today.noLookTitle}</Text>
              <Text variant="subtitle" style={styles.noLookBody}>
                {t.today.noLookBody}
              </Text>
            </Card>
          )}
        </Reveal>

        {/* closet */}
        <Reveal delay={stagger(2)}>
          <Card padding={spacing.lg} style={styles.closet}>
            <Icon name="grid" size={22} color={colors.gold} />
            <View style={styles.closetText}>
              <Text variant="label">{t.today.closetCard}</Text>
              <Text variant="labelSm" color={colors.secondary} style={styles.closetCount}>
                {pieces.length} {t.common.pieces}
              </Text>
            </View>
          </Card>
        </Reveal>

        <Hairline style={styles.divider} />
        <View style={styles.dev}>
          <Pressable onPress={toggleLocale} hitSlop={8}>
            <Text variant="label" color={colors.secondary}>
              {t.common.switchLanguage}
            </Text>
          </Pressable>
          {__DEV__ ? (
            <Pressable onPress={() => router.push('/gallery')} hitSlop={8}>
              <Text variant="label" color={colors.secondary}>
                {t.today.openGallery}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  topbar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  greeting: { marginBottom: 6 },
  section: { marginBottom: spacing.xxl },
  eyebrow: { marginBottom: spacing.md },
  identityDesc: { lineHeight: 32, marginBottom: spacing.lg },
  palette: {},
  paletteHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  lookCard: { overflow: 'hidden' },
  lookSlot: { width: '100%', aspectRatio: 3 / 4 },
  lookBody: { padding: spacing.lg },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  reasoning: { lineHeight: 26 },
  noLookBody: { marginTop: spacing.sm },
  closet: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  closetText: { flex: 1 },
  closetCount: { marginTop: 2 },
  divider: { marginVertical: spacing.xl },
  dev: { flexDirection: 'row', justifyContent: 'space-between' },
});
