import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  colors,
  Eyebrow,
  fontFamilies,
  Hairline,
  radii,
  spacing,
  Text,
  Wordmark,
} from '@/components';
import { LockedTeaser } from '@/components/app';
import { Icon, PaletteStrip, type IconName } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { useFeatureFlag, useProfile } from '@/lib/hooks';

function SettingRow({
  icon,
  label,
  sub,
  last,
}: {
  icon: IconName;
  label: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <View>
      <View style={styles.settingRow}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={18} color={colors.gold} />
        </View>
        <View style={styles.flex}>
          <Text variant="label" style={styles.settingLabel}>
            {label}
          </Text>
          <Text variant="labelSm" color={colors.secondary} style={styles.settingSub}>
            {sub}
          </Text>
        </View>
        <Icon name="chevron-left" size={18} color={colors.secondary} />
      </View>
      {!last ? <Hairline style={styles.settingDivider} /> : null}
    </View>
  );
}

export default function YouScreen() {
  const { t } = useTranslation();
  const y = t.you;
  const sc = t.scaffold;
  const arch = t.onboarding.archetype;
  const showEvolution = useFeatureFlag('style_evolution');
  const showFriends = useFeatureFlag('friends');
  const showLocation = useFeatureFlag('location_permission');
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <View style={styles.center}>
        <Wordmark size={22} />
      </View>
    );
  }

  const identity = profile.style_identity;
  const analysis = profile.analysis;
  const palette = analysis?.color_palette?.flatters ?? [];
  const archetypeLabels: Record<string, string> = {
    quiet: arch.quiet.label,
    street: arch.street.label,
    minimal: arch.minimal.label,
    high: arch.high.label,
    sport: arch.sport.label,
    classic: arch.classic.label,
  };
  const worlds = (identity?.archetypes ?? []).map((id) => archetypeLabels[id] ?? id);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* identity hero */}
        <View style={styles.heroRow}>
          <View style={styles.flex}>
            <Eyebrow style={styles.eyebrow}>{y.identityEyebrow}</Eyebrow>
            {identity?.name ? (
              <Text variant="serifXl" style={styles.identityName}>
                {identity.name}
              </Text>
            ) : null}
          </View>
          <Wordmark size={18} />
        </View>
        {identity?.description ? (
          <Text variant="subtitle" style={styles.description}>
            {identity.description}
          </Text>
        ) : null}

        {/* palette */}
        {palette.length ? (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text variant="label">{y.paletteLabel}</Text>
              {analysis?.color_season ? (
                <Text variant="mono" color={colors.gold}>
                  {analysis.color_season}
                </Text>
              ) : null}
            </View>
            <PaletteStrip palette={palette} height={52} radius={radii.r14} />
          </View>
        ) : null}

        {/* worlds / archetypes */}
        {worlds.length ? (
          <View style={styles.section}>
            <Text variant="label" style={styles.worldsLabel}>
              {y.worldsLabel}
            </Text>
            <View style={styles.worlds}>
              {worlds.map((w) => (
                <View key={w} style={styles.worldChip}>
                  <Text variant="label" color={colors.paper}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* style evolution — scaffolded, gated by the style_evolution flag */}
        {showEvolution ? (
          <Card padding={spacing.lg} style={styles.section}>
            <View style={styles.evolutionHead}>
              <Text variant="label">{y.evolutionTitle}</Text>
              <View style={styles.soon}>
                <Text variant="mono" color={colors.gold} style={styles.soonText}>
                  {y.soon}
                </Text>
              </View>
            </View>
            <View style={styles.bars}>
              {[26, 34, 30, 42, 38, 50, 46].map((h, i) => (
                <View
                  key={i}
                  style={[styles.bar, { height: h, backgroundColor: i === 6 ? colors.gold : colors.surface }]}
                />
              ))}
            </View>
            <Text variant="subtitle" style={styles.evolutionBody}>
              {y.evolutionBody}
            </Text>
          </Card>
        ) : null}

        {/* scaffolded social / context teasers */}
        {showFriends ? (
          <View style={styles.teaser}>
            <LockedTeaser icon="message-circle" title={sc.friendsTitle} body={sc.friendsBody} soon={sc.soon} />
          </View>
        ) : null}
        {showLocation ? (
          <View style={styles.teaser}>
            <LockedTeaser icon="globe" title={sc.locationTitle} body={sc.locationBody} soon={sc.soon} />
          </View>
        ) : null}

        {/* settings */}
        <Card padding={0} style={styles.settingsCard}>
          <SettingRow icon="user" label={y.settingsAccount} sub={y.settingsAccountSub} />
          <SettingRow icon="bell" label={y.settingsNotifications} sub={y.settingsNotificationsSub} />
          <SettingRow icon="lock" label={y.settingsPrivacy} sub={y.settingsPrivacySub} last />
        </Card>

        {/* subscription entry point (paywall not built here) */}
        <View style={styles.plus}>
          <View style={styles.plusIcon}>
            <Icon name="sparkle" size={20} color={colors.gold} />
          </View>
          <View style={styles.flex}>
            <Text variant="label" color={colors.paper} style={styles.plusTitle}>
              {y.plusTitle}
            </Text>
            <Text variant="labelSm" color={colors.paper} style={styles.plusSub}>
              {y.plusSub}
            </Text>
          </View>
          <Icon name="chevron-left" size={18} color={colors.paper} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.g22, paddingTop: spacing.g26, paddingBottom: spacing.xxl },
  flex: { flex: 1 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  identityName: { fontSize: 40, lineHeight: 41 },
  eyebrow: { marginBottom: spacing.md },
  description: { marginTop: spacing.g16, marginBottom: spacing.g26 },
  section: { marginBottom: spacing.g26 },
  teaser: { marginBottom: spacing.g16 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.g12 },
  worldsLabel: { marginBottom: spacing.g12 },
  worlds: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.g9 },
  // Matches the gallery's `chip chip--on`: ink fill AND a 1px ink border (same
  // footprint as every other chip in the app).
  worldChip: { backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.ink, borderRadius: 999, paddingHorizontal: 18, height: 38, alignItems: 'center', justifyContent: 'center' },
  evolutionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  soon: { backgroundColor: colors.gold14, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  soonText: { fontSize: 9.5 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 56, opacity: 0.55 },
  bar: { flex: 1, borderRadius: 6 },
  evolutionBody: { fontSize: 13.5, marginTop: spacing.md, lineHeight: 20 },
  settingsCard: { overflow: 'hidden', marginBottom: spacing.g16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.g16, paddingVertical: 15 },
  settingIcon: { width: 36, height: 36, borderRadius: radii.r12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15 },
  settingSub: { marginTop: 2 },
  settingDivider: { marginHorizontal: spacing.g16 },
  plus: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.ink, borderRadius: radii.card, padding: spacing.g16 },
  plusIcon: { width: 38, height: 38, borderRadius: radii.r12, backgroundColor: colors.gold22, alignItems: 'center', justifyContent: 'center' },
  plusTitle: { fontFamily: fontFamilies.sansSemibold, fontSize: 15 },
  plusSub: { marginTop: 2, opacity: 0.7 },
});
