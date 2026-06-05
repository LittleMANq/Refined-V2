import { Tabs } from 'expo-router';

import { TabBar } from '@/components/app';

/**
 * The logged-in 5-tab shell: Today, Closet, Create, Stylist, You. A custom RTL
 * tab bar (single gold accent on the active tab). Detail screens (look, piece)
 * are pushed over the tabs by the root Stack.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="closet" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="stylist" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
