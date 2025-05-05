// app/(tabs)/progress.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Dimensions, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, query, orderBy, onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig';      // ← fixed path ✅

/* ────────── Firebase ────────── */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels]   = useState<string[]>([]);
  const [values, setValues]   = useState<number[]>([]);

  /* attach / detach on tab focus */
  useFocusEffect(
    useCallback(() => {
      const q = query(collection(db, 'footprints'), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(q, snap => {
        const rows = snap.docs.map(d => d.data()).reverse();
        setLabels(rows.map((_, i) => String(i + 1)));
        setValues(rows.map(r => Number(r.total)));   // ensure numeric
        setLoading(false);
      });
      return unsub;      // clean up on blur
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
        <Text style={styles.empty}>No history yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={SCREEN_WIDTH - 32}
        height={220}
        yAxisSuffix=" kg"
        bezier
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo:   '#fff',
          decimalPlaces: 0,
          color: (o) => `rgba(0,150,136,${o})`,
          labelColor:    () => '#000',
          propsForDots:  { r: '4' },
        }}
        style={{ borderRadius: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty : { color: '#777', fontSize: 16 },
});
