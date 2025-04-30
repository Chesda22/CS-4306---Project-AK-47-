import React from 'react';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Combine both themes
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
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </NavigationContainer>
  );
}
