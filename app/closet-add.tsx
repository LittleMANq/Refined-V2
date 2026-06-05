import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, colors, Eyebrow, GarmentSlot, radii, spacing, Text } from '@/components';
import { InfoState, LookLoading } from '@/components/app';
import { Icon, type IconName } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { tagGarment } from '@/lib/analysis';
import { looksUnlocked } from '@/lib/closet';
import { insertPiece, supabase, updatePiece, type Piece } from '@/lib/data';
import { useCurrentUser, usePieces, useProfile, queryKeys } from '@/lib/hooks';
import { base64ToBytes } from '@/lib/onboarding/base64';

/** A piece moving through the post-add tagging phase (per-item working state). */
type TagItem = { id: string; uri: string; working: boolean; ok: boolean; label: string | null };

/** Up to this many library photos can be added in a single pass (frictionless ramp). */
const MULTI_SELECT_LIMIT = 10;

function MethodCard({
  icon,
  label,
  sub,
  locked,
  soon,
  onPress,
}: {
  icon: IconName;
  label: string;
  sub: string;
  locked?: boolean;
  soon?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.method} onPress={locked ? undefined : onPress} disabled={locked}>
      <Card padding={spacing.md} style={[styles.methodCard, locked && styles.methodLocked]}>
        <View style={styles.methodIcon}>
          <Icon name={icon} size={21} color={colors.gold} />
        </View>
        <View style={styles.methodHead}>
          <Text variant="label">{label}</Text>
          {locked && soon ? (
            <View style={styles.soon}>
              <Text variant="mono" color={colors.gold}>
                {soon}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="labelSm" color={colors.secondary} style={styles.methodSub}>
          {sub}
        </Text>
      </Card>
    </Pressable>
  );
}

export default function ClosetAddScreen() {
  const { t } = useTranslation();
  const a = t.addPiece;
  const { data: user } = useCurrentUser();
  const { data: pieces } = usePieces();
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  // The per-piece auto-tagging phase (so multi-add never looks frozen). Null when idle.
  const [tagging, setTagging] = useState<TagItem[] | null>(null);
  // The earned outcome of the last add: how many pieces went in and how many real
  // new looks they unlocked (computed from the actual closet, never inflated).
  const [result, setResult] = useState<{ added: number; looks: number } | null>(null);

  const tagGender = profile?.gender ?? 'unspecified';

  const addFrom = async (source: 'camera' | 'gallery') => {
    if (!user) return;
    const perm =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const res =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7, mediaTypes: ['images'] })
        : await ImagePicker.launchImageLibraryAsync({
            base64: true,
            quality: 0.7,
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: MULTI_SELECT_LIMIT,
          });
    if (res.canceled || !res.assets.length) return;

    const before = pieces ?? [];

    // 1) Upload + insert each piece UNTAGGED first (fast). The piece exists in the
    //    closet immediately, value-before-effort, and never depends on tagging.
    setBusy(true);
    const added: { piece: Piece; uri: string; base64?: string }[] = [];
    try {
      for (const asset of res.assets) {
        let imagePath: string | null = null;
        if (asset.base64) {
          const path = `${user.id}/pieces/${Date.now()}-${added.length}.jpg`;
          try {
            const { error } = await supabase.storage
              .from('photos')
              .upload(path, base64ToBytes(asset.base64), {
                contentType: asset.mimeType ?? 'image/jpeg',
                upsert: true,
              });
            if (!error) imagePath = path;
          } catch {
            // non-fatal: keep the piece without a stored image
          }
        }
        const piece = await insertPiece({ user_id: user.id, source: 'photo_library', image_url: imagePath });
        added.push({ piece, uri: asset.uri, base64: asset.base64 ?? undefined });
      }
      qc.invalidateQueries({ queryKey: queryKeys.pieces });
    } finally {
      setBusy(false);
    }

    // 2) Auto-tag each piece (server-side vision), with a per-item working state.
    //    A tag failure is non-fatal: the piece stays saved as a "needs details" item.
    setTagging(added.map(({ piece, uri }) => ({ id: piece.id, uri, working: true, ok: false, label: null })));
    const settle = (id: string, patch: Partial<TagItem>) =>
      setTagging((prev) => prev && prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

    const finalPieces = await Promise.all(
      added.map(async ({ piece, base64 }) => {
        if (!base64) {
          settle(piece.id, { working: false, ok: false, label: a.tagFailedShort });
          return piece;
        }
        try {
          const tag = await tagGarment({ photo: { base64, mediaType: 'image/jpeg' }, context: { gender: tagGender } });
          const updated = await updatePiece(piece.id, {
            type: tag.type,
            subtype: tag.subtype ?? null,
            color: tag.color ?? null,
            pattern: tag.pattern ?? null,
            attributes: tag.attributes ?? null,
          });
          settle(piece.id, {
            working: false,
            ok: true,
            label: [updated.type, updated.color].filter(Boolean).join(' '),
          });
          return updated;
        } catch {
          settle(piece.id, { working: false, ok: false, label: a.tagFailedShort });
          return piece; // graceful: stays untagged → "needs details"
        }
      }),
    );

    qc.invalidateQueries({ queryKey: queryKeys.pieces });
    // The real unlock, computed from the post-tag pieces (honest, never inflated).
    const looks = looksUnlocked(before, [...before, ...finalPieces]);
    setTagging(null);
    setResult({ added: finalPieces.length, looks });
  };

  // Build the celebratory, honest unlock line from the real counts.
  let unlockTitle = a.unlockNoneTitle;
  let unlockBody = a.unlockNoneBody;
  if (result && result.looks > 0) {
    const piecesPart = result.added === 1 ? a.unlockOnePiece : a.unlockManyPieces;
    const looksPart =
      result.looks === 1 ? a.unlockLooksOne : `${result.looks} ${a.unlockLooksManySuffix}`;
    unlockTitle = `${piecesPart} ${looksPart}`;
    unlockBody = a.unlockBody;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.handle} />
      {result ? (
        <View style={styles.body}>
          <InfoState
            icon={result.looks > 0 ? 'star' : 'check'}
            eyebrow={a.unlockEyebrow}
            title={unlockTitle}
            body={unlockBody}
            ctaLabel={a.unlockCta}
            onCta={() => router.back()}
          />
          <Pressable onPress={() => setResult(null)} hitSlop={8} style={styles.addMore}>
            <Icon name="plus" size={16} color={colors.gold} />
            <Text variant="label" color={colors.gold}>
              {a.addMore}
            </Text>
          </Pressable>
        </View>
      ) : tagging ? (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Eyebrow style={styles.eyebrow}>{a.unlockEyebrow}</Eyebrow>
          <Text variant="head" style={styles.title}>
            {a.tagging}
          </Text>
          <View style={styles.tagGrid}>
            {tagging.map((it) => (
              <View key={it.id} style={styles.tagCell}>
                <GarmentSlot
                  tone="a"
                  radius={radii.md}
                  source={{ uri: it.uri }}
                  loading={it.working}
                />
                <Text
                  variant="labelSm"
                  color={it.ok ? colors.ink : colors.gold}
                  numberOfLines={1}
                  style={styles.tagSub}
                >
                  {it.label ?? ' '}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : busy ? (
        <LookLoading message={a.saving} />
      ) : (
        <View style={styles.body}>
          <Eyebrow style={styles.eyebrow}>{a.eyebrow}</Eyebrow>
          <Text variant="head" style={styles.title}>
            {a.title}
          </Text>
          <Text variant="subtitle" style={styles.subtitle}>
            {a.body}
          </Text>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <MethodCard icon="camera" label={a.camera} sub={a.cameraSub} onPress={() => addFrom('camera')} />
            </View>
            <View style={styles.cell}>
              <MethodCard icon="image" label={a.gallery} sub={a.gallerySub} onPress={() => addFrom('gallery')} />
            </View>
            <View style={styles.cell}>
              <MethodCard icon="mail" label={a.gmail} sub={a.gmailSub} locked soon={a.soon} />
            </View>
            <View style={styles.cell}>
              <MethodCard icon="maximize" label={a.barcode} sub={a.barcodeSub} locked soon={a.soon} />
            </View>
          </View>

          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.cancel}>
            <Text variant="label" color={colors.secondary}>
              {a.cancel}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  handle: { width: 38, height: 4, borderRadius: 999, backgroundColor: colors.hairline, alignSelf: 'center', marginTop: spacing.md, marginBottom: spacing.lg },
  body: { paddingHorizontal: spacing.gutter },
  eyebrow: { marginBottom: spacing.sm },
  title: { fontSize: 26 },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { width: '47%', flexGrow: 1 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  tagCell: { width: '30%', flexGrow: 1 },
  tagSub: { marginTop: spacing.xs },
  method: {},
  methodCard: { minHeight: 118 },
  methodLocked: { opacity: 0.55 },
  methodIcon: { width: 42, height: 42, borderRadius: radii.md, backgroundColor: colors.gold14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  methodHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  soon: { backgroundColor: colors.gold14, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  methodSub: { marginTop: 3 },
  addMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm, padding: spacing.sm },
  cancel: { alignSelf: 'center', marginTop: spacing.lg, padding: spacing.sm },
});
