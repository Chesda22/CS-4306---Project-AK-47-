import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs Layout: includes index.tsx, explore.tsx, ClimateChatBot.tsx */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Carbon Result Page */}
        <Stack.Screen name="carbon-result" />

        {/* Not Found fallback screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
