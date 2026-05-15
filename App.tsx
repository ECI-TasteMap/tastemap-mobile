import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/lib/supabase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  useEffect(() => {
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (url.includes('code=')) {
        const code = url.split('code=')[1]?.split('&')[0];
        if (code) await supabase.auth.exchangeCodeForSession(code);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}