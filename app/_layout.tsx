// app/_layout.tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const CombinedLightTheme = {
  ...NavDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: '#28B67E',
    accent: '#FFBA00',
    background: '#ECE9E9',
    surface: '#FFFFFF',
    text: '#0D1321',
  },
};

const CombinedDarkTheme = {
  ...NavDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: '#28B67E',
    accent: '#FFBA00',
    background: '#0D1321',
    surface: '#1D4C4F',
    text: '#ECE9E9',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <NavigationContainer theme={theme}>
      <PaperProvider theme={theme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </NavigationContainer>
  );
}
