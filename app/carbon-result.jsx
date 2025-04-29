import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { generateTips } from '../utils/tips';

const CarbonResult = () => {
  const { total, breakdown } = useLocalSearchParams();
  const userData = JSON.parse(breakdown);
  const tips = generateTips(userData);

  // Animation for success message
  const successOpacity = useSharedValue(0);

  useEffect(() => {
    successOpacity.value = withTiming(1, { duration: 1500 });
  }, []);

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value
  }));

  return (
    <View style={styles.container}>
      {/* Success Animated Message */}
      <Animated.View style={[styles.successMessage, successStyle]}>
        <Text style={styles.successText}>🎉 Congratulations! You calculated your footprint!</Text>
      </Animated.View>

      <Text style={styles.sectionHeader}>🌍 Your Carbon Footprint Report</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Footprint</Text>
        <Text style={styles.totalValue}>{total} kg CO₂</Text>
      </View>

      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownHeader}>Breakdown of Emissions:</Text>
        <Text style={styles.breakdownText}>{breakdown}</Text>
      </View>

      <Text style={styles.tipHeader}>💡 Helpful Tips</Text>
      <View style={styles.tipCard}>
        {tips.length === 0 ? (
          <Text style={styles.noTipText}>No tips generated. Try different inputs!</Text>
        ) : (
          tips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>• {tip}</Text>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>🔄 Calculate Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CarbonResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#001F3F',
    justifyContent: 'center'
  },
  successMessage: {
    marginBottom: 20,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 10
  },
  successText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#001F3F',
    fontWeight: 'bold'
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20
  },
  totalCard: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  totalLabel: {
    fontSize: 18,
    color: '#001F3F',
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#001F3F',
    marginTop: 8
  },
  breakdownCard: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  breakdownHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10
  },
  breakdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22
  },
  tipHeader: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  tipCard: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  tipText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8
  },
  noTipText: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center'
  },
  calculateButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
