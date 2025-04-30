import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';

const tabs = ['Photos', 'Links', 'Books', 'Organizations'];

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Photos');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌍 Explore More About Climate Impact</Text>

      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.contentBox}>
        {activeTab === 'Photos' && (
          <>
            <Image source={{ uri: 'https://climate.nasa.gov/system/content_pages/main_images/50_earths_city_lights.jpg' }} style={styles.imageCard} />
            <Image source={{ uri: 'https://cdn.pixabay.com/photo/2022/03/10/15/52/smokestacks-7059454_1280.jpg' }} style={styles.imageCard} />
          </>
        )}

        {activeTab === 'Links' && (
          <>
            <Text style={styles.link} onPress={() => Linking.openURL('https://climate.nasa.gov/')}>NASA Climate</Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.ipcc.ch/')}>IPCC Reports</Text>
            <Text style={styles.link} onPress={() => Linking.openURL('https://www.epa.gov/climate-change')}>EPA on Climate</Text>
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
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 16
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366'
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
    backgroundColor: '#cce7ff'
  },
  activeTab: {
    backgroundColor: '#007acc'
  },
  tabText: {
    color: '#003366',
    fontWeight: '600'
  },
  contentBox: {
    paddingBottom: 40
  },
  imageCard: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16
  },
  link: {
    fontSize: 16,
    color: '#0066cc',
    marginBottom: 12,
    textDecorationLine: 'underline'
  },
  book: {
    fontSize: 16,
    color: '#003366',
    marginBottom: 10
  }
});
