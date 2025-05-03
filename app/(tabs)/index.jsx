import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const Layla = require('@/assets/images/Layla.png');
const SCREEN_WIDTH = Dimensions.get('window').width;

const CarbonCalculator = () => {
  const [electricity, setElectricity] = useState('');
  const [gasoline, setGasoline] = useState('');
  const [meatConsumption, setMeatConsumption] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [recycledWaste, setRecycledWaste] = useState('');

  const router = useRouter();
  const laylaPosition = useSharedValue(0);

  useEffect(() => {
    laylaPosition.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1000 }),
        withTiming(8, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedLaylaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laylaPosition.value }],
  }));

  const calculateEmissions = () => {
    const electricityValue = parseFloat(electricity) || 0;
    const gasolineValue = parseFloat(gasoline) || 0;
    const meatValue = parseFloat(meatConsumption) || 0;
    const transportValue = parseFloat(publicTransport) || 0;
    const recycledValue = parseFloat(recycledWaste) || 0;

    const electricityEmissions = electricityValue * 0.92;
    const gasolineEmissions = gasolineValue * 2.31;
    const meatEmissions = meatValue * 3.3;
    const transportEmissions = transportValue * 0.1;
    const recyclingReduction = recycledValue * 0.5;

    const totalEmissions = electricityEmissions + gasolineEmissions + meatEmissions + transportEmissions - recyclingReduction;

    const breakdown = {
      electricity: electricityValue,
      gasoline: gasolineValue,
      meatMeals: meatValue,
      publicTransport: transportValue,
      recycledWaste: recycledValue  // ✅ ADDED
    };

    router.push({
      pathname: '/carbon-result',
      params: {
        total: totalEmissions.toFixed(2),
        breakdown: JSON.stringify(breakdown)
      }
    });
  };

  return (
    <LinearGradient colors={['#7F7FD5', '#86A8E7', '#91EAE4']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.greeting}>Hi, I'm Layla!</Text>
            <Text style={styles.subText}>I will be your carbon calculator.</Text>
            <View style={styles.bubbleTail} />
          </View>
          <Animated.Image source={Layla} style={[styles.laylaImage, animatedLaylaStyle]} />
        </View>

        <Text style={styles.header}>🌿 Carbon Footprint Calculator</Text>

        <View style={styles.inputContainer}>
          {[
            { label: "Electricity Usage (kWh/month)", value: electricity, setter: setElectricity },
            { label: "Gasoline Usage (liters/month)", value: gasoline, setter: setGasoline },
            { label: "Meat Consumption (kg/month)", value: meatConsumption, setter: setMeatConsumption },
            { label: "Public Transport Usage (km/month)", value: publicTransport, setter: setPublicTransport },
            { label: "Recycled Waste (kg/month)", value: recycledWaste, setter: setRecycledWaste }
          ].map((item, index) => (
            <View key={index} style={styles.inputBox}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`Enter ${item.label.split(" ")[0].toLowerCase()}`}
                value={item.value}
                onChangeText={item.setter}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateEmissions}>
          <Text style={styles.buttonText}>Calculate 🌍</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CarbonCalculator;

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
    marginLeft: 10
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
    color: '#003366'
  },
  subText: {
    fontSize: 14,
    color: '#003366'
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
    marginBottom: 10,
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
    marginBottom: 5
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007ACC',
    paddingVertical: 5,
    color: '#333',
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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
