import { StyleSheet, View } from 'react-native';

import {
  colors,
  Eyebrow,
  GarmentSlot,
  PillButton,
  radii,
  Reveal,
  spacing,
  Text,
} from '@/components';
import { Icon, Sweep, type IconName } from '@/components/onboarding';

/**
 * The shared "composing a look" loading moment: a small ink slot with the gold
 * sweep (same language as the onboarding analysis), and a calm message. Used by
 * Today and Create while generate-outfit runs.
 */
export function LookLoading({ message }: { message: string }) {
  return (
    <View style={styles.loading}>
      <View style={styles.loadingSlot}>
        <GarmentSlot tone="ink" radius={radii.lg} style={styles.fill} />
        <Sweep />
      </View>
      <Text variant="subtitle" align="center" style={styles.loadingText}>
        {message}
      </Text>
    </View>
  );
}

/**
 * A centered info state for inline error / need-more-pieces / empty moments, with
 * an optional gold icon and a single CTA. Matches the designed calm states.
 */
export function InfoState({
  icon,
  eyebrow,
  title,
  body,
  ctaLabel,
  onCta,
}: {
  icon?: IconName;
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <Reveal fromScale={0.94} style={styles.info}>
      {icon ? (
        <View style={styles.infoIcon}>
          <Icon name={icon} size={24} color={colors.gold} />
        </View>
      ) : null}
      {eyebrow ? <Eyebrow align="center" style={styles.infoEyebrow}>{eyebrow}</Eyebrow> : null}
      <Text variant="serifXl" align="center">
        {title}
      </Text>
      {body ? (
        <Text variant="subtitle" align="center" style={styles.infoBody}>
          {body}
        </Text>
      ) : null}
      {ctaLabel && onCta ? (
        <View style={styles.infoCta}>
          <PillButton label={ctaLabel} onPress={onCta} />
        </View>
      ) : null}
    </Reveal>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', paddingVertical: spacing.xxl },
  loadingSlot: {
    width: 150,
    aspectRatio: 3 / 4,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  fill: { width: '100%', height: '100%', aspectRatio: undefined },
  loadingText: { maxWidth: 280 },
  info: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.gold14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  infoEyebrow: { marginBottom: spacing.md },
  infoBody: { marginTop: spacing.md, maxWidth: 300 },
  infoCta: { marginTop: spacing.xl, alignSelf: 'stretch' },
});
