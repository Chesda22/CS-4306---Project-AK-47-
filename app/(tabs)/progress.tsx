// app/(tabs)/progress.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';

/* ────────── Firebase setup ────────── */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProgressScreen() {
  const isDark = useColorScheme() === 'dark';

  const [loading, setLoading]   = useState(true);
  const [history, setHistory]   = useState<any[]>([]);   // full rows

  /* attach / detach listener when the tab gains / loses focus */
  useFocusEffect(
    useCallback(() => {
      const q = query(collection(db, 'footprints'), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, snap => {
        const rows = snap.docs
          .map(d => {
            const data = d.data();
            data.timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
            return data;
          })
          .reverse();                               // chronological ⬆️
        setHistory(rows);
        setLoading(false);
      });
      return unsub;                                 // cleanup on blur
    }, [])
  );

  /* quick derived data for the chart */
  const labels = history.map((_, i) => String(i + 1));
  const values = history.map(r => Number(r.total) || 0);

  /* ────────── UI states ────────── */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No footprint history yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* header */}
      <Text
        style={[
          styles.header,
          { color: isDark ? '#FFD700' : '#001F3F' },
        ]}
      >
        📈 Your Carbon‑Footprint Progress
      </Text>

      {/* chart */}
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={SCREEN_WIDTH - 32}
        height={200}
        yAxisSuffix=" kg"
        bezier
        chartConfig={{
          backgroundGradientFrom: isDark ? '#000' : '#fff',
          backgroundGradientTo  : isDark ? '#000' : '#fff',
          decimalPlaces: 0,
          color     : (o: number) => `rgba(0,200,83,${o})`,  // same green line
          labelColor: () => (isDark ? '#fff' : '#000'),
          propsForDots: { r: '4' },
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />

      {/* history list */}
      {history.map((h, i) => (
        <View
          key={h.timestamp?.getTime?.() ?? i}
          style={[
            styles.historyCard,
            { backgroundColor: isDark ? '#00224d' : '#e6f2ff' },
          ]}
        >
          <Text style={[styles.historyMain, { color: isDark ? '#fff' : '#001F3F' }]}>
            {h.timestamp.toLocaleString()} — {h.total} kg
          </Text>
          <Text style={[styles.historySmall, { color: isDark ? '#ccc' : '#333' }]}>
            Elec {h.electricity ?? h.electricity}, 
            Gas {h.gasoline}, 
            Meat {h.meatMeals ?? h.meatConsumption ?? '–'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ────────── styles ────────── */
const styles = StyleSheet.create({
  center : { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty  : { color: '#777', fontSize: 16 },
  header : { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  historyCard : { borderRadius: 8, padding: 10, marginBottom: 6 },
  historyMain : { fontWeight: '600' },
  historySmall: { fontSize: 12, marginTop: 2 },
});
