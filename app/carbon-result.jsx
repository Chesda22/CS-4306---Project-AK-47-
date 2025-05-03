// app/(tabs)/carbon-result.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { saveCarbonData } from '../firebaseService';
import { generateTips } from '../utils/tips';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';          // ← two levels up
import { LineChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CarbonResult() {
  /* ---------- params & theme ---------- */
  const { total, breakdown } = useLocalSearchParams();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  /* ---------- parse breakdown ---------- */
  let userData = null;
  try {
    userData = typeof breakdown === 'string' ? JSON.parse(breakdown) : breakdown;
    if (
      !userData ||
      typeof userData.electricity !== 'number' ||
      typeof userData.gasoline !== 'number' ||
      typeof userData.meatMeals !== 'number' ||
      typeof userData.publicTransport !== 'number'
    ) {
      throw new Error('missing fields');
    }
  } catch (e) {
    console.warn('Error parsing breakdown →', e);
    userData = null;
  }

  if (!userData) {
    return (
      <View style={[styles.container, { backgroundColor: '#001F3F', justifyContent: 'center' }]}>
        <Text style={{ color: '#FFD700', fontSize: 18, textAlign: 'center' }}>
          ⚠️ Unable to load your results. Please calculate again.
        </Text>
        <TouchableOpacity style={[styles.calculateButton, { marginTop: 20 }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>🔄 Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalValue = parseFloat(total ?? '0');
  const tips = generateTips(userData);

  /* ---------- save footprint once ---------- */
  useEffect(() => {
    (async () => {
      try {
        await saveCarbonData({
          electricity: userData.electricity,
          gasoline: userData.gasoline,
          meatConsumption: userData.meatMeals,
          publicTransport: userData.publicTransport,
          recycledWaste: 0,
          total: totalValue.toFixed(2),
          timestamp: Date.now(),
        });
      } catch (e) {
        console.warn('Failed saving footprint →', e);
      }
    })();
  }, []);

  /* ---------- confetti + badge animation ---------- */
  const successOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.8);
  useEffect(() => {
    successOpacity.value = withTiming(1, { duration: 1000 });
    badgeScale.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.95, { duration: 400 })),
      -1,
      true
    );
  }, []);
  const successStyle = useAnimatedStyle(() => ({ opacity: successOpacity.value }));
  const badgeAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.value }] }));

  /* ---------- progress listener ---------- */
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const q = query(collection(db, 'footprints'), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(
        q,
        snap => {
          const rows = snap.docs.map(d => {
            const data = d.data();
            data.timestamp =
              data.timestamp && typeof data.timestamp.toDate === 'function'
                ? data.timestamp.toDate()
                : new Date(data.timestamp ?? Date.now());
            return data;
          });
          setHistory(rows);
          setChartData({
            labels: rows.map(r => (r.timestamp ? r.timestamp.toLocaleDateString() : '')),
            datasets: [{ data: rows.map(r => r.total ?? 0) }],
          });
          setLoading(false);
        },
        err => {
          console.error('[CarbonResult] listener error', err);
          setLoading(false);
        }
      );
      return unsub;
    }, [])
  );

  /* ---------- eco badge text ---------- */
  const averageUS = 16000;
  const worldAvg = 4000;
  const percentAboveUS = ((totalValue - averageUS) / averageUS) * 100;
  const percentBetterWorld = 100 - (totalValue / worldAvg) * 100;
  const treesToOffset = Math.ceil(totalValue / 22);
  let badge = '🔥 High Impact – Urgent Change Needed!';
  if (totalValue < 3000) badge = '🥇 Ultra Green Hero!';
  else if (totalValue < 5000) badge = '🏅 Green Champion!';
  else if (totalValue < 8000) badge = '🌱 Eco‑Warrior!';
  else if (totalValue < 12000) badge = '⚠️ Climate Aware – Room to Improve';
  else if (totalValue < 16000) badge = '🚨 Above Average – Take Action!';

  /* ---------- panel animation height ---------- */
  const panelH = useSharedValue(0);
  const panelStyle = useAnimatedStyle(() => ({ height: panelH.value }));
  useEffect(() => {
    panelH.value = withTiming(panelOpen ? 420 : 0);
  }, [panelOpen]);

  /* ---------- render ---------- */
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#001F3F' },
      ]}
    >
      <Animated.View style={[styles.successMessage, successStyle]}>
        <Text style={styles.successText}>🎉 Footprint calculated successfully!</Text>
      </Animated.View>
      <ConfettiCannon count={100} origin={{ x: SCREEN_WIDTH / 2, y: 0 }} fadeOut autoStart />

      <Text style={styles.sectionHeader}>🌍 Your Carbon Footprint Report</Text>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Footprint</Text>
        <Text style={styles.totalValue}>{totalValue} kg CO₂</Text>
      </View>

      <Text style={styles.chartHeader}>📊 Emission Breakdown</Text>
      <View style={[styles.totalCard, { alignItems: 'flex-start', padding: 24 }]}>
        <Text style={styles.totalLabel}>• Electricity: {userData.electricity} kWh</Text>
        <Text style={styles.totalLabel}>• Gasoline: {userData.gasoline} gal</Text>
        <Text style={styles.totalLabel}>• Meat Meals: {userData.meatMeals}</Text>
        <Text style={styles.totalLabel}>• Public Transport: {userData.publicTransport} mi</Text>

        <Text style={[styles.totalLabel, { marginTop: 16 }]}>💡 Personalized Tips:</Text>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipBox}>
            <Text style={styles.tipEmoji}>🌱</Text>
            <Text style={styles.tipEngagingText}>{tip}</Text>
          </View>
        ))}
      </View>

      <Animated.View style={[styles.badgeCard, badgeAnimatedStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🇺🇸 vs. U.S. avg:</Text>
          <Text style={styles.statValue}>
            {percentAboveUS > 0 ? `${percentAboveUS.toFixed(1)} % higher` : 'Below avg ✅'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌍 Better than world:</Text>
          <Text style={styles.statValue}>{Math.max(0, percentBetterWorld).toFixed(1)} %</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🌳 Trees / yr to offset:</Text>
          <Text style={styles.statValue}>{treesToOffset}</Text>
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
          <Text style={{ color: isDark ? '#bbb' : '#888', textAlign: 'center', marginTop: 16 }}>
            No previous footprints yet. Calculate again to start tracking!
          </Text>
        )}
        {!loading && history.length > 0 && (
          <>
            <LineChart
              data={chartData}
              width={SCREEN_WIDTH - 32}
              height={200}
              yAxisSuffix=" kg"
              bezier
              chartConfig={{
                backgroundGradientFrom: isDark ? '#000' : '#fff',
                backgroundGradientTo: isDark ? '#000' : '#fff',
                decimalPlaces: 0,
                color: (o = 1) => `rgba(0, 200, 83, ${o})`,
                labelColor: () => (isDark ? '#fff' : '#000'),
                propsForDots: { r: '4' },
              }}
              style={{ marginVertical: 8, borderRadius: 8 }}
            />
            {history.map((h, i) => (
              <View key={h.timestamp?.getTime?.() ?? i} style={styles.historyCard}>
                <Text style={styles.historyText}>
                  {h.timestamp?.toLocaleString()} – {h.total ?? 0} kg CO₂
                </Text>
                <Text style={styles.small}>
                  Elec {h.electricity}, Gas {h.gasoline}, Meat {h.meatConsumption}, PT {h.publicTransport}, Rec {h.recycledWaste}
                </Text>
              </View>
            ))}
          </>
        )}
      </Animated.View>

      <TouchableOpacity style={[styles.calculateButton, { marginTop: 20 }]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>🔄 Calculate Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- styles (unchanged) ---------- */
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
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
  totalLabel: { fontSize: 16, color: '#001F3F', fontWeight: 'bold', marginBottom: 4 },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: '#001F3F', marginTop: 8 },
  chartHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeCard: {
    backgroundColor: '#004080',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  badgeText: { fontSize: 20, fontWeight: 'bold', color: '#00FF99', textAlign: 'center', marginBottom: 10 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#FFD700',
    borderBottomWidth: 0.5,
  },
  statLabel: { fontSize: 16, color: '#FFD700', fontWeight: '500' },
  statValue: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#003366', borderRadius: 10, padding: 10, marginBottom: 10 },
  tipEmoji: { fontSize: 20, marginRight: 8 },
  tipEngagingText: { fontSize: 15, color: '#FFFFFF', flex: 1, lineHeight: 22 },
  calculateButton: { backgroundColor: '#007ACC', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  historyCard: { padding: 10, borderRadius: 8, backgroundColor: '#00224d', marginBottom: 8 },
  historyText: { color: '#fff', fontWeight: '500' },
  small: { fontSize: 12, color: '#ccc' },
});
