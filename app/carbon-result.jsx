import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { generateTips } from '../utils/tips';
import ConfettiCannon from 'react-native-confetti-cannon';

const CarbonResult = () => {
  const { total, breakdown } = useLocalSearchParams();
  const userData = JSON.parse(breakdown);
  const tips = generateTips(userData);
  const scrollRef = useRef(null);

  // Theme detection
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Calculations
  const totalValue = parseFloat(total);
  const averageAmerican = 16000;
  const worldAverage = 4000;
  const percentAboveUS = ((totalValue - averageAmerican) / averageAmerican) * 100;
  const percentBetterThanWorld = 100 - (totalValue / worldAverage) * 100;
  const treesToOffset = Math.ceil(totalValue / 22);

  let badge = '';
  if (totalValue < 5000) badge = '🏅 Green Champion!';
  else if (totalValue < 10000) badge = '🌱 Eco-Warrior!';
  else badge = '🚨 Needs Improvement';

  // Success animation
  const successOpacity = useSharedValue(0);
  useEffect(() => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true });
    successOpacity.value = withTiming(1, { duration: 1500 });
  }, []);

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
  }));

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#001F3F' }]}>
      <Animated.View style={[styles.successMessage, successStyle]}>
        <Text style={styles.successText}>🎉 Congratulations! You calculated your footprint!</Text>
      </Animated.View>

      <ConfettiCannon count={80} origin={{ x: 200, y: 0 }} fadeOut />

      <Text style={styles.sectionHeader}>🌍 Your Carbon Footprint Report</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Footprint</Text>
        <Text style={styles.totalValue}>{total} kg CO₂</Text>
      </View>

      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownHeader}>Breakdown of Emissions:</Text>
        <Text style={styles.breakdownText}>{breakdown}</Text>
      </View>

      <View style={styles.badgeCard}>
        <Text style={styles.badgeText}>{badge}</Text>
        <Text style={styles.comparisonText}>
          {percentAboveUS > 0
            ? `📊 Your footprint is ${percentAboveUS.toFixed(1)}% higher than the average American.`
            : `✅ Your footprint is below the U.S. average!`}
        </Text>
        <Text style={styles.comparisonText}>
          🌍 You are doing better than {Math.max(0, percentBetterThanWorld.toFixed(1))}% of people in the world.
        </Text>
        <Text style={styles.comparisonText}>
          🌳 You would need to plant {treesToOffset} trees this year to offset your footprint.
        </Text>
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
    </ScrollView>
  );
};

export default CarbonResult;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  successMessage: {
    marginBottom: 20,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 10,
  },
  successText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#001F3F',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
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
    elevation: 6,
  },
  totalLabel: {
    fontSize: 18,
    color: '#001F3F',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#001F3F',
    marginTop: 8,
  },
  breakdownCard: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  breakdownHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  breakdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  tipHeader: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#003366',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  tipText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noTipText: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
  },
  badgeCard: {
    backgroundColor: '#004080',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  badgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF99',
    textAlign: 'center',
    marginBottom: 10,
  },
  comparisonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  calculateButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
