import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [showBadge, setShowBadge] = useState(false);

  // 🔁 Check if AI Chat has been visited
  useEffect(() => {
    const checkBadge = async () => {
      const seen = await AsyncStorage.getItem('visitedChat');
      setShowBadge(!seen);
    };
    checkBadge();
  }, []);

  // 🔄 Remove badge when user enters AI Chat
  const handleTabPress = async ({ route }) => {
    if (route.name === 'ClimateChatBot') {
      await AsyncStorage.setItem('visitedChat', 'true');
      setShowBadge(false);
    }
  };

  return (
    <Tabs
      screenListeners={{
        tabPress: handleTabPress
      }}
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#001F3F',
          borderTopColor: '#FFD700',
        },
        headerShown: false,
      }}
    >
      {/* 🏠 Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />

      {/* 📚 Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          )
        }}
      />

      {/* 🤖 Climate ChatBot */}
      <Tabs.Screen
        name="ClimateChatBot"
        options={{
          title: 'AI Chat 🤖',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          tabBarBadge: showBadge ? 'NEW' : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FFD700',
            color: '#001F3F',
            fontWeight: 'bold',
            fontSize: 11,
            paddingHorizontal: 4
          }
        }}
      />
    </Tabs>
  );
}
