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

const Layla = require("@/assets/images/Layla.jpeg");

const CarbonCalculator = () => {
  const [electricity, setElectricity] = useState('');
  const [gasoline, setGasoline] = useState('');
  const [meatConsumption, setMeatConsumption] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [recycledWaste, setRecycledWaste] = useState('');

  // Layla floating animation
  const laylaPosition = useSharedValue(0);
  useEffect(() => {
    laylaPosition.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);
  const animatedLaylaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laylaPosition.value }],
  }));

  // ─── Handler: calculateEmissions ───────────────────
  const calculateEmissions = () => {
    const eEm = parseFloat(electricity) * 0.92   || 0;
    const gEm = parseFloat(gasoline)    * 2.31   || 0;
    const mEm = parseFloat(meatConsumption) * 3.3 || 0;
    const pEm = parseFloat(publicTransport) * 0.1 || 0;
    const rEm = parseFloat(recycledWaste) * 0.5  || 0;

    const totalEmissions = eEm + gEm + mEm + pEm - rEm;

    const userData = {
      electricity:    parseFloat(electricity),
      gasoline:       parseFloat(gasoline),
      meatMeals:      parseFloat(meatConsumption),
      publicTransport:parseFloat(publicTransport),
      recycles:       parseFloat(recycledWaste) > 0,
    };

    router.push({
      pathname: '/CarbonResult',
      params: {
        total:     totalEmissions.toFixed(2),
        breakdown: JSON.stringify(userData)
      }
    });
  };  // ← **CLOSE** calculateEmissions here

  // ─── Component render ───────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={styles.sectionHeader}>🧮 Carbon Footprint Calculator</Text>

      {[
        ['🔌 Electricity (kWh)', electricity, setElectricity],
        ['⛽ Gasoline (L)',     gasoline,    setGasoline],
        ['🍖 Meat (kg)',        meatConsumption, setMeatConsumption],
        ['🚇 Public Transport (km)', publicTransport, setPublicTransport],
        ['♻️ Recycled Waste (kg)', recycledWaste, setRecycledWaste]
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
};  // ← **CLOSE** CarbonCalculator here

export default CarbonCalculator;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundCo
