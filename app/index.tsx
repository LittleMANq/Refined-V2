import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  Eyebrow,
  PillButton,
  SerifHero,
  spacing,
  Text,
  Wordmark,
} from '@/components';
import { useTranslation } from '@/i18n';

/**
 * Placeholder Today screen. Real Today (daily look + reasoning) is built later;
 * for now it boots the app and shows the design system is wired (fonts, RTL,
 * tokens, components). Strings come from i18n.
 */
export default function TodayScreen() {
  const { t, toggleLocale } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Wordmark />
      </View>

      <View style={styles.content}>
        <Eyebrow style={styles.eyebrow}>{t.app.name}</Eyebrow>
        <SerifHero>{t.today.placeholderTitle}</SerifHero>
        <Text variant="subtitle" style={styles.body}>
          {t.today.placeholderBody}
        </Text>
      </View>

      <View style={styles.footer}>
        <PillButton variant="surface" label={t.common.switchLanguage} onPress={toggleLocale} />
        {__DEV__ ? (
          <Link href="/gallery" asChild>
            <Pressable style={styles.galleryLink}>
              <Text variant="label" color={colors.secondary} align="center">
                {t.today.openGallery}
              </Text>
            </Pressable>
          </Link>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.gutter,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
  },
  eyebrow: {
    marginBottom: spacing.lg,
  },
  body: {
    marginTop: spacing.md,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  galleryLink: {
    alignSelf: 'center',
    padding: spacing.xs,
  },
});
