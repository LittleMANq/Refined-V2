import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  GarmentSlot,
  PillButton,
  radii,
  Reveal,
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
      footer={
        <View style={styles.footer}>
          <PillButton label={p.enable} onPress={enable} />
          <PillButton variant="ghost" label={p.notNow} onPress={land} />
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
          <Card padding={spacing.md}>
            <View style={styles.notifHead}>
              <View style={styles.notifIcon}>
                <Icon name="sun" size={17} color={colors.gold} />
              </View>
              <Text variant="mono" color={colors.secondary}>
                {p.notifBrand}
              </Text>
              <Text variant="mono" color={colors.secondary} style={styles.notifNow}>
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
        <Text variant="head" align="center">
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
  previewStage: { height: 230, marginTop: spacing.md },
  behind: { position: 'absolute', top: 110, left: 28, right: 28 },
  behindCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  behindText: { flex: 1 },
  behindDetail: { marginTop: 3 },
  front: { position: 'absolute', top: 10, left: 6, right: 6 },
  notifHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  notifIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifNow: { marginInlineStart: 'auto' },
  notifTitle: { marginBottom: 3 },
  notifBody: { fontSize: 13.5 },
  copy: { alignItems: 'center', paddingTop: spacing.xl },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.gold14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subtitle: { marginTop: spacing.md, maxWidth: 300 },
  footer: { gap: spacing.md },
});
