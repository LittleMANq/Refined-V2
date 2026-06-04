import { I18nManager, Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { typeScale, type TypeVariant } from './typography';

export type TextComponentProps = TextProps & {
  variant?: TypeVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

/**
 * The single text primitive. Pick a variant from the type scale; everything else
 * (font, size, line height, tracking) comes from the system. RTL-aware: text
 * aligns to the start edge (right in Hebrew) unless an explicit align is given.
 */
export function Text({ variant = 'body', color, align, style, ...rest }: TextComponentProps) {
  const base = typeScale[variant];
  const textAlign = align ?? (I18nManager.isRTL ? 'right' : 'left');
  return (
    <RNText
      {...rest}
      style={[
        base,
        { textAlign, writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
        color ? { color } : null,
        style,
      ]}
    />
  );
}

/** Convenience wrappers for the most-used roles. */
export function Label(props: Omit<TextComponentProps, 'variant'>) {
  return <Text variant="label" {...props} />;
}

/** Mono, gold, tracked uppercase. The small label above a heading. */
export function Eyebrow(props: Omit<TextComponentProps, 'variant'>) {
  return <Text variant="eyebrow" {...props} />;
}

/** Serif hero text — reserved for hero moments only (the Style Identity reveal). */
export function SerifHero(props: Omit<TextComponentProps, 'variant'>) {
  return <Text variant="serifHero" {...props} />;
}
