import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabs = ['Photos', 'Links', 'Books', 'Organizations'];
const screenWidth = Dimensions.get('window').width;

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Photos');
  const [quote, setQuote] = useState('Loading inspirational quote...');
  const [loading, setLoading] = useState(true);
  const quoteFadeAnim = useRef(new Animated.Value(1)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const fetchQuote = async () => {
    try {
      setLoading(true);
      animateQuote();
      const res = await fetch('https://api.quotable.io/random?tags=environment|wisdom');
      const data = await res.json();
      const formatted = `❝ ${data.content} ❞\n— ${data.author}`;
      setQuote(formatted);
      await AsyncStorage.setItem('cachedQuote', formatted);
    } catch {
      const cached = await AsyncStorage.getItem('cachedQuote');
      setQuote(cached || '🌱 “Sustainability starts with awareness.”');
    } finally {
      setLoading(false);
    }
  };

  const animateQuote = () => {
    Animated.sequence([
      Animated.timing(quoteFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(quoteFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleTabChange = (tab, index) => {
    setActiveTab(tab);
    Animated.timing(underlineAnim, {
      toValue: index * (screenWidth / tabs.length),
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false
    }).start();
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌍 Explore Climate Awareness</Text>

      <View style={styles.quoteBox}>
        {loading ? (
          <ActivityIndicator color="#FFD700" />
        ) : (
          <Animated.Text style={[styles.quoteText, { opacity: quoteFadeAnim }]}>
            {quote}
          </Animated.Text>
        )}
        <TouchableOpacity onPress={fetchQuote} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 New Quote</Text>
        </TouchableOpacity>
      </View>

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
        <Animated.View
          style={[
            styles.underline,
            {
              left: underlineAnim,
              width: screenWidth / tabs.length
            }
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'Photos' && (
          <>
            <Image
              source={{ uri: 'https://climate.nasa.gov/system/content_pages/main_images/50_earths_city_lights.jpg' }}
              style={styles.imageCard}
            />
            <Image
              source={{ uri: 'https://cdn.pixabay.com/photo/2022/03/10/15/52/smokestacks-7059454_1280.jpg' }}
              style={styles.imageCard}
            />
          </>
        )}

        {activeTab === 'Links' && (
          <>
            <Text style={styles.link} onPress={() => Linking.openURL('https://climate.nasa.gov/')}>🌐 NASA Climate</Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.ipcc.ch/')}>📘 IPCC Reports</Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.epa.gov/climate-change')}>🏛 EPA Climate Info</Text>
          </>
        )}

        {activeTab === 'Books' && (
          <>
            <Text style={styles.card}>📘 This Changes Everything – Naomi Klein</Text>
            <Text style={styles.card}>📗 The Uninhabitable Earth – David Wallace-Wells</Text>
            <Text style={styles.card}>📙 How to Avoid a Climate Disaster – Bill Gates</Text>
          </>
        )}

        {activeTab === 'Organizations' && (
          <>
            <Text style={styles.card} onPress={() => Linking.openURL('https://350.org')}>🌱 350.org – Climate Campaigns</Text>
            <Text style={styles.card} onPress={() => Linking.openURL('https://www.greenpeace.org')}>🌿 Greenpeace – Global Action</Text>
            <Text style={styles.card} onPress={() => Linking.openURL('https://www.wwf.org')}>🐼 WWF – Wildlife Protection</Text>
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
  link: {
    fontSize: 17,
    color: '#00ccff',
    textDecorationLine: 'underline',
    marginBottom: 14
  },
  card: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12
  }
});
