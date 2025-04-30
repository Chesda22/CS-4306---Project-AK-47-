// Import necessary components and libraries
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Animated as RNAnimated,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

// Tabs for navigation
const tabs = ['Photos', 'Links', 'Books', 'Organizations'];
const screenWidth = Dimensions.get('window').width;

// Public climate-related photo URLs (randomized later)
const remoteImages = [
  'https://images.unsplash.com/photo-1581091870627-3d4f50467864?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502303753006-8edba4b31be1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535916707207-35f97e715e1b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516912481808-3406841bd33e?auto=format&fit=crop&w=800&q=80'
];

const Explore = () => {
  // State for current tab, quote, loading status, and photos
  const [activeTab, setActiveTab] = useState('Photos');
  const [quote, setQuote] = useState('Loading inspirational quote...');
  const [loading, setLoading] = useState(true);
  const [randomPhotos, setRandomPhotos] = useState([]);

  // Animations: quote fade and tab underline slide
  const quoteFadeAnim = useRef(new RNAnimated.Value(1)).current;
  const underlineAnim = useRef(new RNAnimated.Value(0)).current;

  // Tree scale animation (grows in)
  const treeScale = useSharedValue(0);
  const animatedTreeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: treeScale.value }],
    opacity: treeScale.value
  }));

  // Fetch quote from API or cache (with fade & tree animation)
  const fetchQuote = async () => {
    try {
      setLoading(true);
      animateQuote();             // Fade out/in
      treeScale.value = 0;        // Reset tree
      treeScale.value = withTiming(1, { duration: 2000 });  // Grow again

      const res = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();
      const formatted = `❝ ${data[0].q} ❞\n— ${data[0].a}`;
      setQuote(formatted);
      await AsyncStorage.setItem('cachedQuote', formatted); // Save offline
    } catch {
      const cached = await AsyncStorage.getItem('cachedQuote');
      setQuote(cached || '🌱 “Sustainability starts with awareness.”');
    } finally {
      setLoading(false);
    }
  };

  // Quote fade animation
  const animateQuote = () => {
    RNAnimated.sequence([
      RNAnimated.timing(quoteFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      RNAnimated.timing(quoteFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();
  };

  // When user switches tabs
  const handleTabChange = (tab, index) => {
    setActiveTab(tab);
    RNAnimated.timing(underlineAnim, {
      toValue: index * (screenWidth / tabs.length),
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  // On first load: fetch quote, show tree, randomize photos
  useEffect(() => {
    fetchQuote();
    treeScale.value = withTiming(1, { duration: 2000 });
    const shuffled = [...remoteImages].sort(() => Math.random() - 0.5).slice(0, 2);
    setRandomPhotos(shuffled);
  }, []);

  return (
    <View style={styles.container}>
      {/* Page title */}
      <Text style={styles.header}>🌍 Explore Climate Awareness</Text>

      {/* Tree image with animation */}
      <Animated.Image
        source={require('@/assets/images/tree.png')}
        style={[styles.treeImage, animatedTreeStyle]}
        resizeMode="contain"
      />

      {/* Quote section */}
      <View style={styles.quoteBox}>
        {loading ? (
          <ActivityIndicator color="#FFD700" />
        ) : (
          <RNAnimated.Text style={[styles.quoteText, { opacity: quoteFadeAnim }]}>
            {quote}
          </RNAnimated.Text>
        )}
        <TouchableOpacity onPress={fetchQuote} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 New Quote</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs for content switching */}
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabChange(tab, index)}
            style={styles.tabTouchable}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <RNAnimated.View
          style={[
            styles.underline,
            {
              left: underlineAnim,
              width: screenWidth / tabs.length
            }
          ]}
        />
      </View>

      {/* Tab Content Area */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'Photos' && (
          <>
            {randomPhotos.map((url, idx) => (
              <Image key={idx} source={{ uri: url }} style={styles.imageCard} />
            ))}
          </>
        )}

        {activeTab === 'Links' && (
          <>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://climate.nasa.gov/')}>🌐 NASA Climate</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://www.ipcc.ch/')}>📘 IPCC Reports</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://www.epa.gov/climate-change')}>🏛 EPA Climate Info</Text>
            </View>
          </>
        )}

        {activeTab === 'Books' && (
          <>
            <View style={styles.bookCard}>
              <Text style={styles.card}>📘 This Changes Everything – Naomi Klein</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card}>📗 The Uninhabitable Earth – David Wallace-Wells</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card}>📙 How to Avoid a Climate Disaster – Bill Gates</Text>
            </View>
          </>
        )}

        {activeTab === 'Organizations' && (
          <>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://350.org')}>🌱 350.org – Climate Campaigns</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://www.greenpeace.org')}>🌿 Greenpeace – Global Action</Text>
            </View>
            <View style={styles.bookCard}>
              <Text style={styles.card} onPress={() => Linking.openURL('https://www.wwf.org')}>🐼 WWF – Wildlife Protection</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
    paddingTop: 60
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15
  },
  treeImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10
  },
  quoteBox: {
    backgroundColor: '#003366',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#FFD700',
    borderWidth: 1
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center'
  },
  refreshButton: {
    alignItems: 'center',
    marginTop: 10
  },
  refreshText: {
    color: '#FFD700',
    textDecorationLine: 'underline'
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    position: 'relative'
  },
  tabTouchable: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#FFD700'
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#FFD700'
  },
  scroll: {
    padding: 20
  },
  imageCard: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#FFD700',
    borderWidth: 2
  },
  card: {
    fontSize: 16,
    color: '#fff'
  },
  bookCard: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#FFD700',
    borderWidth: 1
  }
});
