import { StyleSheet, View, type ViewStyle } from 'react-native';

import { paletteSwatch } from '@/lib/onboarding/colors';

import { Text } from '../Text';
import { colors, radii, shadows } from '../theme';

type Props = {
  /** Color NAMES from the analysis (e.g. ['חול','טאופ','קוניאק']). */
  palette: string[];
  /** Show the color names beneath the strip. */
  showNames?: boolean;
  height?: number;
  style?: ViewStyle;
};

/**
 * The personal color palette as a joined strip of swatches. Known warm-neutral
 * names render as a real swatch; an unknown name falls back to a surface block
 * showing the name, never a guessed color.
 */
export function PaletteStrip({ palette, showNames, height = 60, style }: Props) {
  const items = palette.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <View style={style}>
      <View style={styles.strip}>
        {items.map((name, i) => {
          const hex = paletteSwatch(name);
          return (
            <View key={`${name}-${i}`} style={styles.cell}>
              {hex ? (
                <View style={{ height, backgroundColor: hex }} />
              ) : (
                <View style={[styles.fallback, { height }]}>
                  <Text variant="labelSm" color={colors.secondary} align="center" numberOfLines={1}>
                    {name}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
      {showNames ? (
        <View style={styles.names}>
          {items.map((name, i) => (
            <Text
              key={`n-${name}-${i}`}
              variant="mono"
              color={colors.secondary}
              align="center"
              numberOfLines={1}
              style={styles.name}
            >
              {name}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cell: {
    flex: 1,
  },
  fallback: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  names: {
    flexDirection: 'row',
    marginTop: 9,
  },
  name: {
    flex: 1,
    fontSize: 8.5,
  },
});
