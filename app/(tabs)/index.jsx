import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// 🚀 New wheel‑picker input
import NumberWheel from '@/components/NumberWheel';

const Layla = require('@/assets/images/Layla.png');
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CarbonCalculator() {
  // Form state
  const [electricity, setElectricity] = useState('');
  const [gasoline, setGasoline] = useState('');
  const [meatConsumption, setMeatConsumption] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [recycledWaste, setRecycledWaste] = useState('');

  const router = useRouter();

  /* 🐤 Layla floating animation */
  const laylaPosition = useSharedValue(0);
  useEffect(() => {
    laylaPosition.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1000 }),
        withTiming(8, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);
  const animatedLaylaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laylaPosition.value }],
  }));

  /* ✏️ Build wheel‑picker configs: [label, value, setter, min, max, step] */
  const rangeConfigs = [
    ['Electricity Usage (kWh/month)', electricity, setElectricity, 0, 2000, 10],
    ['Gasoline Usage (liters/month)', gasoline, setGasoline, 0, 500, 5],
    ['Meat Consumption (kg/month)', meatConsumption, setMeatConsumption, 0, 50, 1],
    ['Public Transport Usage (km/month)', publicTransport, setPublicTransport, 0, 1000, 10],
    ['Recycled Waste (kg/month)', recycledWaste, setRecycledWaste, 0, 200, 1],
  ];

  /* 🌍 Calculate emissions and navigate */
  const calculateEmissions = () => {
    const electricityValue = parseFloat(electricity) || 0;
    const gasolineValue = parseFloat(gasoline) || 0;
    const meatValue = parseFloat(meatConsumption) || 0;
    const transportValue = parseFloat(publicTransport) || 0;
    const recycledValue = parseFloat(recycledWaste) || 0;

    const totalEmissions =
      electricityValue * 0.92 +
      gasolineValue * 2.31 +
      meatValue * 3.3 +
      transportValue * 0.1 -
      recycledValue * 0.5;

    const breakdown = {
      electricity: electricityValue,
      gasoline: gasolineValue,
      meatMeals: meatValue,
      publicTransport: transportValue,
      recycledWaste: recycledValue,
    };

    router.push({
      pathname: '/carbon-result',
      params: {
        total: totalEmissions.toFixed(2),
        breakdown: JSON.stringify(breakdown),
      },
    });
  };

  return (
    <LinearGradient colors={['#7F7FD5', '#86A8E7', '#91EAE4']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 👋 Greeting bubble & animated avatar */}
        <View style={styles.headerContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.greeting}>Hi, I'm Layla!</Text>
            <Text style={styles.subText}>I will be your carbon calculator.</Text>
            <View style={styles.bubbleTail} />
          </View>
          <Animated.Image
            source={Layla}
            style={[styles.laylaImage, animatedLaylaStyle]}
          />
        </View>

        <Text style={styles.header}>🌿 Carbon Footprint Calculator</Text>

        {/* 📜 Animated wheel pickers */}
        <View style={styles.inputContainer}>
          {rangeConfigs.map(([label, val, setter, min, max, step], idx) => {
            const range = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step);
            return (
              <Animated.View
                key={label}
                entering={FadeIn.delay(idx * 120).duration(400)}
                style={styles.inputBox}
              >
                <Text style={styles.label}>{label}</Text>
                <NumberWheel
                  range={range}
                  value={val}
                  onChange={setter}
                  enterAnimation="slide" /* adds SlideInUp effect */
                />
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateEmissions}>
          <Text style={styles.buttonText}>Calculate 🌍</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

/* ───────────────────── Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 200,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 15,
    borderRadius: 20,
  },
  laylaImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  speechBubble: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    maxWidth: '60%',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#003366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginRight: 10,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -10,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    transform: [{ rotate: '180deg' }],
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  subText: {
    fontSize: 14,
    color: '#003366',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },
  inputBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
