// app/(tabs)/Explore.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  ImageBackground
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const tabs = ['Links', 'Research', 'Organizations'];
const screenWidth = Dimensions.get('window').width;

const background = { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1050&q=80' };

const Explore = () => {
const [activeTab, setActiveTab] = useState('Links');

const openURL = (url) => Linking.openURL(url);

  const links = [
    { label: 'EPA Carbon Footprint Facts', url: 'https://www.epa.gov/ghgemissions/overview-greenhouse-gases' },
    { label: 'NASA Climate Change', url: 'https://climate.nasa.gov/' },
    { label: 'UN Climate Action', url: 'https://www.un.org/en/climatechange' },
    { label: 'Our World in Data – CO₂ and Greenhouse Gases', url: 'https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions' },
    ];

  const research = [
    { label: 'IPCC Sixth Assessment Report', url: 'https://www.ipcc.ch/assessment-report/ar6/' },
    { label: 'Global Carbon Budget 2023', url: 'https://essd.copernicus.org/articles/15/5301/2023/' },
    { label: 'Nature: Emissions from land-use change', url: 'https://www.nature.com/articles/s41586-020-03138-w' },
    { label: 'Science: Global methane budget', url: 'https://www.science.org/doi/10.1126/science.abf1464' },
    { label: 'PNAS: Tipping elements in Earth’s climate system', url: 'https://www.pnas.org/content/105/6/1786' },
    { label: 'Harvard: Climate change and public health', url: 'https://www.hsph.harvard.edu/c-change/subtopics/climate-change-and-health/' },
    { label: 'Climate Policy Journal', url: 'https://www.tandfonline.com/toc/tcpo20/current' },
    { label: 'UNEP Emissions Gap Report', url: 'https://www.unep.org/resources/emissions-gap-report-2023' },
    { label: 'Nature Energy: Decarbonizing energy systems', url: 'https://www.nature.com/nenergy/' },
    { label: 'Oxford Net Zero Research Initiative', url: 'https://netzeroclimate.org/' },
  ];

  const organizations = [
    { name: 'Greenpeace', url: 'https://www.greenpeace.org/', icon: <FontAwesome5 name="leaf" size={24} color="#00FF99" /> },
    { name: 'WWF', url: 'https://www.worldwildlife.org/', icon: <FontAwesome5 name="paw" size={24} color="#FFD700" /> },
    { name: 'Friends of the Earth', url: 'https://foe.org/', icon: <MaterialCommunityIcons name="earth" size={24} color="#66CCFF" /> },
    { name: 'Sierra Club', url: 'https://www.sierraclub.org/', icon: <FontAwesome5 name="tree" size={24} color="#66FF66" /> },
    { name: '350.org', url: 'https://350.org/', icon: <FontAwesome5 name="globe" size={24} color="#FFFFFF" /> },
    { name: 'Rainforest Alliance', url: 'https://www.rainforest-alliance.org/', icon: <FontAwesome5 name="seedling" size={24} color="#44FFAA" /> },
  ];

  const renderTabContent = () => {
    if (activeTab === 'Links') {
      return links.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => openURL(item.url)} style={styles.card}>
          <Text style={styles.cardText}>🔗 {item.label}</Text>
        </TouchableOpacity>
      ));
    } else if (activeTab === 'Research') {
      return research.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => openURL(item.url)} style={styles.card}>
          <Text style={styles.cardText}>📘 {item.label}</Text>
        </TouchableOpacity>
      ));
    } else if (activeTab === 'Organizations') {
      return organizations.map((org, i) => (
        <TouchableOpacity key={i} onPress={() => openURL(org.url)} style={styles.orgCard}>
          <View style={styles.iconWrap}>{org.icon}</View>
          <Text style={styles.orgText}>{org.name}</Text>
        </TouchableOpacity>
      ));
    }
  };

  return (
    <ImageBackground source={background} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>🌱 Explore Sustainability</Text>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollWrap}>
          {renderTabContent()}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    backgroundColor: '#004080',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollWrap: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
  },
  orgCard: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  iconWrap: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  orgText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
