import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, colors, Eyebrow, PillButton, Reveal, spacing, stagger, Text, Wordmark } from '@/components';
import { GeneratedLookView, InfoState, LookLoading } from '@/components/app';
import { Icon, PaletteStrip } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { NeedMorePiecesError } from '@/lib/ai';
import { DAILY_LOOK_MIN_PIECES } from '@/lib/closet';
import { useDailyLook, usePieces, useProfile } from '@/lib/hooks';

export default function TodayScreen() {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: pieces } = usePieces();
  const daily = useDailyLook();

  if (profileLoading || !profile) {
    return (
      <View style={styles.center}>
        <Wordmark size={22} />
      </View>
    );
  }

  const identity = profile.style_identity;
  const palette = profile.analysis?.color_palette?.flatters ?? [];
  const generating = daily.isFetching;
  const needMore = daily.error instanceof NeedMorePiecesError;

  // How many more pieces unlock the daily look (specific + motivating, not a dead
  // end). Real, derived from the closet size against the daily-look floor.
  const needed = Math.max(DAILY_LOOK_MIN_PIECES - (pieces?.length ?? 0), 1);
  const unlockBody =
    needed === 1
      ? t.today.unlockOne
      : `${t.today.unlockManyPrefix} ${needed} ${t.today.unlockManySuffix}`;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View style={styles.flex}>
            <Text variant="mono" color={colors.secondary} style={styles.greeting}>
              {t.today.greeting}
            </Text>
            {identity?.name ? <Text variant="title">{identity.name}</Text> : null}
          </View>
          <Wordmark size={18} />
        </View>

        {palette.length ? (
          <Reveal delay={stagger(0)} style={styles.palette}>
            <PaletteStrip palette={palette} height={34} />
          </Reveal>
        ) : null}

        <Reveal delay={stagger(1)} style={styles.section}>
          <Eyebrow style={styles.eyebrow}>{t.today.todayLookEyebrow}</Eyebrow>

          {generating ? (
            <LookLoading message={t.ai.generating} />
          ) : needMore ? (
            <InfoState
              icon="plus"
              eyebrow={t.today.unlockEyebrow}
              title={t.today.unlockTitle}
              body={unlockBody}
              ctaLabel={t.today.unlockCta}
              onCta={() => router.push('/closet-add')}
            />
          ) : daily.isError ? (
            <InfoState
              icon="refresh-cw"
              title={t.ai.errorTitle}
              body={t.ai.errorBody}
              ctaLabel={t.common.retry}
              onCta={() => daily.refetch()}
            />
          ) : daily.data && pieces ? (
            <View>
              <GeneratedLookView look={daily.data} pieces={pieces} heading={identity?.name} compact />
              <View style={styles.actions}>
                <PillButton
                  variant="surface"
                  label={t.today.regenerate}
                  onPress={() => daily.refetch()}
                  icon={<Icon name="swap" size={18} color={colors.ink} />}
                  style={styles.actionBtn}
                />
                <PillButton
                  label={t.today.details}
                  onPress={() => router.push('/look')}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          ) : null}
        </Reveal>

        <Reveal delay={stagger(2)} style={styles.quick}>
          <Pressable style={styles.flex} onPress={() => router.navigate('/closet')}>
            <Card padding={spacing.lg}>
              <Icon name="hanger" size={22} color={colors.gold} />
              <Text variant="label" style={styles.quickTitle}>
                {t.today.closetCard}
              </Text>
              <Text variant="labelSm" color={colors.secondary} style={styles.quickSub}>
                {pieces?.length ?? 0} {t.common.pieces}
              </Text>
            </Card>
          </Pressable>
          <Pressable style={styles.flex} onPress={() => router.navigate('/create')}>
            <Card padding={spacing.lg}>
              <Icon name="sparkle" size={22} color={colors.gold} />
              <Text variant="label" style={styles.quickTitle}>
                {t.tabs.create}
              </Text>
              <Text variant="labelSm" color={colors.secondary} style={styles.quickSub}>
                {t.create.occasionLabel}
              </Text>
            </Card>
          </Pressable>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg },
  greeting: { marginBottom: 6 },
  palette: { marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  eyebrow: { marginBottom: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  actionBtn: { flex: 1 },
  quick: { flexDirection: 'row', gap: spacing.md },
  quickTitle: { marginTop: spacing.sm },
  quickSub: { marginTop: 2 },
});
