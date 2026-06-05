import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '../theme';

/**
 * The single icon primitive: the app's bespoke line set, ported 1:1 from the
 * design gallery (docs/design/app/ui.jsx). Hand-drawn 1.6px strokes, rounded
 * caps/joins, on a 24 grid, so the iconography matches the wordmark's couture
 * line language (NOT an off-the-shelf icon font). Default color is ink; pass gold
 * for accents only. Names include kebab aliases for the glyphs the app already
 * references, each mapped to the right bespoke drawing.
 */
export type IconName =
  | 'back'
  | 'chevron-left'
  | 'chevronLeft'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevronDown'
  | 'camera'
  | 'gallery'
  | 'image'
  | 'check'
  | 'sparkle'
  | 'lock'
  | 'bell'
  | 'sun'
  | 'heart'
  | 'hanger'
  | 'plus'
  | 'plus-square'
  | 'close'
  | 'edit'
  | 'grid'
  | 'chat'
  | 'message-circle'
  | 'send'
  | 'arrow-up'
  | 'arrowLeft'
  | 'mail'
  | 'barcode'
  | 'refresh'
  | 'refresh-cw'
  | 'star'
  | 'swap'
  | 'apple'
  | 'google'
  | 'smartphone'
  | 'globe'
  | 'shopping-bag'
  | 'maximize'
  | 'trash-2'
  | 'user';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const SW = 1.6;

export function Icon({ name, size = 22, color = colors.ink, style }: Props) {
  const s = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth: SW,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {glyph(name, s, color)}
    </Svg>
  );
}

function glyph(name: IconName, s: object, color: string): ReactNode {
  switch (name) {
    // chevrons — `back` / chevron-right point RIGHT (RTL back); chevron-left points LEFT
    case 'back':
    case 'chevron-right':
      return <Path {...s} d="M9 5l7 7-7 7" />;
    case 'chevron-left':
    case 'chevronLeft':
      return <Path {...s} d="M15 5l-7 7 7 7" />;
    case 'chevron-down':
    case 'chevronDown':
      return <Path {...s} d="M6 9l6 6 6-6" />;
    case 'arrowLeft':
      return <Path {...s} d="M19 12H5M11 6l-6 6 6 6" />;

    case 'camera':
      return (
        <G>
          <Path
            {...s}
            d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.2-1.8A1 1 0 0 1 9 4.7h6a1 1 0 0 1 .8.5L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"
          />
          <Circle {...s} cx={12} cy={12.5} r={3.4} />
        </G>
      );
    case 'gallery':
    case 'image':
      return (
        <G>
          <Rect {...s} x={3.5} y={4.5} width={17} height={15} rx={2.5} />
          <Circle {...s} cx={8.5} cy={9.5} r={1.6} />
          <Path {...s} d="M5 17l4.5-4 3 2.6L16 11l3.2 3.4" />
        </G>
      );

    case 'check':
      return <Path {...s} d="M5 12.5l4.5 4.5L19 6.5" />;
    case 'sparkle':
      return <Path {...s} d="M12 3.5l1.7 5.2 5.3 1.6-5.3 1.6L12 17l-1.7-5.1L5 10.3l5.3-1.6z" />;
    case 'star':
      return <Path {...s} d="M12 4.5l2.3 4.7 5.2.6-3.9 3.5 1.1 5.1L12 16.3 7.2 18.5l1.1-5.1L4.5 9.8l5.2-.6z" />;

    case 'lock':
      return (
        <G>
          <Rect {...s} x={5} y={10.5} width={14} height={9.5} rx={2.4} />
          <Path {...s} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </G>
      );
    case 'bell':
      return (
        <G>
          <Path {...s} d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7z" />
          <Path {...s} d="M10 20a2 2 0 0 0 4 0" />
        </G>
      );
    case 'sun':
      return (
        <G>
          <Circle {...s} cx={12} cy={12} r={4} />
          <Path
            {...s}
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
          />
        </G>
      );

    case 'heart':
    case 'user':
      return <Path {...s} d="M12 20s-7-4.7-7-9.6A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7 3.4C19 15.3 12 20 12 20z" />;
    case 'hanger':
      return <Path {...s} d="M12 6.5a2 2 0 1 1 1.6 3.2L4 16.5h16L13 11" />;

    case 'plus':
      return <Path {...s} d="M12 6v12M6 12h12" />;
    case 'plus-square':
      return (
        <G>
          <Rect {...s} x={4} y={4} width={16} height={16} rx={4} />
          <Path {...s} d="M12 9v6M9 12h6" />
        </G>
      );
    case 'close':
      return <Path {...s} d="M6 6l12 12M18 6L6 18" />;
    case 'edit':
      return (
        <G>
          <Path {...s} d="M5 19h3l9-9-3-3-9 9z" />
          <Path {...s} d="M14 6l3 3" />
        </G>
      );
    case 'grid':
      return (
        <G>
          <Rect {...s} x={4} y={4} width={7} height={7} rx={1.5} />
          <Rect {...s} x={13} y={4} width={7} height={7} rx={1.5} />
          <Rect {...s} x={4} y={13} width={7} height={7} rx={1.5} />
          <Rect {...s} x={13} y={13} width={7} height={7} rx={1.5} />
        </G>
      );

    case 'chat':
    case 'message-circle':
      return (
        <Path
          {...s}
          d="M20 13.5A2.5 2.5 0 0 1 17.5 16H10l-4.5 3.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z"
        />
      );
    case 'send':
    case 'arrow-up':
      return <Path {...s} d="M20 4L4 11l6 2.5L13 20l3-9z" />;
    case 'mail':
      return (
        <G>
          <Rect {...s} x={3.5} y={5.5} width={17} height={13} rx={2.5} />
          <Path {...s} d="M4.5 7.5l7.5 5.5 7.5-5.5" />
        </G>
      );
    case 'barcode':
      return <Path {...s} d="M4.5 6v12M7.5 6v12M10 6v12M13 6v12M15.5 6v12M19.5 6v12" />;
    case 'refresh':
    case 'refresh-cw':
      return (
        <G>
          <Path {...s} d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L20 9" />
          <Path {...s} d="M20 4v5h-5" />
          <Path {...s} d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4 15" />
          <Path {...s} d="M4 20v-5h5" />
        </G>
      );
    case 'swap':
      return <Path {...s} d="M7 8h11l-3-3M17 16H6l3 3" />;

    case 'smartphone':
      return (
        <G>
          <Rect {...s} x={7} y={3.5} width={10} height={17} rx={2.5} />
          <Path {...s} d="M11 17.5h2" />
        </G>
      );
    case 'globe':
      return (
        <G>
          <Circle {...s} cx={12} cy={12} r={8} />
          <Path {...s} d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" />
        </G>
      );
    case 'shopping-bag':
      return (
        <G>
          <Path {...s} d="M6 8h12l-1 12H7z" />
          <Path {...s} d="M9 8a3 3 0 0 1 6 0" />
        </G>
      );
    case 'maximize':
      return (
        <Path {...s} d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
      );
    case 'trash-2':
      return (
        <G>
          <Path {...s} d="M5 7h14M10 7V5.5a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 5.5V7" />
          <Path {...s} d="M6.5 7l.8 12a1.2 1.2 0 0 0 1.2 1.1h7a1.2 1.2 0 0 0 1.2-1.1l.8-12" />
          <Path {...s} d="M10 11v6M14 11v6" />
        </G>
      );

    // brand marks — filled, follow the icon color
    case 'apple':
      return (
        <Path
          fill={color}
          d="M16.7 12.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.4 2.5-.4 6.2 1 8.2.7 1 1.4 2.1 2.5 2.1 1-.1 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.6 1.1 0 1.8-1 2.4-2.1.8-1.1 1.1-2.3 1.1-2.3s-2.1-.8-2.1-3.1zM14.8 6.5c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.1z"
        />
      );
    case 'google':
      return (
        <G fill={color}>
          <Path opacity={0.9} d="M21 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-6.9z" />
          <Path opacity={0.6} d="M12 21c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.6-2 .9-2.9.9-2.3 0-4.2-1.5-4.9-3.6H3.9v2.4A9 9 0 0 0 12 21z" />
          <Path opacity={0.4} d="M7.1 13.7a5.4 5.4 0 0 1 0-3.4V7.9H3.9a9 9 0 0 0 0 8.1z" />
          <Path opacity={0.75} d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 3.9 7.9l3.2 2.4C7.8 8.1 9.7 6.6 12 6.6z" />
        </G>
      );

    default:
      return null;
  }
}
