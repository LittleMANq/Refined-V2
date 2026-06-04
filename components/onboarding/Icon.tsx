import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { colors } from '../theme';

export type IconName = ComponentProps<typeof Feather>['name'];

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/**
 * The single icon primitive. Feather's thin, even strokes match the Refined line
 * aesthetic. Default color is ink; pass gold for accents only. Centralized so the
 * icon set and defaults stay consistent across screens.
 */
export function Icon({ name, size = 22, color = colors.ink, style }: Props) {
  return <Feather name={name} size={size} color={color} style={style} />;
}
