import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, colors, PillButton, ScreenHeader, spacing, Text } from '@/components';
import { GeneratedLookView, InfoState, LookLoading } from '@/components/app';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { NeedMorePiecesError } from '@/lib/ai';
import {
  persistGeneratedOutfit,
  queryKeys,
  useCurrentUser,
  useGenerateOutfit,
  usePieces,
  useProfile,
} from '@/lib/hooks';

export default function CreateScreen() {
  const { t } = useTranslation();
  const cr = t.create;
  const occ = t.occasions;
  const { data: user } = useCurrentUser();
  const { data: profile } = useProfile();
  const { data: pieces } = usePieces();
  const generate = useGenerateOutfit();
  const qc = useQueryClient();

  const [occasion, setOccasion] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const occasions = [occ.everyday, occ.work, occ.smart, occ.evening, occ.event, occ.date];
  const needMore = generate.error instanceof NeedMorePiecesError;

  const run = (value: string) => {
    setOccasion(value);
    setSaved(false);
    generate.mutate(value);
  };

  // A save/dismiss updates preference_profile; refresh it so the next look is tuned.
  const refreshPreferences = () => qc.invalidateQueries({ queryKey: queryKeys.profile });

  const save = async () => {
    if (!user || !generate.data) return;
    await persistGeneratedOutfit(user.id, generate.data, { saved: true });
    setSaved(true);
    refreshPreferences();
  };
  // "Less for me": a negative preference signal, then a fresh look for the occasion.
  const dismiss = async () => {
    if (!user || !generate.data || !occasion) return;
    await persistGeneratedOutfit(user.id, generate.data, { dismissed: true });
    refreshPreferences();
    run(occasion);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow={cr.eyebrow} title={cr.title} subtitle={cr.subtitle} style={styles.header} />

        <Text variant="label" style={styles.occasionLabel}>
          {cr.occasionLabel}
        </Text>
        <View style={styles.occasions}>
          {occasions.map((value) => (
            <Chip key={value} label={value} active={occasion === value} onPress={() => run(value)} />
          ))}
        </View>

        {generate.isPending ? (
          <LookLoading message={t.ai.generating} />
        ) : needMore ? (
          <InfoState
            icon="plus"
            title={t.ai.needMoreTitle}
            body={t.ai.needMoreBody}
            ctaLabel={t.closet.add}
            onCta={() => router.push('/closet-add')}
          />
        ) : generate.isError ? (
          <InfoState
            icon="refresh-cw"
            title={t.ai.errorTitle}
            body={t.ai.errorBody}
            ctaLabel={t.common.retry}
            onCta={() => occasion && run(occasion)}
          />
        ) : generate.data && pieces ? (
          <View style={styles.result}>
            <GeneratedLookView look={generate.data} pieces={pieces} heading={profile?.style_identity?.name} />
            <View style={styles.actions}>
              <PillButton
                variant="ghost"
                size="sm"
                label={cr.regenerate}
                onPress={() => occasion && run(occasion)}
                icon={<Icon name="swap" size={18} color={colors.ink} />}
              />
              <PillButton
                label={saved ? cr.saved : cr.save}
                disabled={saved}
                onPress={save}
                icon={!saved ? <Icon name="heart" size={18} color={colors.paper} /> : undefined}
              />
              <Pressable onPress={dismiss} hitSlop={8} style={styles.dismiss}>
                <Text variant="label" color={colors.secondary}>
                  {cr.dismiss}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.g26, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.g26 },
  occasionLabel: { marginBottom: spacing.g12 },
  occasions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.g9, marginBottom: spacing.xl },
  result: { marginTop: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  dismiss: { alignSelf: 'center', paddingVertical: spacing.xs },
});
