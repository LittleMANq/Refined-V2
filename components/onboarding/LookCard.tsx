import { StyleSheet, View } from 'react-native';

import { Card } from '../Card';
import { GarmentSlot } from '../GarmentSlot';
import { Text } from '../Text';
import { colors, radii, spacing, type SlotTone } from '../theme';

type Props = {
  /** Mono caption, e.g. "לוק 01". */
  caption: string;
  title: string;
  why: string;
  tone?: SlotTone;
};

/** A first-look row: a 3:4 slot, the look number, its title, and the short why. */
export function LookCard({ caption, title, why, tone = 'a' }: Props) {
  return (
    <Card padding={spacing.md} style={styles.card}>
      <GarmentSlot tone={tone} width={80} radius={radii.md} />
      <View style={styles.body}>
        <Text variant="mono" color={colors.gold} style={styles.caption}>
          {caption}
        </Text>
        <Text variant="label" style={styles.title}>
          {title}
        </Text>
        <Text variant="subtitle" style={styles.why}>
          {why}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  body: {
    flex: 1,
  },
  caption: {
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
  },
  why: {
    fontSize: 14,
    marginTop: 3,
  },
});
