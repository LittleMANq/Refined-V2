import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, colors, Eyebrow, radii, spacing, Text } from '@/components';
import { LookLoading } from '@/components/app';
import { Icon, type IconName } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { insertPiece, supabase } from '@/lib/data';
import { useCurrentUser, queryKeys } from '@/lib/hooks';
import { base64ToBytes } from '@/lib/onboarding/base64';

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
  const cap = t.onboarding.capture;
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

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
        : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7, mediaTypes: ['images'] });
    if (res.canceled) return;

    setBusy(true);
    try {
      const asset = res.assets[0];
      let imagePath: string | null = null;
      if (asset.base64) {
        const path = `${user.id}/pieces/${Date.now()}.jpg`;
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
      await insertPiece({ user_id: user.id, source: 'photo_library', image_url: imagePath });
      qc.invalidateQueries({ queryKey: queryKeys.pieces });
      // Dismiss the sheet back to the closet, which refreshes with the new piece.
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.handle} />
      {busy ? (
        <LookLoading message={cap.title} />
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
  method: {},
  methodCard: { minHeight: 118 },
  methodLocked: { opacity: 0.55 },
  methodIcon: { width: 42, height: 42, borderRadius: radii.md, backgroundColor: colors.gold14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  methodHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  soon: { backgroundColor: colors.gold14, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  methodSub: { marginTop: 3 },
  cancel: { alignSelf: 'center', marginTop: spacing.lg, padding: spacing.sm },
});
