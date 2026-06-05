import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, colors, PillButton, ScreenHeader, spacing, Text } from '@/components';
import { GeneratedLookView, InfoState, LookLoading } from '@/components/app';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { NeedMorePiecesError } from '@/lib/ai';
import {
  persistGeneratedOutfit,
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

  const [occasion, setOccasion] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const occasions = [occ.everyday, occ.work, occ.smart, occ.evening, occ.event, occ.date];
  const needMore = generate.error instanceof NeedMorePiecesError;

  const run = (value: string) => {
    setOccasion(value);
    setSaved(false);
    generate.mutate(value);
  };

  const save = async () => {
    if (!user || !generate.data) return;
    await persistGeneratedOutfit(user.id, generate.data, { saved: true });
    setSaved(true);
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
            icon="grid"
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
                variant="surface"
                label={cr.regenerate}
                onPress={() => occasion && run(occasion)}
                icon={<Icon name="refresh-cw" size={18} color={colors.ink} />}
                style={styles.actionBtn}
              />
              <PillButton
                label={saved ? cr.saved : cr.save}
                disabled={saved}
                onPress={save}
                icon={!saved ? <Icon name="heart" size={18} color={colors.paper} /> : undefined}
                style={styles.actionBtn}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.xl },
  occasionLabel: { marginBottom: spacing.md },
  occasions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  result: { marginTop: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  actionBtn: { flex: 1 },
});
