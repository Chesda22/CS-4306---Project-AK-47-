import React from 'react';
import { Provider as PaperProvider, DefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define custom green-themed colors for Light Theme
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#28B67E',          // vibrant green
    accent: '#FFBA00',           // warm accent yellow
    background: '#ECE9E9',       // neutral light background
    surface: '#FFFFFF',          // component backgrounds
    text: '#0D1321',             // dark elegant text
  },
};

// Define custom green-themed colors for Dark Theme
const CustomDarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#28B67E',          // vibrant green
    accent: '#FFBA00',           // warm accent yellow
    background: '#0D1321',       // darker elegant background
    surface: '#1D4C4F',          // component backgrounds (dark greenish)
    text: '#ECE9E9',             // light text color
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs Layout: includes index.tsx, explore.tsx, ClimateChatBot.tsx */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Carbon Result Page */}
        <Stack.Screen name="carbon-result" />

        {/* Not Found fallback screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </PaperProvider>
  );
}
