// app/(tabs)/index.jsx

import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';

const Layla = require('@/assets/images/Layla.jpeg');

const CarbonCalculator = () => {
  const [electricity, setElectricity]       = useState('');
  const [gasoline, setGasoline]             = useState('');
  const [meatConsumption, setMeatConsumption] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [recycledWaste, setRecycledWaste]   = useState('');

  // Layla floating animation
  const laylaPosition = useSharedValue(0);
  useEffect(() => {
    laylaPosition.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5,  { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);
  const animatedLaylaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laylaPosition.value }]
  }));

  // ─── calculateEmissions handler ────────────────────────
  const calculateEmissions = () => {
    const eEm = parseFloat(electricity)     * 0.92 || 0;
    const gEm = parseFloat(gasoline)        * 2.31 || 0;
    const mEm = parseFloat(meatConsumption) * 3.3  || 0;
    const pEm = parseFloat(publicTransport) * 0.1  || 0;
    const rEm = parseFloat(recycledWaste)   * 0.5  || 0;

    const totalEmissions = eEm + gEm + mEm + pEm - rEm;

    const userData = {
      electricity,
      gasoline,
      meatMeals:       meatConsumption,
      publicTransport,
      recycles: parseFloat(recycledWaste) > 0
    };

    router.push({
      pathname: '/CarbonResult',
      params: {
        total:     totalEmissions.toFixed(2),
        breakdown: JSON.stringify(userData)
      }
    });
  };  // ← CLOSE calculateEmissions here

  // ─── component render ─────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Layla Greeting */}
      <View style={styles.headerContainer}>
        <View style={styles.speechBubble}>
          <Text style={styles.greeting}>Hi, I'm Layla!</Text>
          <Text style={styles.subText}>I will be your carbon calculator.</Text>
          <View style={styles.bubbleTail}/>
        </View>
        <Animated.Image
          source={Layla}
          style={[styles.laylaImage, animatedLaylaStyle]}
        />
      </View>

      <Text style={styles.sectionHeader}>🧮 Carbon Footprint Calculator</Text>

      {[
        ['🔌 Electricity (kWh)',     electricity,      setElectricity],
        ['⛽ Gasoline (L)',          gasoline,         setGasoline],
        ['🍖 Meat (kg)',            meatConsumption,  setMeatConsumption],
        ['🚇 Transport (km)',       publicTransport,  setPublicTransport],
        ['♻️ Recycled (kg)',         recycledWaste,    setRecycledWaste]
      ].map(([label, val, setter]) => (
        <View key={label} style={styles.card}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter value"
            value={val}
            onChangeText={setter}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculateEmissions}
      >
        <Text style={styles.buttonText}>🚀 Calculate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};  // ← CLOSE CarbonCalculator here

export default CarbonCalculator;

const styles = StyleSheet.create({
  container:         { flexGrow: 1, padding: 20, backgroundColor: '#ADD8E6', justifyContent: 'center' },
  headerContainer:   { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  laylaImage:        { width: 60, height: 60, borderRadius: 30, marginLeft: 10 },
  speechBubble:      { backgroundColor: 'white', padding: 12, borderRadius: 12, maxWidth: '60%',
                       borderWidth: 1, borderColor: '#003366', shadowColor: '#000',
                       shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2,
                       shadowRadius: 4, marginRight: 10 },
  bubbleTail:        { position: 'absolute', bottom: -8, right: 15,
                       borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10,
                       borderLeftColor: 'transparent', borderRightColor: 'transparent',
                       borderTopColor: 'white', transform: [{ rotate: '180deg' }] },
  greeting:          { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  subText:           { fontSize: 14, color: '#003366' },
  sectionHeader:     { fontSize: 28, fontWeight: 'bold', color: '#003366', marginBottom: 20, textAlign: 'center' },
  card:              { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 12,
                       borderWidth: 1, borderColor: '#ccc', shadowColor: '#000',
                       shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
                       shadowRadius: 4, elevation: 2 },
  inputLabel:        { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#003366' },
  input:             { backgroundColor: '#f0f8ff', padding: 10, borderRadius: 8,
                       borderWidth: 1, borderColor: '#ccc', fontSize: 16 },
  calculateButton:   { backgroundColor: '#003366', paddingVertical: 14, borderRadius: 10,
                       alignItems: 'center', marginTop: 20, shadowColor: "#000",
                       shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3,
                       shadowRadius: 4, elevation: 5 },
  buttonText:        { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
