import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  Card,
  colors,
  GarmentSlot,
  Hairline,
  PillButton,
  radii,
  ScreenHeader,
  shadows,
  spacing,
  Text,
} from '@/components';
import { Icon, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { ONBOARDING_STEPS, ROUTES, useOnboarding, type CapturedPhoto } from '@/lib/onboarding';

const MAX_PHOTOS = 3;

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  return <View style={[styles.corner, styles[pos]]} />;
}

export default function CaptureScreen() {
  const { t } = useTranslation();
  const cap = t.onboarding.capture;
  const { photos, setPhotos } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  const tips = [cap.tipFullBody, cap.tipLight, cap.tipBackground];

  const addAssets = (assets: ImagePicker.ImagePickerAsset[]) => {
    const mapped: CapturedPhoto[] = assets
      .filter((a) => !!a.base64)
      .map((a) => ({ uri: a.uri, base64: a.base64 as string, mediaType: a.mimeType ?? 'image/jpeg' }));
    const merged = [...photos, ...mapped];
    const seen = new Set<string>();
    const deduped = merged.filter((p) => (seen.has(p.uri) ? false : (seen.add(p.uri), true)));
    setPhotos(deduped.slice(0, MAX_PHOTOS));
  };

  const takePhoto = async () => {
    setError(null);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setError(cap.cameraDenied);
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
      mediaTypes: ['images'],
    });
    if (!res.canceled) addAssets(res.assets);
  };

  const chooseFromGallery = async () => {
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError(cap.galleryDenied);
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS,
    });
    if (!res.canceled) addAssets(res.assets);
  };

  const hasPhotos = photos.length > 0;
  const cover = photos[0];

  return (
    <StepScreen
      onBack={() => router.back()}
      step={3}
      total={ONBOARDING_STEPS}
      footer={
        <View style={styles.footer}>
          {hasPhotos ? (
            <PillButton label={cap.analyze} onPress={() => router.push(ROUTES.analysis)} />
          ) : (
            <PillButton
              label={cap.takePhoto}
              onPress={takePhoto}
              icon={<Icon name="camera" size={20} color={colors.paper} />}
            />
          )}
          <PillButton
            variant="ghost"
            label={cap.chooseGallery}
            onPress={chooseFromGallery}
            icon={<Icon name="image" size={20} color={colors.ink} />}
          />
          <View style={styles.privacy}>
            <Icon name="lock" size={15} color={colors.secondary} />
            <Text variant="labelSm" color={colors.secondary}>
              {cap.privacy}
            </Text>
          </View>
        </View>
      }
    >
      <ScreenHeader eyebrow={cap.eyebrow} title={cap.title} subtitle={cap.subtitle} style={styles.header} />

      <View style={styles.frameWrap}>
        <View style={styles.frame}>
          {cover ? (
            <Image source={{ uri: cover.uri }} style={styles.photo} resizeMode="cover" />
          ) : (
            <GarmentSlot tone="ink" radius={radii.card} style={styles.guideSlot}>
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />
              <View style={styles.statusPill}>
                <View style={styles.goldDot} />
                <Text variant="mono" color={colors.paper}>
                  {cap.modeFullBody}
                </Text>
              </View>
              <View style={styles.frameHint}>
                <Text variant="labelSm" color={colors.paper} align="center">
                  {cap.frameHint}
                </Text>
              </View>
            </GarmentSlot>
          )}
        </View>

        {photos.length > 1 ? (
          <View style={styles.thumbs}>
            {photos.map((p, i) => (
              <Image key={p.uri + i} source={{ uri: p.uri }} style={styles.thumb} resizeMode="cover" />
            ))}
          </View>
        ) : null}
      </View>

      {error ? (
        <Card variant="surface" padding={spacing.md} style={styles.error}>
          <Text variant="label" color={colors.ink}>
            {error}
          </Text>
        </Card>
      ) : (
        <View style={styles.tips}>
          {tips.map((tip) => (
            <View key={tip} style={styles.tip}>
              <View style={styles.goldDotSmall} />
              <Text variant="labelSm">{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <Hairline style={styles.spacer} />
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  frameWrap: { alignItems: 'center' },
  frame: {
    width: '78%',
    aspectRatio: 3 / 4.2,
    borderRadius: radii.card,
    overflow: 'hidden',
    ...shadows.float,
  },
  guideSlot: { width: '100%', height: '100%', aspectRatio: undefined },
  photo: { width: '100%', height: '100%' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: colors.gold },
  tl: { top: 14, insetInlineStart: 14, borderTopWidth: 2, borderStartWidth: 2, borderTopStartRadius: 7 },
  tr: { top: 14, insetInlineEnd: 14, borderTopWidth: 2, borderEndWidth: 2, borderTopEndRadius: 7 },
  bl: { bottom: 14, insetInlineStart: 14, borderBottomWidth: 2, borderStartWidth: 2, borderBottomStartRadius: 7 },
  br: { bottom: 14, insetInlineEnd: 14, borderBottomWidth: 2, borderEndWidth: 2, borderBottomEndRadius: 7 },
  statusPill: {
    position: 'absolute',
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.ink60,
  },
  goldDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.gold },
  frameHint: { position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' },
  thumbs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  thumb: { width: 44, height: 58, borderRadius: radii.sm },
  tips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 13,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  goldDotSmall: { width: 5, height: 5, borderRadius: 999, backgroundColor: colors.gold },
  error: { marginTop: spacing.lg },
  footer: { gap: spacing.md },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  spacer: { marginTop: spacing.lg, opacity: 0 },
});
