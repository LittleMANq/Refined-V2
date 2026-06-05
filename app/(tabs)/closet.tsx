import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, colors, GarmentSlot, radii, spacing, Text, Wordmark, type SlotTone } from '@/components';
import { InfoState } from '@/components/app';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { pieceCategory, type ClosetCategory } from '@/lib/closet';
import { usePieces, useSignedImageUrls } from '@/lib/hooks';

// Placeholder tone cycle, mirrors the gallery's closet grid (a, c, b repeating).
const TONES: SlotTone[] = ['a', 'c', 'b'];
type Filter = 'all' | ClosetCategory;

export default function ClosetScreen() {
  const { t } = useTranslation();
  const c = t.closet;
  const { data: pieces, isLoading } = usePieces();
  const { data: imageUrls } = useSignedImageUrls((pieces ?? []).map((p) => p.image_url));
  const [filter, setFilter] = useState<Filter>('all');
  const { width } = useWindowDimensions();
  // Two equal columns with one gutter-sized gap between them, mirroring the gallery's
  // `grid-template-columns: 1fr 1fr; gap: 14`. Every slot is the same width, so a lone
  // trailing item never stretches to full width.
  const cellW = (width - spacing.gutter * 2 - spacing.md) / 2;

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: c.filterAll },
    { id: 'tops', label: c.filterTops },
    { id: 'bottoms', label: c.filterBottoms },
    { id: 'dresses', label: c.filterDresses },
    { id: 'shoes', label: c.filterShoes },
    { id: 'accessories', label: c.filterAccessories },
  ];

  if (isLoading || !pieces) {
    return (
      <View style={styles.center}>
        <Wordmark size={22} />
      </View>
    );
  }

  if (pieces.length === 0) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <Text variant="title">{c.title}</Text>
          <Text variant="label" color={colors.secondary}>
            0 {t.common.pieces}
          </Text>
        </View>
        <View style={styles.emptyWrap}>
          <InfoState
            icon="plus"
            eyebrow={c.emptyEyebrow}
            title={c.emptyTitle}
            body={c.emptyBody}
            ctaLabel={c.emptyCta}
            onCta={() => router.push('/closet-add')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const shown = filter === 'all' ? pieces : pieces.filter((p) => pieceCategory(p) === filter);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text variant="title">{c.title}</Text>
        <Pressable style={styles.addBtn} onPress={() => router.push('/closet-add')}>
          <Icon name="plus" size={16} color={colors.gold} />
          <Text variant="label">{c.add}</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersRow}
      >
        {filters.map((f) => (
          <Chip key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {shown.map((piece, i) => {
          const uri = piece.image_url ? imageUrls?.[piece.image_url] : undefined;
          return (
            <Pressable key={piece.id} style={{ width: cellW }} onPress={() => router.push(`/piece/${piece.id}`)}>
              <GarmentSlot
                tone={TONES[i % TONES.length]}
                radius={radii.slotSm}
                source={uri ? { uri } : undefined}
              />
              <Text variant="label" style={styles.cellTitle} numberOfLines={1}>
                {piece.type ?? t.piece.unnamed}
              </Text>
              {piece.color ? (
                <Text variant="labelSm" color={colors.secondary} numberOfLines={1} style={styles.cellSub}>
                  {piece.color}
                </Text>
              ) : !piece.type ? (
                <Text variant="labelSm" color={colors.gold} numberOfLines={1} style={styles.cellSub}>
                  {c.needsDetails}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.g26,
    paddingBottom: 0,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filtersRow: { flexGrow: 0 },
  filters: { paddingHorizontal: spacing.gutter, gap: spacing.g9, paddingVertical: spacing.g16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  cellTitle: { marginTop: spacing.sm },
  cellSub: { marginTop: 2 },
  emptyWrap: { flex: 1, justifyContent: 'center' },
});
