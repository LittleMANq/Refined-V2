import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, Text, Wordmark } from '@/components';
import { useTranslation } from '@/i18n';
import { getProfile, supabase } from '@/lib/data';
import { ROUTES } from '@/lib/onboarding';

/**
 * Entry gate. Decides where a launch lands: a returning user who already finished
 * onboarding (their profile carries a Style Identity) goes straight to Today; a new
 * launch starts the onboarding magic moment. This is what makes the persisted
 * analysis survive a reload, the session restores from storage and we route to Today.
 */
export default function IndexGate() {
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (user) {
          const profile = await getProfile(user.id);
          if (active && profile?.style_identity?.name) {
            router.replace(ROUTES.today);
            return;
          }
        }
      } catch {
        // fall through to onboarding
      }
      if (active) router.replace(ROUTES.intro);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Wordmark size={22} />
      <Text variant="mono" color={colors.secondary} style={styles.label}>
        {t.today.loading}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  label: {},
});
