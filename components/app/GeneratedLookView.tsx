import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  Eyebrow,
  fontFamilies,
  GarmentSlot,
  radii,
  shadows,
  spacing,
  Text,
  type SlotTone,
} from '@/components';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import type { GeneratedOutfit } from '@/lib/ai';
import type { Piece } from '@/lib/data';
import { useSignedImageUrls } from '@/lib/hooks';

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
 * Renders a generated look: a 3:4 hero that floats off the page, the pieces it is
 * made of (a horizontal rail), and the focal Hebrew reasoning (the thesis). Screens
 * add their own action footer.
 */
export function GeneratedLookView({ look, pieces, heading, compact }: Props) {
  const { t } = useTranslation();
  const byId = new Map(pieces.map((p) => [p.id, p]));
  const lookPieces = look.piece_ids.map((id) => byId.get(id)).filter((p): p is Piece => !!p);

  // Resolve the look's pieces' images to signed URLs, the exact pattern the closet
  // grid uses. A piece with no image_url (or one not yet resolved) falls back to the
  // toned placeholder, per tile, so an imageless piece never breaks the composition.
  const { data: imageUrls } = useSignedImageUrls(lookPieces.map((p) => p.image_url));
  const pieceUri = (piece: Piece) => (piece.image_url ? imageUrls?.[piece.image_url] : undefined);

  // The hero composes the WHOLE look (a flat-lay of its pieces' catalog images): the
  // main garment (pipeline order puts it first) larger, the rest stacked beside it.
  const heroPieces = lookPieces.slice(0, 4);
  const mainPiece = heroPieces[0];
  const mainUri = mainPiece ? pieceUri(mainPiece) : undefined;
  const supportingPieces = heroPieces.slice(1);

  return (
    <View>
      {/* Hero: the marquee element. Outer view carries the float shadow (no clip),
          inner view clips the slot to the rounded card. */}
      <View style={styles.heroShadow}>
        <View style={styles.heroClip}>
          <View style={styles.hero}>
            {/* The composed look: main garment larger, the rest stacked beside it,
                each tile resolving its own image with a per-tile toned fallback. */}
            <View style={styles.composition}>
              <GarmentSlot
                tone="a"
                radius={radii.md}
                style={styles.mainTile}
                source={mainUri ? { uri: mainUri } : undefined}
              />
              {supportingPieces.length ? (
                <View style={styles.supportCol}>
                  {supportingPieces.map((piece, i) => {
                    const uri = pieceUri(piece);
                    return (
                      <GarmentSlot
                        key={piece.id}
                        tone={PIECE_TONES[(i + 1) % PIECE_TONES.length]}
                        radius={radii.md}
                        style={styles.supportTile}
                        source={uri ? { uri } : undefined}
                      />
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* Scrim under the overlay so the occasion + heading stay readable. */}
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(27,23,20,0)', 'rgba(27,23,20,0.62)']}
              start={{ x: 0, y: 0.45 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {!compact ? (
              <View style={styles.whyPill}>
                <Icon name="sparkle" size={14} color={colors.gold} />
                <Text variant="labelSm" style={styles.whyPillText}>
                  {t.look.whyChip}
                </Text>
              </View>
            ) : null}
            <View style={styles.heroOverlay}>
              {look.occasion ? (
                <Text variant="mono" color={colors.goldSoft} style={styles.occasion}>
                  {look.occasion}
                </Text>
              ) : null}
              {heading ? (
                <Text color={colors.paper} style={styles.heroHeading}>
                  {heading}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      {compact ? (
        <Card padding={spacing.lg} style={styles.compactCard}>
          <View style={styles.whyRow}>
            <Icon name="sparkle" size={15} color={colors.gold} />
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pieceRail}
              >
                {lookPieces.map((piece, i) => {
                  const uri = pieceUri(piece);
                  return (
                  <View key={piece.id} style={styles.pieceItem}>
                    <GarmentSlot
                      tone={PIECE_TONES[i % PIECE_TONES.length]}
                      width={82}
                      radius={radii.md}
                      source={uri ? { uri } : undefined}
                    />
                    <Text variant="labelSm" style={styles.pieceName} numberOfLines={1}>
                      {pieceLabel(piece)}
                    </Text>
                    {piece.color ? (
                      <Text variant="mono" color={colors.secondary} numberOfLines={1} style={styles.pieceSub}>
                        {piece.color}
                      </Text>
                    ) : null}
                  </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Card padding={spacing.lg} style={styles.reasoningCard}>
            <View style={styles.reasoningHead}>
              <View style={styles.reasoningIcon}>
                <Icon name="sparkle" size={16} color={colors.gold} />
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
  heroShadow: { borderRadius: radii.card, backgroundColor: colors.surface, ...shadows.float },
  heroClip: { borderRadius: radii.card, overflow: 'hidden' },
  // The 3:4 hero canvas: a neutral flat-lay surface the piece tiles sit on.
  hero: { width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surface },
  composition: { flex: 1, flexDirection: 'row', padding: spacing.sm, gap: spacing.sm },
  // Main garment: larger, full-height. Supporting pieces: stacked, equal heights.
  mainTile: { flex: 1.5, height: '100%' },
  supportCol: { flex: 1, gap: spacing.sm },
  supportTile: { width: '100%', flex: 1 },
  whyPill: {
    position: 'absolute',
    top: spacing.md,
    insetInlineStart: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 28,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: colors.paper92,
  },
  heroOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingBottom: 18 },
  whyPillText: { fontFamily: fontFamilies.sansSemibold, fontSize: 12 },
  occasion: { marginBottom: 7 },
  heroHeading: { fontFamily: fontFamilies.serifMedium, fontSize: 27, lineHeight: 30 },
  compactCard: { marginTop: spacing.md },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  compactReasoning: { lineHeight: 26 },
  pieces: { marginTop: spacing.g22 },
  piecesLabel: { marginBottom: spacing.g12 },
  pieceRail: { gap: spacing.g11, paddingBottom: 2 },
  pieceItem: { width: 82 },
  pieceName: { marginTop: 7 },
  pieceSub: { marginTop: 1, fontSize: 8.5 },
  reasoningCard: { marginTop: spacing.g22 },
  reasoningHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.g9, marginBottom: spacing.md },
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
