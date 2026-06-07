import { Image, ScrollView, StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  Eyebrow,
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
import { pieceCategory, type ClosetCategory } from '@/lib/closet';
import type { Piece } from '@/lib/data';
import { useSignedImageUrls } from '@/lib/hooks';

const PIECE_TONES: SlotTone[] = ['a', 'c', 'b'];

// Worn-order rows for the flat-lay hero (top to bottom). Outerwear groups under
// 'tops', so a top and a jacket sit side by side, the way a look is laid out.
const HERO_ROWS: { key: string; cats: ClosetCategory[]; flex: number }[] = [
  { key: 'accessory', cats: ['accessories'], flex: 0.85 },
  { key: 'top', cats: ['tops', 'dresses', 'other'], flex: 1.7 },
  { key: 'bottom', cats: ['bottoms'], flex: 1.25 },
  { key: 'shoes', cats: ['shoes'], flex: 0.95 },
];

function pieceLabel(piece: Piece): string {
  return piece.type ?? piece.subtype ?? '';
}

type Props = {
  look: GeneratedOutfit;
  /** The full closet, used to resolve the look's piece_ids to real pieces. */
  pieces: Piece[];
  /** Reserved; not rendered on the clean flat-lay hero (identity shows in the topbar). */
  heading?: string;
  /** Compact = hero + a short reasoning preview (Today). Full = pieces + focal reasoning. */
  compact?: boolean;
};

/**
 * Renders a generated look: a 3:4 hero that lays the whole outfit out as a flat-lay
 * (its real garment images, in worn order, on the neutral background), the pieces it
 * is made of (a horizontal rail), and the focal Hebrew reasoning. Screens add their
 * own action footer.
 */
export function GeneratedLookView({ look, pieces, compact }: Props) {
  const { t } = useTranslation();
  const byId = new Map(pieces.map((p) => [p.id, p]));
  const lookPieces = look.piece_ids.map((id) => byId.get(id)).filter((p): p is Piece => !!p);

  // Resolve the look's pieces' images to signed URLs, the exact pattern the closet
  // grid uses. A piece with no image_url (or one not yet resolved) falls back to the
  // toned placeholder, per tile, so an imageless piece never breaks the layout.
  const { data: imageUrls } = useSignedImageUrls(lookPieces.map((p) => p.image_url));
  const pieceUri = (piece: Piece) => (piece.image_url ? imageUrls?.[piece.image_url] : undefined);

  // Group the look's pieces into worn-order rows for the flat-lay (accessories on
  // top, tops/outerwear, bottoms, shoes). Empty rows drop out.
  const rows = HERO_ROWS.map((r) => ({
    ...r,
    items: lookPieces.filter((p) => r.cats.includes(pieceCategory(p))),
  })).filter((r) => r.items.length > 0);
  const heroRows: { key: string; flex: number; items: Piece[] }[] = rows.length
    ? rows
    : [{ key: 'empty', flex: 1, items: [] }];

  return (
    <View>
      {/* Hero: the whole look as a flat-lay. Outer view carries the float shadow
          (no clip), inner view clips to the rounded card, the canvas lays the
          garments out on the neutral background. */}
      <View style={styles.heroShadow}>
        <View style={styles.heroClip}>
          <View style={styles.hero}>
            {heroRows.map((row) => (
              <View key={row.key} style={[styles.flatRow, { flex: row.flex }]}>
                {row.items.length ? (
                  row.items.map((piece) => {
                    const uri = pieceUri(piece);
                    return (
                      <View key={piece.id} style={styles.flatCell}>
                        {uri ? (
                          <Image source={{ uri }} resizeMode="contain" style={styles.flatImg} />
                        ) : (
                          <GarmentSlot tone="a" radius={radii.md} style={styles.flatFallback} />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.flatCell}>
                    <GarmentSlot tone="a" radius={radii.md} style={styles.flatFallback} />
                  </View>
                )}
              </View>
            ))}
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
  // The 3:4 hero canvas: a neutral flat-lay surface the garments lay out on, in
  // worn-order rows top to bottom.
  hero: { width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surface, padding: spacing.md, gap: spacing.xs },
  flatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  flatCell: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  // Whole garment, shown in full (contain) so it reads as a laid-out piece, not a crop.
  flatImg: { width: '100%', height: '100%' },
  flatFallback: { width: '60%' },
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
