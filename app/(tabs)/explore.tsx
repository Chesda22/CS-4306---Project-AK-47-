import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_600SemiBold, Inter_400Regular } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

const tabs = ['Links', 'Books', 'Organizations'];
const screenWidth = Dimensions.get('window').width;

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Links');

  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <LinearGradient colors={['#001F3F', '#004d80', '#0074D9']} style={styles.container}>
      <Text style={styles.header}>🌱 Explore Sustainability Resources</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeIn.duration(400)}>
          {activeTab === 'Links' && (
            <>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://climate.nasa.gov/')}>🌐 NASA Climate Change</Text>
                <Text style={styles.description}>Learn how Earth's climate is changing, and explore satellite data.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.ipcc.ch/')}>📘 IPCC Climate Reports</Text>
                <Text style={styles.description}>Scientific assessments from the Intergovernmental Panel on Climate Change.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.epa.gov/climate-change')}>🏛 U.S. EPA Climate Info</Text>
                <Text style={styles.description}>Official government data and policy on climate change.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions')}>📊 CO₂ Data – Our World in Data</Text>
                <Text style={styles.description}>Global carbon emission stats and comparisons.</Text>
              </View>
            </>
          )}

          {activeTab === 'Books' && (
            <>
              <View style={styles.card}>
                <Text style={styles.title}>📘 This Changes Everything – Naomi Klein</Text>
                <Text style={styles.description}>A bold call to action on capitalism vs. the climate.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>📗 The Uninhabitable Earth – David Wallace-Wells</Text>
                <Text style={styles.description}>Eye-opening narrative on worst-case scenarios if we don't act.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>📙 How to Avoid a Climate Disaster – Bill Gates</Text>
                <Text style={styles.description}>A practical plan for reaching net-zero emissions globally.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>📕 The Future We Choose – Christiana Figueres</Text>
                <Text style={styles.description}>Two paths humanity could take — and how to choose the right one.</Text>
              </View>
            </>
          )}

          {activeTab === 'Organizations' && (
            <>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://350.org')}>🌍 350.org</Text>
                <Text style={styles.description}>A global grassroots movement to end fossil fuels and build a world of community-led renewable energy.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.greenpeace.org')}>🌿 Greenpeace</Text>
                <Text style={styles.description}>An international organization using direct action to fight for the environment.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://www.wwf.org')}>🐼 WWF</Text>
                <Text style={styles.description}>Protecting nature, wildlife, and supporting sustainability worldwide.</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.link} onPress={() => Linking.openURL('https://earthday.org')}>🌎 EarthDay.org</Text>
                <Text style={styles.description}>Coordinators of Earth Day; promote climate literacy and local action.</Text>
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFD700',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#ffffffcc',
    fontFamily: 'Inter_400Regular',
  },
  activeTabText: {
    color: '#003366',
    fontWeight: 'bold',
  },
  scroll: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#002244',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  link: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#00ccff',
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#CCCCCC',
  },
});
