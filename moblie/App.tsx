import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/state/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor={colors.background} />
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

