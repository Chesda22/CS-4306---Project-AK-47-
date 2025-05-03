// app/(tabs)/progress.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Progress() {
  const scheme      = useColorScheme();
  const isDark      = scheme === 'dark';
  const [history, setHistory]   = useState<any[]>([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const footprintsRef = query(
      collection(db, 'footprints'),
      orderBy('timestamp', 'desc'),
    );

    const unsubscribe = onSnapshot(
      footprintsRef,
      (snap) => {
        const entries = snap.docs.map((d) => {
          const data = d.data();
          data.timestamp =
            data.timestamp && typeof (data.timestamp as any).toDate === 'function'
              ? (data.timestamp as any).toDate()
              : new Date(data.timestamp ?? Date.now());
          return data;
        });

        setHistory(entries);

        setChartData({
          labels: entries.map((e) =>
            e.timestamp ? e.timestamp.toLocaleDateString() : '',
          ),
          datasets: [{ data: entries.map((e) => e.total ?? 0) }],
        });

        setLoading(false);
      },
      (err) => {
        console.error('Progress tab Firestore error:', err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const styles = StyleSheet.create({
    screen: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    card: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? '#1e1e1e' : '#f1f1f1',
      marginBottom: 12,
    },
    cardText: {
      color: isDark ? '#fff' : '#000',
    },
    small: {
      fontSize: 12,
      color: isDark ? '#ccc' : '#555',
    },
    empty: {
      color: isDark ? '#bbb' : '#888',
      marginTop: 32,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Carbon Footprint Over Time</Text>

      {loading && <ActivityIndicator />}

      {!loading && history.length === 0 && (
        <Text style={styles.empty}>
          You haven’t saved any footprints yet. Calculate one to see your
          progress chart 📈
        </Text>
      )}

      {!loading && history.length > 0 && (
        <>
          <LineChart
            data={chartData}
            width={SCREEN_WIDTH - 32}
            height={220}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundGradientFrom: isDark ? '#000' : '#fff',
              backgroundGradientTo: isDark ? '#000' : '#fff',
              decimalPlaces: 0,
              color: (o = 1) => `rgba(0, 200, 83, ${o})`,
              labelColor: () => (isDark ? '#fff' : '#000'),
              propsForDots: { r: '4' },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 8 }}
          />

          <Text style={[styles.title, { marginTop: 24 }]}>History</Text>

          {history.map((entry, i) => (
            <View
              key={entry.timestamp?.getTime?.() ?? i}
              style={styles.card}
            >
              <Text style={styles.cardText}>
                Date: {entry.timestamp?.toLocaleString()}
              </Text>
              <Text style={styles.cardText}>
                Total: {entry.total ?? 0} kg CO₂
              </Text>
              <Text style={styles.small}>
                Electricity: {entry.electricity} | Gasoline: {entry.gasoline} |
                Meat: {entry.meatConsumption} | Transport: {entry.publicTransport} | Recycled:{' '}
                {entry.recycledWaste}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
