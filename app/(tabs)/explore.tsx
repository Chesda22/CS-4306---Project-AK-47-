import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  ImageBackground,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Online background image
const backgroundImage = { uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80' };

const tabs = ['Links', 'Books', 'Organizations'];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Links');
  const transition = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleTabSwitch = (tab) => {
    transition.value = 0;
    setTimeout(() => {
      setActiveTab(tab);
      transition.value = withTiming(1, { duration: 300 });
    }, 100);
  };

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: transition.value,
    transform: [{ scale: 0.98 + transition.value * 0.02 }],
  }));

  const content = {
    Links: [
      { title: 'NASA Climate', url: 'https://climate.nasa.gov', icon: 'globe' },
      { title: 'UN Environment Programme', url: 'https://www.unep.org', icon: 'leaf' },
      { title: 'Carbon Footprint Calculator', url: 'https://www.carbonfootprint.com', icon: 'calculator' },
    ],
    Books: [
      {
        title: 'The Uninhabitable Earth',
        image: 'https://images-na.ssl-images-amazon.com/images/I/81vpsIs58WL.jpg',
      },
      {
        title: 'This Changes Everything',
        image: 'https://images-na.ssl-images-amazon.com/images/I/81Kkq1zjK+L.jpg',
      },
      {
        title: 'How to Avoid a Climate Disaster',
        image: 'https://images-na.ssl-images-amazon.com/images/I/81r+LN4zGFL.jpg',
      },
    ],
    Organizations: [
      {
        title: 'Greenpeace',
        url: 'https://www.greenpeace.org',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Greenpeace_logo.svg',
      },
      {
        title: '350.org',
        url: 'https://350.org',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/350.org_logo.svg',
      },
      {
        title: 'Rainforest Alliance',
        url: 'https://www.rainforest-alliance.org',
        image: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Rainforest_Alliance_logo.svg',
      },
    ],
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} blurRadius={2}>
      <View style={[styles.container, { backgroundColor: isDark ? '#00000099' : '#FFFFFFCC' }]}>
        <Text style={styles.header}>🌱 Explore Sustainability Resources</Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabSwitch(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <Animated.View style={[fadeStyle, { flex: 1 }]}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {content[activeTab].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => item.url && Linking.openURL(item.url)}
                activeOpacity={item.url ? 0.85 : 1}
              >
                <View style={styles.cardContent}>
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  )}
                  {item.icon && !item.image && (
                    <FontAwesome5 name={item.icon} size={18} color="#28B67E" style={styles.icon} />
                  )}
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Explore;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28B67E',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#28B67E',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#28B67E',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#28B67E',
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFFDD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#001F3F',
    flexShrink: 1,
  },
  icon: {
    marginRight: 12,
  },
  previewImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
});
