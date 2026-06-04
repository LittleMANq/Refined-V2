import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { applyRTL, DEFAULT_LOCALE, I18nProvider } from '@/i18n';

// RTL on by default (Hebrew). Applied once at startup, before the tree renders.
applyRTL(DEFAULT_LOCALE);

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
