import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, colors, Eyebrow, GarmentSlot, PillButton, radii, spacing, Text, type SlotTone } from '@/components';
import { InfoState, LookLoading } from '@/components/app';
import { Icon, type IconName } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { cropGarmentImage, detectGarments, produceGarmentImage, type DetectedGarment } from '@/lib/analysis';
import { looksUnlocked } from '@/lib/closet';
import { insertPiece, supabase, type Piece } from '@/lib/data';
import { useCurrentUser, usePieces, useProfile, queryKeys } from '@/lib/hooks';
import { base64ToBytes } from '@/lib/onboarding/base64';

/** The picked photo we detect garments in (uri for preview, base64 to crop from). */
type Source = { uri: string; base64?: string; mediaType: string };
type Phase = 'choose' | 'detecting' | 'pick' | 'saving' | 'done';
const TONES: SlotTone[] = ['a', 'c', 'b'];
const UPLOAD_EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

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
      <Card padding={spacing.g16} style={[styles.methodCard, locked && styles.methodLocked]}>
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

function garmentDetail(g: DetectedGarment): string {
  return [g.color, g.pattern].filter(Boolean).join(' · ');
}

export default function ClosetAddScreen() {
  const { t } = useTranslation();
  const a = t.addPiece;
  const { data: user } = useCurrentUser();
  const { data: pieces } = usePieces();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  const [phase, setPhase] = useState<Phase>('choose');
  const [detected, setDetected] = useState<{ source: Source; garments: DetectedGarment[] } | null>(null);
  // Preview thumbnails for the pick cards: the source photo cropped to each garment's
  // region, keyed by garment index. Populated progressively; a missing entry keeps the
  // card on its toned placeholder. This is NOT the catalog image (still generated post-pick).
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  // The earned outcome of the last add (real new looks unlocked; never inflated).
  // `needsDetails` marks the graceful fallback where nothing was detected.
  const [result, setResult] = useState<{ added: number; looks: number; needsDetails: boolean } | null>(null);

  const gender = profile?.gender ?? 'unspecified';

  // At pick time, fill each card with a recognizable preview: the source photo cropped
  // to that garment's detected region (cheap server-side crop, no AI, no key). The
  // expensive catalog image is still generated only for picked items after confirm.
  // Best-effort and progressive: a failed or region-less crop leaves the toned slot.
  useEffect(() => {
    if (!detected) return;
    const { source, garments } = detected;
    const base64 = source.base64;
    if (!base64) return;
    let alive = true;
    garments.forEach((g, i) => {
      if (!g.bounding_region) return;
      cropGarmentImage({
        source: { base64, mediaType: source.mediaType },
        region: g.bounding_region,
      })
        .then((res) => {
          if (alive) setThumbs((prev) => ({ ...prev, [i]: `data:${res.mediaType};base64,${res.base64}` }));
        })
        .catch(() => {
          // non-fatal: the card keeps its toned placeholder
        });
    });
    return () => {
      alive = false;
    };
  }, [detected]);

  /** Upload bytes to the user's private pieces folder. Returns the path, or null. */
  const upload = async (b64: string, suffix: string, contentType = 'image/jpeg'): Promise<string | null> => {
    const ext = UPLOAD_EXT[contentType] ?? 'jpg';
    const path = `${user!.id}/pieces/${Date.now()}-${suffix}.${ext}`;
    try {
      const { error } = await supabase.storage
        .from('photos')
        .upload(path, base64ToBytes(b64), { contentType, upsert: true });
      return error ? null : path;
    } catch {
      return null;
    }
  };

  /** Graceful fallback: no garment detected (or detection failed). Save the whole
   *  photo as one untagged piece (a "needs details" item), never a dead end. */
  const fallbackWholePhoto = async (source: Source) => {
    setPhase('saving');
    const before = pieces ?? [];
    const imagePath = source.base64 ? await upload(source.base64, 'photo', source.mediaType) : null;
    const piece = await insertPiece({ user_id: user!.id, source: 'photo_library', image_url: imagePath });
    qc.invalidateQueries({ queryKey: queryKeys.pieces });
    const looks = looksUnlocked(before, [...before, piece]);
    setResult({ added: 1, looks, needsDetails: true });
    setPhase('done');
  };

  const addFrom = async (from: 'camera' | 'gallery') => {
    if (!user) return;
    const perm =
      from === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const res =
      from === 'camera'
        ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7, mediaTypes: ['images'] })
        : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7, mediaTypes: ['images'] });
    if (res.canceled || !res.assets.length) return;

    const asset = res.assets[0];
    const source: Source = { uri: asset.uri, base64: asset.base64 ?? undefined, mediaType: asset.mimeType ?? 'image/jpeg' };

    // Detect the garments in the photo, then let the user pick which to add.
    setPhase('detecting');
    try {
      const { garments } = await detectGarments({
        photo: { base64: source.base64, mediaType: source.mediaType },
        context: { gender },
      });
      if (garments.length) {
        setThumbs({}); // clear any prior previews before this detection's crops arrive
        setDetected({ source, garments });
        setSelected(new Set(garments.map((_, i) => i))); // default: all selected
        setPhase('pick');
      } else {
        await fallbackWholePhoto(source);
      }
    } catch {
      await fallbackWholePhoto(source); // detection failure is non-fatal
    }
  };

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  /** Crop + persist each picked garment as its own tagged Piece. */
  const confirmAdd = async () => {
    if (!user || !detected) return;
    const picks = detected.garments.filter((_, i) => selected.has(i));
    if (!picks.length) return;

    const { source } = detected;
    const before = pieces ?? [];
    setPhase('saving');

    const created: Piece[] = [];
    for (let i = 0; i < picks.length; i++) {
      const g = picks[i];
      // Generate a clean catalog-style image of this garment (swappable provider),
      // guided by its detected tags so the output matches the real item.
      let imagePath: string | null = null;
      if (source.base64) {
        try {
          const generated = await produceGarmentImage({
            source: { base64: source.base64, mediaType: source.mediaType },
            region: g.bounding_region,
            tags: { type: g.type, color: g.color, pattern: g.pattern, label: g.label },
          });
          imagePath = await upload(generated.base64, `g${i}`, generated.mediaType);
        } catch {
          // non-fatal: persist the tagged piece without a cropped image
        }
      }
      const piece = await insertPiece({
        user_id: user.id,
        source: 'photo_library',
        image_url: imagePath,
        type: g.type,
        color: g.color ?? null,
        pattern: g.pattern ?? null,
        attributes: g.attributes ?? null,
      });
      created.push(piece);
    }

    qc.invalidateQueries({ queryKey: queryKeys.pieces });
    const looks = looksUnlocked(before, [...before, ...created]);
    setDetected(null);
    setThumbs({});
    setResult({ added: created.length, looks, needsDetails: false });
    setPhase('done');
  };

  const restart = () => {
    setResult(null);
    setDetected(null);
    setThumbs({});
    setPhase('choose');
  };

  // The celebratory, honest unlock line from the real counts.
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
      {phase === 'done' && result ? (
        <View style={styles.body}>
          <InfoState
            icon={result.needsDetails ? 'plus' : result.looks > 0 ? 'star' : 'check'}
            eyebrow={a.unlockEyebrow}
            title={result.needsDetails ? a.detectNoneTitle : unlockTitle}
            body={result.needsDetails ? a.detectNoneBody : unlockBody}
            ctaLabel={a.unlockCta}
            onCta={() => router.back()}
          />
          <Pressable onPress={restart} hitSlop={8} style={styles.addMore}>
            <Icon name="plus" size={16} color={colors.gold} />
            <Text variant="label" color={colors.gold}>
              {a.addMore}
            </Text>
          </Pressable>
        </View>
      ) : phase === 'pick' && detected ? (
        <View style={styles.pickWrap}>
          <ScrollView contentContainerStyle={styles.pickScroll} showsVerticalScrollIndicator={false}>
            <Eyebrow style={styles.eyebrow}>{a.pickEyebrow}</Eyebrow>
            <Text variant="head" style={styles.title}>
              {a.pickTitle}
            </Text>
            <Text variant="subtitle" style={styles.subtitle}>
              {a.pickSubtitle}
            </Text>

            <View style={styles.list}>
              {detected.garments.map((g, i) => {
                const on = selected.has(i);
                const detail = garmentDetail(g);
                return (
                  <Card key={i} padding={spacing.md} style={[styles.pickCard, !on && styles.pickOff]}>
                    <GarmentSlot
                      tone={TONES[i % TONES.length]}
                      source={thumbs[i] ? { uri: thumbs[i] } : undefined}
                      width={64}
                      radius={radii.sm}
                    />
                    <View style={styles.pickBody}>
                      <Text variant="label" numberOfLines={1}>
                        {g.type}
                      </Text>
                      {detail ? (
                        <Text variant="labelSm" color={colors.secondary} numberOfLines={1} style={styles.pickDetail}>
                          {detail}
                        </Text>
                      ) : null}
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => toggle(i)}
                      style={[styles.toggle, on ? styles.toggleOn : styles.toggleOff]}
                    >
                      <Icon name={on ? 'check' : 'plus'} size={18} color={on ? colors.paper : colors.secondary} />
                    </Pressable>
                  </Card>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.pickFooter}>
            <PillButton label={a.addSelected} onPress={confirmAdd} disabled={selected.size === 0} />
            <Pressable onPress={restart} hitSlop={8} style={styles.cancel}>
              <Text variant="label" color={colors.secondary}>
                {a.cancel}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : phase === 'detecting' ? (
        <LookLoading message={a.detecting} />
      ) : phase === 'saving' ? (
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
              <MethodCard icon="barcode" label={a.barcode} sub={a.barcodeSub} locked soon={a.soon} />
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
  body: { paddingHorizontal: spacing.g22 },
  eyebrow: { marginBottom: spacing.sm },
  title: { fontSize: 26, lineHeight: 31 },
  subtitle: { fontSize: 15, marginTop: spacing.xs, marginBottom: spacing.g20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.g12 },
  cell: { width: '47%', flexGrow: 1 },
  // pick (detected garments) screen
  pickWrap: { flex: 1 },
  pickScroll: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.lg },
  list: { gap: spacing.md },
  pickCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pickOff: { opacity: 0.45 },
  pickBody: { flex: 1 },
  pickDetail: { marginTop: 2 },
  toggle: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.gold },
  toggleOff: { borderWidth: 1.5, borderColor: colors.hairline },
  pickFooter: { paddingHorizontal: spacing.gutter, paddingTop: spacing.md },
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
