import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from '@/i18n';

// Brand tokens are inlined here ONLY for this placeholder. The real theme module
// (single source of truth) arrives with the design system in Prompt 2.
const PAPER = '#FAF7F2';
const INK = '#1B1714';
const GOLD = '#B08953';
const SECONDARY = '#8A8178';

export default function TodayScreen() {
  const { t, toggleLocale } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.brand}>{t.app.name}</Text>
        <Text style={styles.title}>{t.today.placeholderTitle}</Text>
        <Text style={styles.body}>{t.today.placeholderBody}</Text>

        <Pressable accessibilityRole="button" style={styles.pill} onPress={toggleLocale}>
          <Text style={styles.pillText}>{t.common.switchLanguage}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  brand: {
    color: GOLD,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: INK,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: SECONDARY,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  pill: {
    marginTop: 24,
    backgroundColor: INK,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  pillText: {
    color: PAPER,
    fontSize: 15,
    fontWeight: '600',
  },
});
