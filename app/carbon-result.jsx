// app/carbon-result.jsx  ← replace the entire file with this
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
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
import ConfettiCannon from 'react-native-confetti-cannon';

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { LineChart } from 'react-native-chart-kit';
import { generateTips } from '../utils/tips';
import firebaseConfig from '../firebaseConfig';         // project root ➜ app ➜ this file

/* ---------- Firebase ---------- */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ---------- Layout consts ---------- */
const SCREEN_WIDTH = Dimensions.get('window').width;

/* ---------- Component ---------- */
export default function CarbonResult() {
  const { total, breakdown } = useLocalSearchParams();
  const scheme  = useColorScheme();
  const isDark  = scheme === 'dark';

  /* parse params */
  let userData = null;
  try {
    userData = typeof breakdown === 'string' ? JSON.parse(breakdown) : breakdown;
    if (
      !userData ||
      ['electricity', 'gasoline', 'meatMeals', 'publicTransport'].some(
        k => typeof userData[k] !== 'number'
      )
    ) throw new Error('invalid breakdown');
  } catch {
    userData = null;
  }

  if (!userData) {
    return (
      <View style={[styles.container, { backgroundColor: '#001F3F', justifyContent: 'center' }]}>
        <Text style={styles.warningText}>
          ⚠️ Unable to load your results. Please calculate again.
        </Text>
        <TouchableOpacity style={styles.calculateButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>🔄 Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalValue = Number(total) || 0;
  const tips       = generateTips(userData);

  /* ---------- write once ---------- */
  useEffect(() => {
    addDoc(collection(db, 'footprints'), {
      electricity:     userData.electricity,
      gasoline:        userData.gasoline,
      meatConsumption: userData.meatMeals,
      publicTransport: userData.publicTransport,
      recycledWaste:   0,
      total:           totalValue,
      timestamp:       serverTimestamp(),
    }).catch(e => console.warn('Firestore write failed', e));
  }, []);

  /* ---------- simple animations ---------- */
  const fade  = useSharedValue(0);
  const pulse = useSharedValue(0.85);
  useEffect(() => {
    fade.value  = withTiming(1, { duration: 800 });
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.9, { duration: 400 })),
      -1,
      true
    );
  }, []);
  const fadeStyle  = useAnimatedStyle(() => ({ opacity: fade.value }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  /* ---------- progress listener ---------- */
  const [loading,   setLoading]   = useState(true);
  const [history,   setHistory]   = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'footprints'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const rows = snap.docs.map(d => {
        const data = d.data();
        data.timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        return data;
      });

      /* 👉 build x‑axis labels as 1, 2, 3 … (oldest → newest) */
      const chronological = [...rows].reverse();              // oldest first
      const labels  = chronological.map((_, i) => String(i + 1));
      const totals  = chronological.map(r => Number(r.total) || 0);

      setHistory(rows);                                       // keep original order for list
      setChartData({ labels, datasets: [{ data: totals }] });
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ---------- eco badge logic ---------- */
  const avgUS = 16000, worldAvg = 4000;
  const pctUS = ((totalValue - avgUS) / avgUS) * 100;
  const pctWorld = 100 - (totalValue / worldAvg) * 100;
  const trees = Math.ceil(totalValue / 22);

  let badge = '🔥 High Impact – Urgent Change Needed!';
  if (totalValue < 3000)      badge = '🥇 Ultra Green Hero!';
  else if (totalValue < 5000) badge = '🏅 Green Champion!';
  else if (totalValue < 8000) badge = '🌱 Eco‑Warrior!';
  else if (totalValue < 12000)badge = '⚠️ Climate Aware – Room to Improve';
  else if (totalValue < 16000)badge = '🚨 Above Average – Take Action!';

  const panelH     = useSharedValue(0);
  const panelStyle = useAnimatedStyle(() => ({ height: panelH.value }));
  useEffect(() => { panelH.value = withTiming(panelOpen ? 420 : 0); }, [panelOpen]);

  /* ---------- render ---------- */
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#001F3F' },
      ]}
    >
      <Animated.View style={[styles.toast, fadeStyle]}>
        <Text style={styles.toastText}>🎉 Footprint calculated successfully!</Text>
      </Animated.View>
      <ConfettiCannon count={120} origin={{ x: SCREEN_WIDTH / 2, y: 0 }} autoStart fadeOut />

      <Text style={styles.sectionHeader}>🌍 Your Carbon Footprint</Text>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{totalValue} kg CO₂</Text>
      </View>

      <Text style={styles.chartHeader}>📊 Breakdown</Text>
      <View style={[styles.totalCard, { alignItems: 'flex-start', padding: 22 }]}>
        <Text style={styles.totalLabel}>• Electricity  {userData.electricity} kWh</Text>
        <Text style={styles.totalLabel}>• Gasoline    {userData.gasoline} gal</Text>
        <Text style={styles.totalLabel}>• Meat meals  {userData.meatMeals}</Text>
        <Text style={styles.totalLabel}>• Public T.   {userData.publicTransport} mi</Text>

        <Text style={[styles.totalLabel, { marginTop: 14 }]}>💡 Personalized tips:</Text>
        {tips.map((t, i) => (
          <View key={i} style={styles.tipBox}>
            <Text style={styles.tipEmoji}>🌱</Text>
            <Text style={styles.tipText}>{t}</Text>
          </View>
        ))}
      </View>

      <Animated.View style={[styles.badgeCard, pulseStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🇺🇸 vs U.S. avg</Text>
          <Text style={styles.statVal}>{pctUS > 0 ? pctUS.toFixed(1) + '% higher' : 'Below avg ✅'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌍 Better than world</Text>
          <Text style={styles.statVal}>{Math.max(0, pctWorld).toFixed(1)} %</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌳 Trees / yr to offset</Text>
          <Text style={styles.statVal}>{trees}</Text>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.calculateButton} onPress={() => setPanelOpen(!panelOpen)}>
        <Text style={styles.buttonText}>
          {panelOpen ? 'Hide my progress' : 'Show my progress'}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[{ overflow: 'hidden' }, panelStyle]}>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
        {!loading && history.length === 0 && (
          <Text style={styles.emptyText}>No previous footprints yet. Calculate again to start tracking!</Text>
        )}
        {!loading && history.length > 0 && (
          <>
            <LineChart
              data={chartData}
              width={SCREEN_WIDTH - 32}
              height={200}
              yAxisSuffix=" kg"
              bezier
              chartConfig={{
                backgroundGradientFrom: isDark ? '#000' : '#fff',
                backgroundGradientTo:   isDark ? '#000' : '#fff',
                decimalPlaces: 0,
                color:        (o = 1) => `rgba(0,200,83,${o})`,
                labelColor:   () => (isDark ? '#fff' : '#000'),
                propsForDots: { r: '4' },
              }}
              style={{ marginVertical: 8, borderRadius: 8 }}
            />

            {history.map((h, i) => (
              <View key={h.timestamp?.getTime?.() ?? i} style={styles.historyCard}>
                <Text style={styles.historyMain}>
                  {h.timestamp.toLocaleString()} — {h.total} kg CO₂
                </Text>
                <Text style={styles.historySmall}>
                  Elec {h.electricity}, Gas {h.gasoline}, Meat {h.meatConsumption}, PT {h.publicTransport}
                </Text>
              </View>
            ))}
          </>
        )}
      </Animated.View>

      <TouchableOpacity
        style={[styles.calculateButton, { marginTop: 18 }]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>🔄 Calculate Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- styles (unchanged except minor naming) ---------- */
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  warningText: { color: '#FFD700', fontSize: 18, textAlign: 'center', marginBottom: 12 },
  toast: { backgroundColor: '#FFD700', padding: 10, borderRadius: 8, marginBottom: 18 },
  toastText: { textAlign: 'center', fontWeight: 'bold', color: '#001F3F' },
  sectionHeader: {
    fontSize: 26, fontWeight: 'bold', color: '#FFD700', textAlign: 'center', marginBottom: 18,
  },
  totalCard: {
    backgroundColor: '#FFD700', padding: 20, borderRadius: 14, alignItems: 'center', marginBottom: 20,
  },
  totalLabel: { fontSize: 16, color: '#001F3F', fontWeight: '600', marginBottom: 4 },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#001F3F' },
  chartHeader: {
    fontSize: 20, fontWeight: 'bold', color: '#FFD700', textAlign: 'center', marginBottom: 8,
  },
  badgeCard: {
    backgroundColor: '#004080', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', marginBottom: 20,
  },
  badgeText: { fontSize: 20, fontWeight: 'bold', color: '#00FF99', textAlign: 'center', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  statLabel: { color: '#FFD700', fontSize: 16, fontWeight: '500' },
  statVal: { color: '#fff', fontSize: 16, fontWeight: '600' },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#003366', borderRadius: 10, padding: 8, marginTop: 8 },
  tipEmoji: { fontSize: 18, marginRight: 6 },
  tipText: { color: '#fff', flex: 1, lineHeight: 20 },
  calculateButton: { backgroundColor: '#007ACC', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 14 },
  historyCard: { backgroundColor: '#00224d', borderRadius: 8, padding: 10, marginBottom: 6 },
  historyMain: { color: '#fff', fontWeight: '600' },
  historySmall: { color: '#ccc', fontSize: 12 },
});
