import { StyleSheet, View } from 'react-native';

import { Card, colors, radii, spacing, Text } from '@/components';
import { Icon, type IconName } from '@/components/onboarding';

type Props = {
  icon: IconName;
  title: string;
  body: string;
  /** The "coming soon" badge label (e.g. "בקרוב"). */
  soon: string;
};

/**
 * A calm, premium "coming soon" teaser for a scaffolded feature: a gold-tinted
 * icon tile, the feature name with a soft "בקרוב" badge, and a one-line promise.
 * Intentionally NOT interactive, it previews and builds anticipation, it does not
 * pretend to work. Pure design-system tokens (one accent, soft card), RTL-correct.
 */
export function LockedTeaser({ icon, title, body, soon }: Props) {
  return (
    <Card padding={spacing.g16} style={styles.card}>
      <View style={styles.iconTile}>
        <Icon name={icon} size={20} color={colors.gold} />
      </View>
      <View style={styles.body}>
        <View style={styles.head}>
          <Text variant="label">{title}</Text>
          <View style={styles.soon}>
            <Text variant="mono" color={colors.gold} style={styles.soonText}>
              {soon}
            </Text>
          </View>
        </View>
        <Text variant="labelSm" color={colors.secondary} style={styles.sub}>
          {body}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: radii.r12,
    backgroundColor: colors.gold14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  soon: { backgroundColor: colors.gold14, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  soonText: { fontSize: 9.5 },
  sub: { marginTop: 3 },
});
