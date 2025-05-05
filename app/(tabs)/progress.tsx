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

  const [loading, setLoading] = useState(true);
  const [labels, setLabels]   = useState<string[]>([]);
  const [values, setValues]   = useState<number[]>([]);

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
          .reverse();                                     // chronological ⬆️
        setLabels(rows.map((_, i) => String(i + 1)));
        setValues(rows.map(r => Number(r.total) || 0));
        setLoading(false);
      });
      return unsub;                                       // cleanup on blur
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (values.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No footprint history yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text
        style={[
          styles.header,
          { color: isDark ? '#FFD700' : '#001F3F' },
        ]}
      >
        📈 Your Carbon‑Footprint Progress
      </Text>

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
          color     : (o: number) => `rgba(0,200,83,${o})`, // same green line
          labelColor: () => (isDark ? '#fff' : '#000'),
          propsForDots: { r: '4' },
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center : { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty  : { color: '#777', fontSize: 16 },
  header : { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
});
