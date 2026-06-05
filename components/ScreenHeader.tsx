import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Eyebrow, Text } from './Text';
import { spacing } from './theme';
import type { TypeVariant } from './typography';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Heading size. Defaults to `head`; use `serifXl`/`serifHero` for hero screens. */
  titleVariant?: Extract<TypeVariant, 'head' | 'title' | 'serifXl' | 'serifHero'>;
  /** Exact px override for the heading (the gallery sizes `head` per screen, e.g. 28/29/30). Line height scales with it. */
  titleSize?: number;
  style?: ViewStyle;
};

/** The recurring screen intro: gold eyebrow, heading, quiet subtitle. RTL-aligned. */
export function ScreenHeader({ eyebrow, title, subtitle, titleVariant = 'head', titleSize, style }: Props) {
  return (
    <View style={style}>
      {eyebrow ? <Eyebrow style={styles.eyebrow}>{eyebrow}</Eyebrow> : null}
      <Text
        variant={titleVariant}
        style={titleSize ? { fontSize: titleSize, lineHeight: Math.round(titleSize * 1.18) } : undefined}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text variant="subtitle" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});
