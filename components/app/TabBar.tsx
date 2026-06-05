import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, Text } from '@/components';
import { Icon, type IconName } from '@/components/onboarding';
import { useTranslation } from '@/i18n';

/**
 * Minimal, structurally-compatible shape of the props Expo Router's
 * <Tabs tabBar={...}> passes (the full @react-navigation type is not hoisted).
 * `canPreventDefault: true` matches the tabPress event so the real emit assigns.
 */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    navigate: (name: string) => void;
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
  };
};

// The gallery's bespoke tab glyphs (sun / hanger / chat / heart); the extra create
// tab takes the sparkle (the generate-a-look mark).
const ICONS: Record<string, IconName> = {
  today: 'sun',
  closet: 'hanger',
  create: 'sparkle',
  stylist: 'chat',
  you: 'heart',
};

/**
 * The five-tab bottom bar. Ink/secondary labels, a single gold accent on the
 * active icon (gold is accent-only). RTL flows right to left automatically.
 */
export function TabBar({ state, navigation }: TabBarProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const labels = t.tabs;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.g12) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = ICONS[route.name];
        const label = labels[route.name as keyof typeof labels];
        if (!icon || !label) return null;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            onPress={onPress}
            style={styles.tab}
          >
            <Icon name={icon} size={22} color={focused ? colors.gold : colors.secondary} />
            <Text variant="labelSm" color={focused ? colors.ink : colors.secondary} style={styles.label}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.paper,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.g12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
  },
});
