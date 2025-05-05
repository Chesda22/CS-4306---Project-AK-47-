// app/carbon-result.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { generateTips } from '../utils/tips';
import { saveFootprint } from '../utils/saveFootprint';
import firebaseConfig from '../firebaseConfig';

// ───────────────── Firebase ─────────────────
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CarbonResult() {
  const { total, breakdown } = useLocalSearchParams();
  const isDark = useColorScheme() === 'dark';

  // Parse breakdown
  let userData = null;
  try {
    userData = typeof breakdown === 'string' ? JSON.parse(breakdown) : breakdown;
    ['electricity', 'gasoline', 'meatMeals', 'publicTransport'].forEach((k) => {
      if (typeof userData[k] !== 'number') throw new Error('bad field');
    });
  } catch {
    userData = null;
  }

  if (!userData) {
    return (
      <View style={[styles.container, { backgroundColor: '#001F3F', justifyContent: 'center' }]}>
        <Text style={styles.warning}>⚠️ Unable to load your results.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>🔄 Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalValue = Number(total) || 0;
  const tips = generateTips(userData);

  // Save once
  useEffect(() => {
    saveFootprint({ total: totalValue.toFixed(2), breakdown: userData });
  }, []);

  /* animations */
  const fade = useSharedValue(0);
  const pulse = useSharedValue(0.85);
  useEffect(() => {
    fade.value = withTiming(1, { duration: 800 });
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.9, { duration: 400 })),
      -1,
      true,
    );
  }, []);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  /* history */
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    const q = query(collection(db, 'footprints'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data();
        data.timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        return data;
      });
      const chronological = [...rows].reverse();
      setHistory(rows);
      setChartData({
        labels: chronological.map((_, i) => String(i + 1)),
        datasets: [{ data: chronological.map((r) => r.total || 0) }],
      });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* clear */
  const [clearing, setClearing] = useState(false);
  const clearHistory = async () => {
    setClearing(true);
    try {
      const snap = await getDocs(collection(db, 'footprints'));
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(doc(db, 'footprints', d.id)));
      await batch.commit();
      setHistory([]);
      setChartData({ labels: [], datasets: [{ data: [] }] });
      console.log('🗑️ Cleared footprint records');
    } finally {
      setClearing(false);
    }
  };

  /* badge */
  const avgUS = 16000;
  const worldAvg = 4000;
  const pctUS = ((totalValue - avgUS) / avgUS) * 100;
  const pctWorld = 100 - (totalValue / worldAvg) * 100;
  const trees = Math.ceil(totalValue / 22);
  let badge = '🔥 High Impact – Urgent Change Needed!';
  if (totalValue < 3000) badge = '🥇 Ultra Green Hero!';
  else if (totalValue < 5000) badge = '🏅 Green Champion!';
  else if (totalValue < 8000) badge = '🌱 Eco‑Warrior!';
  else if (totalValue < 12000) badge = '⚠️ Climate Aware – Room to Improve';
  else if (totalValue < 16000) badge = '🚨 Above Average – Take Action!';

  /* UI */
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#001F3F' }]}>
      {/* Toast */}
      <Animated.View style={[styles.toast, fadeStyle]}>
        <Text style={styles.toastText}>🎉 Footprint saved!</Text>
      </Animated.View>
      <ConfettiCannon count={120} origin={{ x: SCREEN_WIDTH / 2, y: 0 }} autoStart fadeOut />

      {/* Total */}
      <Text style={styles.section}>🌍 Your Carbon Footprint</Text>
      <View style={styles.totalCard}>
        <Text style={styles.totalLbl}>Total</Text>
        <Text style={styles.totalVal}>{totalValue} kg CO₂</Text>
      </View>

      {/* Breakdown */}
      <Text style={styles.sub}>📊 Breakdown</Text>
      <View style={[styles.totalCard, { alignItems: 'flex-start', padding: 22 }]}>
        <Text style={styles.totalLbl}>• Electricity {userData.electricity}</Text>
        <Text style={styles.totalLbl}>• Gasoline {userData.gasoline}</Text>
        <Text style={styles.totalLbl}>• Meat meals {userData.meatMeals}</Text>
        <Text style={styles.totalLbl}>• Public T. {userData.publicTransport}</Text>

        <Text style={[styles.totalLbl, { marginTop: 14 }]}>💡 Tips:</Text>
        {tips.map((t, i) => (
          <View key={i} style={styles.tipBox}>
            <Text style={styles.tipEmoji}>🌱</Text>
            <Text style={styles.tipText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Badge */}
      <Animated.View style={[styles.badgeCard, pulseStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>🇺🇸 vs U.S.</Text>
          <Text style={styles.statVal}>{pctUS > 0 ? pctUS.toFixed(1) + '% higher' : 'Below avg'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>🌍 vs World</Text>
          <Text style={styles.statVal}>{Math.max(0, pctWorld).toFixed(1)}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>🌳 Trees/yr</Text>
          <Text style={styles.statVal}>{trees}</Text>
        </View>
      </Animated.View>

      {/* Chart toggle */}
      <TouchableOpacity style={styles.btn} onPress={() => setLoading(!loading)}>
        <Text style={styles.btnText}>{loading ? 'Show progress' : 'Hide progress'}</Text>
      </TouchableOpacity>

      {/* Chart */}
      {!loading && history.length > 0 && (
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - 32}
          height={200}
          yAxisSuffix=" kg"
          bezier
          chartConfig={{
            backgroundGradientFrom: isDark ? '#000' : '#fff',
            backgroundGradientTo: isDark ? '#000
