import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Card,
  colors,
  GarmentSlot,
  Hairline,
  PillButton,
  radii,
  shadows,
  spacing,
  Text,
  Wordmark,
} from '@/components';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { deletePiece, getPiece, updatePiece, type PieceUpdate } from '@/lib/data';
import { queryKeys, useSignedImageUrls } from '@/lib/hooks';

type Fields = {
  type: string;
  color: string;
  pattern: string;
  season: string;
  formality: string;
  silhouette: string;
};

export default function PieceDetailScreen() {
  const { t } = useTranslation();
  const p = t.piece;
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<Fields>({
    type: '',
    color: '',
    pattern: '',
    season: '',
    formality: '',
    silhouette: '',
  });

  const { data: piece, isLoading } = useQuery({
    queryKey: ['piece', id],
    queryFn: () => getPiece(id),
  });
  const { data: imageMap } = useSignedImageUrls([piece?.image_url]);

  const startEdit = () => {
    if (!piece) return;
    setFields({
      type: piece.type ?? '',
      color: piece.color ?? '',
      pattern: piece.pattern ?? '',
      season: piece.season ?? '',
      formality: piece.attributes?.formality ?? '',
      silhouette: piece.attributes?.silhouette ?? '',
    });
    setEditing(true);
  };

  const save = useMutation({
    mutationFn: () => {
      const patch: PieceUpdate = {
        type: fields.type.trim() || null,
        color: fields.color.trim() || null,
        pattern: fields.pattern.trim() || null,
        season: fields.season.trim() || null,
        attributes: {
          ...piece?.attributes,
          formality: fields.formality.trim() || undefined,
          silhouette: fields.silhouette.trim() || undefined,
        },
      };
      return updatePiece(id, patch);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pieces });
      qc.invalidateQueries({ queryKey: ['piece', id] });
      setEditing(false);
    },
  });

  const remove = useMutation({
    mutationFn: () => deletePiece(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pieces });
      router.back();
    },
  });

  const confirmRemove = () => {
    Alert.alert(p.remove, '', [
      { text: t.common.maybeLater, style: 'cancel' },
      { text: p.remove, style: 'destructive', onPress: () => remove.mutate() },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Wordmark size={22} />
      </View>
    );
  }
  if (!piece) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <Header title={p.header} onBack={() => router.back()} />
        <View style={styles.center}>
          <Text variant="subtitle">{p.unnamed}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rows: { key: keyof Fields; label: string }[] = [
    { key: 'type', label: p.fieldType },
    { key: 'color', label: p.fieldColor },
    { key: 'pattern', label: p.fieldPattern },
    { key: 'season', label: p.fieldSeason },
    { key: 'formality', label: p.fieldFormality },
    { key: 'silhouette', label: p.fieldSilhouette },
  ];
  const viewValues: Record<keyof Fields, string | null | undefined> = {
    type: piece.type,
    color: piece.color,
    pattern: piece.pattern,
    season: piece.season,
    formality: piece.attributes?.formality,
    silhouette: piece.attributes?.silhouette,
  };

  const heroUri = piece.image_url ? imageMap?.[piece.image_url] : undefined;
  const needsDetails = !piece.type;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Header
        title={p.header}
        onBack={() => router.back()}
        action={
          <Pressable onPress={() => (editing ? save.mutate() : startEdit())} hitSlop={10}>
            {editing ? (
              <Text variant="label" color={colors.ink}>
                {p.save}
              </Text>
            ) : (
              <Icon name="edit" size={21} color={colors.ink} />
            )}
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroShadow}>
          <View style={styles.hero}>
            <GarmentSlot
              tone="a"
              radius={radii.card}
              style={styles.heroSlot}
              source={heroUri ? { uri: heroUri } : undefined}
            />
          </View>
        </View>

        <Text variant="head" style={styles.name}>
          {(editing ? fields.type : piece.type) || p.unnamed}
        </Text>
        <Text variant="subtitle" style={styles.subtitle}>
          {p.subtitle}
        </Text>

        {needsDetails && !editing ? (
          <Card padding={spacing.md} style={styles.needs}>
            <Text variant="label">{p.needsDetailsTitle}</Text>
            <Text variant="labelSm" color={colors.secondary} style={styles.needsBody}>
              {p.needsDetailsBody}
            </Text>
            <View style={styles.needsCta}>
              <PillButton label={p.needsDetailsCta} onPress={startEdit} />
            </View>
          </Card>
        ) : null}

        <Card padding={0} style={styles.attrs}>
          {rows.map((row, i) => (
            <View key={row.key}>
              {i > 0 ? <Hairline style={styles.divider} /> : null}
              <View style={styles.attrRow}>
                <Text variant="labelSm" color={colors.secondary}>
                  {row.label}
                </Text>
                {editing ? (
                  <TextInput
                    value={fields[row.key]}
                    onChangeText={(v) => setFields((f) => ({ ...f, [row.key]: v }))}
                    style={[styles.input, { writingDirection: 'rtl' }]}
                    placeholderTextColor={colors.secondary}
                  />
                ) : (
                  <Text variant="label" numberOfLines={1} style={styles.attrValue}>
                    {viewValues[row.key] || '—'}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </Card>

        {editing ? (
          <Pressable onPress={confirmRemove} style={styles.remove} hitSlop={8}>
            <Icon name="trash-2" size={16} color={colors.secondary} />
            <Text variant="label" color={colors.secondary}>
              {p.remove}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>

      {!editing ? (
        <View style={styles.footer}>
          <PillButton label={p.buildLook} onPress={() => router.navigate('/create')} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function Header({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.headerBtn}>
        <Icon name="chevron-right" size={24} color={colors.ink} />
      </Pressable>
      <Text variant="monoSm" color={colors.secondary}>
        {title}
      </Text>
      <View style={styles.headerAction}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  center: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.g22,
    paddingTop: spacing.g12,
    paddingBottom: spacing.sm,
  },
  headerBtn: { padding: 4, minWidth: 40 },
  headerAction: { minWidth: 40, alignItems: 'flex-end' },
  scroll: { paddingHorizontal: spacing.g22, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  heroShadow: { borderRadius: radii.card, backgroundColor: colors.surface, ...shadows.float },
  hero: { borderRadius: radii.card, overflow: 'hidden' },
  heroSlot: { width: '100%', aspectRatio: 3 / 4 },
  name: { marginTop: spacing.g20, fontSize: 27, lineHeight: 32 },
  subtitle: { marginTop: spacing.xs },
  needs: { marginTop: spacing.lg },
  needsBody: { marginTop: spacing.xs },
  needsCta: { marginTop: spacing.md },
  attrs: { marginTop: spacing.lg, overflow: 'hidden' },
  divider: { marginHorizontal: spacing.g16 },
  attrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.g16,
    paddingVertical: 14,
  },
  attrValue: { flexShrink: 1, fontSize: 14.5 },
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14.5,
    color: colors.ink,
    paddingVertical: 0,
  },
  remove: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  footer: { paddingHorizontal: spacing.g22, paddingTop: spacing.md, paddingBottom: spacing.g20 },
});
