import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { generateTips } from '../utils/tips';
import ConfettiCannon from 'react-native-confetti-cannon';
import { PieChart } from 'react-native-chart-kit';

const CarbonResult = () => {
  const { total, breakdown } = useLocalSearchParams();
  const screenWidth = Dimensions.get('window').width;
  const scrollRef = useRef(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const breakdownSafe = breakdown ?? '{}'; // fallback if undefined
  let userData = null;
  try {
    userData = JSON.parse(breakdownSafe);
  } catch (err) {
    console.error('Failed to parse breakdown:', breakdown);
  }

  // Safe chart data fallback
  const chartData = userData ? [
    {
      name: 'Electricity',
      population: (userData.electricity ?? 0) * 0.92,
      color: '#FFD700',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
    {
      name: 'Gasoline',
      population: (userData.gasoline ?? 0) * 2.31,
      color: '#FF6F61',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
    {
      name: 'Meat',
      population: (userData.meatMeals ?? 0) * 3.3,
      color: '#6A5ACD',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
    {
      name: 'Transport',
      population: (userData.publicTransport ?? 0) * 0.1,
      color: '#20B2AA',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
  ] : [];

  // Tips
  let tips = userData ? generateTips(userData) : [];
  if (tips.length === 0) {
    tips = ['Try reducing electricity or fuel usage to improve your footprint.'];
  }

  // Animations
  const successOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.8);
  const chartOpacity = useSharedValue(0);
  const chartScale = useSharedValue(0.8);

  useEffect(() => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true });
    successOpacity.value = withTiming(1, { duration: 1000 });
    badgeScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.95, { duration: 400 })
      ),
      -1,
      true
    );
    chartOpacity.value = withTiming(1, { duration: 1000 });
    chartScale.value = withTiming(1, { duration: 1000 });
  }, []);

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [{ scale: chartScale.value }],
  }));

  // Calculations
  const totalValue = parseFloat(total ?? '0');
  const averageAmerican = 16000;
  const worldAverage = 4000;
  const percentAboveUS = ((totalValue - averageAmerican) / averageAmerican) * 100;
  const percentBetterThanWorld = 100 - (totalValue / worldAverage) * 100;
  const treesToOffset = Math.ceil(totalValue / 22);

  let badge = '';
  if (totalValue < 3000) {
    badge = '🥇 Ultra Green Hero!';
  } else if (totalValue < 5000) {
    badge = '🏅 Green Champion!';
  } else if (totalValue < 8000) {
    badge = '🌱 Eco-Warrior!';
  } else if (totalValue < 12000) {
    badge = '⚠️ Climate Aware – Room to Improve';
  } else if (totalValue < 16000) {
    badge = '🚨 Above Average – Take Action!';
  } else {
    badge = '🔥 High Impact – Urgent Change Needed!';
  }


  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#001F3F' },
      ]}
    >
      <Animated.View style={[styles.successMessage, successStyle]}>
        <Text style={styles.successText}>🎉 Congratulations! You calculated your footprint!</Text>
      </Animated.View>

      <ConfettiCannon
        count={100}
        origin={{ x: 200, y: 0 }}
        fadeOut
        autoStart
        explosionSpeed={300}
        fallSpeed={3000}
      />

      <Text style={styles.sectionHeader}>🌍 Your Carbon Footprint Report</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Footprint</Text>
        <Text style={styles.totalValue}>{totalValue} kg CO₂</Text>
      </View>

      <Text style={styles.chartHeader}>📊 Emission Breakdown</Text>
      {userData && (
        <Animated.View style={[{ alignItems: 'center', marginBottom: 30 }, chartAnimatedStyle]}>
          <PieChart
            data={chartData}
            width={screenWidth - 20}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#001F3F',
              backgroundGradientTo: '#001F3F',
              color: () => '#fff',
              labelColor: () => '#fff',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </Animated.View>
      )}

      <Animated.View style={[styles.badgeCard, badgeAnimatedStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🇺🇸 Compared to U.S. Average:</Text>
          <Text style={styles.statValue}>
            {percentAboveUS > 0
              ? `${percentAboveUS.toFixed(1)}% Higher`
              : `Below 
              Average ✅`}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌍 Better than World:</Text>
          <Text style={styles.statValue}>
            {Math.max(0, percentBetterThanWorld.toFixed(1))}%
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌳 Trees Needed:</Text>
          <Text style={styles.statValue}>{treesToOffset} / year</Text>
        </View>
      </Animated.View>

      <Text style={styles.tipHeader}>💡 Helpful Tips</Text>
      <View style={styles.tipCard}>
        {tips.map((tip, index) => (
          <Text key={index} style={styles.tipText}>• {tip}</Text>
        ))}
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
  chartHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -10,
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#FFD700',
    borderBottomWidth: 0.5,
  },
  statLabel: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
  calculateButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
