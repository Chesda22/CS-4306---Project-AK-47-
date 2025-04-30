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
        {/* Tabs Layout (includes index.jsx, explore.jsx, ClimateChatBot.jsx, etc.) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Carbon Result Screen */}
        <Stack.Screen name="carbon-result" />

        {/* Fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
