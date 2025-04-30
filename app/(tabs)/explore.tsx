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
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabs = ['Photos', 'Links', 'Books', 'Organizations'];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Photos');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const quoteFadeAnim = useRef(new Animated.Value(1)).current;
  const [quote, setQuote] = useState('Loading inspirational quote...');
  const [loading, setLoading] = useState(true);

  const handleTabChange = (tab) => {
    fadeAnim.setValue(0);
    setActiveTab(tab);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const animateQuoteChange = () => {
    Animated.sequence([
      Animated.timing(quoteFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(quoteFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      animateQuoteChange();
      const response = await fetch('https://api.quotable.io/random?tags=environment|wisdom');
      const data = await response.json();
      const quoteText = `❝ ${data.content} ❞\n— ${data.author}`;
      await AsyncStorage.setItem('cachedQuote', quoteText);
      setQuote(quoteText);
    } catch (error) {
      const cached = await AsyncStorage.getItem('cachedQuote');
      setQuote(cached || '“Sustainability starts with awareness.”');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌍 Explore More About Climate Impact</Text>

      <View style={styles.quoteBox}>
        {loading ? (
          <ActivityIndicator color="#FFD700" />
        ) : (
          <Animated.Text style={[styles.quoteText, { opacity: quoteFadeAnim }]}>{quote}</Animated.Text>
        )}
        <TouchableOpacity onPress={fetchQuote} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 Refresh Quote</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.contentBox, { opacity: fadeAnim }]}>
        <ScrollView>
          {activeTab === 'Photos' && (
            <>
              <Image source={{ uri: 'https://climate.nasa.gov/system/content_pages/main_images/50_earths_city_lights.jpg' }} style={styles.imageCard} />
              <Image source={{ uri: 'https://cdn.pixabay.com/photo/2022/03/10/15/52/smokestacks-7059454_1280.jpg' }} style={styles.imageCard} />
            </>
          )}

          {activeTab === 'Links' && (
            <>
              <Text style={styles.link} onPress={() => Linking.openURL('https://climate.nasa.gov/')}>🌐 NASA Climate</Text>
              <Text style={styles.link} onPress={() => Linking.openURL('https://www.ipcc.ch/')}>📘 IPCC Reports</Text>
              <Text style={styles.link} onPress={() => Linking.openURL('https://www.epa.gov/climate-change')}>🏛 EPA on Climate</Text>
            </>
          )}

          {activeTab === 'Books' && (
            <>
              <Text style={styles.book}>📘 This Changes Everything – Naomi Klein</Text>
              <Text style={styles.book}>📗 The Uninhabitable Earth – David Wallace-Wells</Text>
              <Text style={styles.book}>📙 How to Avoid a Climate Disaster – Bill Gates</Text>
            </>
          )}

          {activeTab === 'Organizations' && (
            <>
              <Text style={styles.book} onPress={() => Linking.openURL('https://350.org')}>🌱 350.org – Climate Campaigns</Text>
              <Text style={styles.book} onPress={() => Linking.openURL('https://www.greenpeace.org')}>🌿 Greenpeace – Global Action</Text>
              <Text style={styles.book} onPress={() => Linking.openURL('https://www.wwf.org')}>🐼 WWF – Nature & Wildlife</Text>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#001F3F',
    paddingHorizontal: 16
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD700'
  },
  quoteBox: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  quoteText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  refreshButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  refreshText: {
    color: '#FFD700',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#004d80'
  },
  activeTab: {
    backgroundColor: '#FFD700'
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  contentBox: {
    paddingBottom: 40,
    flexGrow: 1
  },
  imageCard: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700'
  },
  link: {
    fontSize: 16,
    color: '#00ccff',
    marginBottom: 12,
    textDecorationLine: 'underline'
  },
  book: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10
  }
});
