import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  fontFamilies,
  GarmentSlot,
  PillButton,
  radii,
  Reveal,
  shadows,
  spacing,
  Text,
} from '@/components';
import { Icon, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ROUTES } from '@/lib/onboarding';

export default function PermissionsScreen() {
  const { t } = useTranslation();
  const p = t.onboarding.permissions;

  const land = () => router.replace(ROUTES.today);

  const enable = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {
      // best-effort: a denied or unavailable permission never blocks landing
    }
    land();
  };

  return (
    <StepScreen
      onBack={() => router.back()}
      bodyPaddingTop={spacing.sm}
      footer={
        <View style={styles.footer}>
          <PillButton label={p.enable} onPress={enable} />
          <Pressable onPress={land} hitSlop={8} style={styles.notNow}>
            <Text variant="btnText" color={colors.secondary}>
              {p.notNow}
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.previewStage}>
        {/* supporting look card behind */}
        <Reveal delay={400} style={styles.behind}>
          <Card padding={spacing.sm} style={styles.behindCard}>
            <GarmentSlot tone="a" width={48} radius={radii.sm} />
            <View style={styles.behindText}>
              <Text variant="mono" color={colors.gold}>
                {p.dailyLook}
              </Text>
              <Text variant="labelSm" style={styles.behindDetail}>
                {p.dailyLookDetail}
              </Text>
            </View>
            <Icon name="chevron-left" size={16} color={colors.secondary} />
          </Card>
        </Reveal>

        {/* the notification itself */}
        <Reveal delay={200} style={styles.front}>
          <Card padding={spacing.md} style={shadows.float}>
            <View style={styles.notifHead}>
              <View style={styles.notifIcon}>
                <Icon name="sun" size={17} color={colors.gold} />
              </View>
              <Text variant="monoSm" color={colors.secondary}>
                {p.notifBrand}
              </Text>
              <Text variant="monoSm" color={colors.secondary} style={styles.notifNow}>
                {p.notifNow}
              </Text>
            </View>
            <Text variant="label" style={styles.notifTitle}>
              {p.notifTitle}
            </Text>
            <Text variant="subtitle" style={styles.notifBody}>
              {p.notifBody}
            </Text>
          </Card>
        </Reveal>
      </View>

      <View style={styles.copy}>
        <View style={styles.bell}>
          <Icon name="bell" size={24} color={colors.gold} />
        </View>
        <Text variant="head" align="center" style={styles.title}>
          {p.title}
        </Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          {p.subtitle}
        </Text>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  previewStage: { height: 244, marginTop: spacing.md, marginBottom: spacing.xs },
  behind: { position: 'absolute', top: 118, left: 34, right: 34 },
  behindCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.g11 },
  behindText: { flex: 1 },
  behindDetail: { marginTop: 3 },
  front: { position: 'absolute', top: 14, left: 10, right: 10 },
  notifHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.g9 },
  notifIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifNow: { marginInlineStart: 'auto' },
  notifTitle: { fontFamily: fontFamilies.sansSemibold, fontSize: 14.5, marginBottom: 3 },
  notifBody: { fontSize: 13, lineHeight: 19 },
  title: { fontSize: 29, lineHeight: 35 },
  copy: { alignItems: 'center', paddingTop: spacing.sm },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.gold14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subtitle: { marginTop: spacing.g12, maxWidth: 290 },
  footer: { gap: spacing.md },
  notNow: { alignSelf: 'center', paddingVertical: spacing.sm },
});
