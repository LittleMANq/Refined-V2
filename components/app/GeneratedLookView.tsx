import { StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  Eyebrow,
  GarmentSlot,
  radii,
  spacing,
  Text,
  type SlotTone,
} from '@/components';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import type { GeneratedOutfit } from '@/lib/ai';
import type { Piece } from '@/lib/data';

const PIECE_TONES: SlotTone[] = ['a', 'c', 'b'];

function pieceLabel(piece: Piece): string {
  return piece.type ?? piece.subtype ?? '';
}

type Props = {
  look: GeneratedOutfit;
  /** The full closet, used to resolve the look's piece_ids to real pieces. */
  pieces: Piece[];
  /** Serif heading over the hero (usually the Style Identity name). */
  heading?: string;
  /** Compact = hero + a short reasoning preview (Today). Full = pieces + focal reasoning. */
  compact?: boolean;
};

/**
 * Renders a generated look: a 3:4 hero, the pieces it is made of, and the focal
 * Hebrew reasoning (the thesis). Screens add their own action footer.
 */
export function GeneratedLookView({ look, pieces, heading, compact }: Props) {
  const { t } = useTranslation();
  const byId = new Map(pieces.map((p) => [p.id, p]));
  const lookPieces = look.piece_ids.map((id) => byId.get(id)).filter((p): p is Piece => !!p);

  return (
    <View>
      <View style={styles.hero}>
        <GarmentSlot tone="a" radius={radii.card} scrim style={styles.heroSlot}>
          <View style={styles.heroOverlay}>
            {look.occasion ? (
              <Text variant="mono" color={colors.paper} style={styles.occasion}>
                {look.occasion}
              </Text>
            ) : null}
            {heading ? (
              <Text variant="serifTitle" color={colors.paper}>
                {heading}
              </Text>
            ) : null}
          </View>
        </GarmentSlot>
      </View>

      {compact ? (
        <Card padding={spacing.lg} style={styles.compactCard}>
          <View style={styles.whyRow}>
            <Icon name="star" size={15} color={colors.gold} />
            <Eyebrow>{t.today.whyThis}</Eyebrow>
          </View>
          <Text variant="body" style={styles.compactReasoning} numberOfLines={4}>
            {look.reasoning}
          </Text>
        </Card>
      ) : (
        <>
          {lookPieces.length ? (
            <View style={styles.pieces}>
              <Text variant="label" style={styles.piecesLabel}>
                {t.look.composedPrefix} {lookPieces.length} {t.look.composedSuffix}
              </Text>
              <View style={styles.pieceRow}>
                {lookPieces.map((piece, i) => (
                  <View key={piece.id} style={styles.pieceItem}>
                    <GarmentSlot tone={PIECE_TONES[i % PIECE_TONES.length]} width={78} radius={radii.md} />
                    <Text variant="labelSm" style={styles.pieceName} numberOfLines={1}>
                      {pieceLabel(piece)}
                    </Text>
                    {piece.color ? (
                      <Text variant="mono" color={colors.secondary} numberOfLines={1} style={styles.pieceSub}>
                        {piece.color}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Card padding={spacing.lg} style={styles.reasoningCard}>
            <View style={styles.reasoningHead}>
              <View style={styles.reasoningIcon}>
                <Icon name="star" size={16} color={colors.gold} />
              </View>
              <Eyebrow>{t.look.reasoningTitle}</Eyebrow>
            </View>
            <Text variant="serifTitle" style={styles.reasoning}>
              {look.reasoning}
            </Text>
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radii.card, overflow: 'hidden' },
  heroSlot: { width: '100%', aspectRatio: 3 / 4 },
  heroOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.lg, gap: spacing.xs },
  occasion: { opacity: 0.9 },
  compactCard: { marginTop: spacing.md },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  compactReasoning: { lineHeight: 26 },
  pieces: { marginTop: spacing.xl },
  piecesLabel: { marginBottom: spacing.md },
  pieceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  pieceItem: { width: 78 },
  pieceName: { marginTop: 7 },
  pieceSub: { marginTop: 1, fontSize: 8.5 },
  reasoningCard: { marginTop: spacing.xl },
  reasoningHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  reasoningIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: colors.gold14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasoning: { fontSize: 20, lineHeight: 31 },
});
