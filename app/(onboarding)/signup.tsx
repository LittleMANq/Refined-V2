import { router } from 'expo-router';
import { useState } from 'react';
import { I18nManager, Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  Card,
  colors,
  GarmentSlot,
  Hairline,
  PillButton,
  radii,
  fontFamilies,
  ScreenHeader,
  spacing,
  Text,
} from '@/components';
import { Icon, PaletteStrip, StepScreen } from '@/components/onboarding';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/data';
import { ROUTES, useOnboarding } from '@/lib/onboarding';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const { t } = useTranslation();
  const su = t.onboarding.signup;
  const { analysis } = useOnboarding();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const proceed = () => router.push(ROUTES.permissions);

  // Attach an email to the (anonymous) account that already holds the saved data.
  // Email is the working credential path; Apple/Google are framed the same but
  // continue for now (the data is already saved under the session) — full OAuth is
  // a later enhancement that needs native deep-link config.
  const continueWithEmail = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setBusy(true);
    try {
      await supabase.auth.updateUser({ email: email.trim() });
    } catch {
      // non-fatal: the analysis is already saved under the session
    }
    setBusy(false);
    proceed();
  };

  return (
    <StepScreen
      onBack={() => router.back()}
      bodyPaddingTop={spacing.sm}
      footer={
        <View style={styles.footer}>
          <PillButton
            label={busy ? `${su.emailCta}…` : su.emailCta}
            variant={email ? 'primary' : 'surface'}
            disabled={busy}
            onPress={continueWithEmail}
          />
          <Pressable onPress={proceed} hitSlop={8} style={styles.maybeLater}>
            <Text variant="btnText" color={colors.secondary}>
              {su.maybeLater}
            </Text>
          </Pressable>
        </View>
      }
    >
      {/* identity reminder — a real preview of what is being saved */}
      {analysis ? (
        <Card padding={spacing.md} style={styles.identity}>
          <View style={styles.identityHead}>
            <GarmentSlot tone="a" width={54} radius={radii.md} />
            <View style={styles.identityText}>
              <Text variant="mono" color={colors.gold} style={styles.identityEyebrow}>
                {su.identityLabel}
              </Text>
              <Text variant="serifTitle" style={styles.identityName}>
                {analysis.styleIdentity.name}
              </Text>
            </View>
          </View>
          <Hairline style={styles.identityRule} />
          <View style={styles.identityPalette}>
            <Text variant="labelSm" color={colors.secondary}>
              {su.paletteLabel}
            </Text>
            <View style={styles.identityStrip}>
              <PaletteStrip palette={analysis.color_palette.flatters} height={18} />
            </View>
          </View>
        </Card>
      ) : null}

      <ScreenHeader title={su.title} subtitle={su.subtitle} titleSize={28} style={styles.header} />

      <PillButton
        label={su.apple}
        onPress={proceed}
        icon={<Icon name="apple" size={20} color={colors.paper} />}
      />
      <PillButton
        variant="ghost"
        label={su.google}
        onPress={proceed}
        style={styles.googleBtn}
        icon={<Icon name="google" size={20} color={colors.ink} />}
      />

      <View style={styles.orRow}>
        <Hairline style={styles.flex} />
        <Text variant="labelSm" color={colors.secondary}>
          {su.or}
        </Text>
        <Hairline style={styles.flex} />
      </View>

      <TextInput
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setError(false);
        }}
        placeholder={su.emailPlaceholder}
        placeholderTextColor={colors.secondary}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={[styles.input, { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}
      />

      {error ? (
        <Text variant="labelSm" color={colors.gold} style={styles.note}>
          {su.emailError}
        </Text>
      ) : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  identity: { marginBottom: spacing.g26 },
  identityHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.g12 },
  identityText: { flex: 1 },
  identityEyebrow: { marginBottom: 5 },
  identityName: { fontFamily: fontFamilies.serifMedium, lineHeight: 22 },
  identityRule: { marginVertical: spacing.g12 },
  identityPalette: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  identityStrip: { flex: 1, maxWidth: 150 },
  header: { marginBottom: spacing.g26 },
  googleBtn: { marginTop: spacing.g12 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.g22 },
  flex: { flex: 1 },
  input: {
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.paper,
    paddingHorizontal: 22,
    fontFamily: fontFamilies.sansRegular,
    fontSize: 16,
    color: colors.ink,
  },
  note: { marginTop: spacing.md, paddingHorizontal: spacing.sm },
  footer: { gap: spacing.g12 },
  maybeLater: { alignSelf: 'center', paddingVertical: spacing.sm },
});
