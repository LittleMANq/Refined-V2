import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, PillButton, spacing, Text } from '@/components';
import { GeneratedLookView, InfoState, LookLoading } from '@/components/app';
import { Icon } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { NeedMorePiecesError } from '@/lib/ai';
import { persistGeneratedOutfit, useCurrentUser, useDailyLook, usePieces, useProfile } from '@/lib/hooks';

export default function LookScreen() {
  const { t } = useTranslation();
  const lk = t.look;
  const { data: user } = useCurrentUser();
  const { data: profile } = useProfile();
  const { data: pieces } = usePieces();
  const daily = useDailyLook();
  const [saved, setSaved] = useState(false);
  const [wore, setWore] = useState(false);

  const needMore = daily.error instanceof NeedMorePiecesError;

  const save = async () => {
    if (!user || !daily.data || saved) return;
    await persistGeneratedOutfit(user.id, daily.data, { saved: true });
    setSaved(true);
  };
  const woreIt = async () => {
    if (!user || !daily.data || wore) return;
    await persistGeneratedOutfit(user.id, daily.data, { saved: true, worn: true });
    setWore(true);
    setSaved(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBtn}>
          <Icon name="chevron-right" size={24} color={colors.ink} />
        </Pressable>
        <Text variant="mono" color={colors.secondary}>
          {lk.header}
        </Text>
        <Pressable onPress={save} hitSlop={10} style={styles.headerBtn}>
          <Icon name="heart" size={22} color={saved ? colors.gold : colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {daily.isFetching ? (
          <LookLoading message={t.ai.generating} />
        ) : needMore ? (
          <InfoState
            icon="grid"
            title={t.ai.needMoreTitle}
            body={t.ai.needMoreBody}
            ctaLabel={t.closet.add}
            onCta={() => router.push('/closet-add')}
          />
        ) : daily.isError ? (
          <InfoState
            icon="refresh-cw"
            title={t.ai.errorTitle}
            body={t.ai.errorBody}
            ctaLabel={t.common.retry}
            onCta={() => daily.refetch()}
          />
        ) : daily.data && pieces ? (
          <GeneratedLookView look={daily.data} pieces={pieces} heading={profile?.style_identity?.name} />
        ) : null}
      </ScrollView>

      {daily.data && !daily.isFetching ? (
        <View style={styles.footer}>
          <View style={styles.row}>
            <PillButton
              variant="surface"
              label={saved ? lk.saved : lk.save}
              onPress={save}
              icon={<Icon name="heart" size={18} color={colors.gold} />}
              style={styles.rowBtn}
            />
            <PillButton
              variant="surface"
              label={lk.woreIt}
              onPress={woreIt}
              disabled={wore}
              icon={<Icon name="check" size={18} color={colors.gold} />}
              style={styles.rowBtn}
            />
          </View>
          <PillButton
            label={lk.swap}
            onPress={() => daily.refetch()}
            icon={<Icon name="refresh-cw" size={19} color={colors.paper} />}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerBtn: { padding: 4 },
  scroll: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  footer: { paddingHorizontal: spacing.gutter, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  rowBtn: { flex: 1 },
});
