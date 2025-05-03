// app/progress.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchCarbonHistory } from '../firebaseService';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCarbonHistory();

      const sorted = [...data].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setHistory(sorted.slice(-30).reverse());
    };

    load();
  }, []);

  const chartData = {
    labels: history.map((entry, i) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return i % 2 === 0 ? time : '';
    }),
    datasets: [
      {
        data: history.map((entry) => parseFloat(entry.total) || 0),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Carbon Footprint Progress</Text>

      {history.length > 0 && (
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH * 0.9}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#91EAE4',
            backgroundGradientTo: '#7F7FD5',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#007ACC',
            },
          }}
          bezier
          style={styles.chart}
        />
      )}

      {history.length === 0 ? (
        <Text style={styles.noData}>No progress yet. Start calculating!</Text>
      ) : (
        history.map((entry, index) => {
          const date = new Date(entry.timestamp);
          return (
            <View key={index} style={styles.entry}>
              <View>
                <Text style={styles.date}>{date.toLocaleDateString()}</Text>
                <Text style={styles.time}>{date.toLocaleTimeString()}</Text>
              </View>
              <Text style={styles.value}>{entry.total} kg CO₂</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 90,
    paddingBottom: 300,
    paddingHorizontal: 20,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  noData: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 30,
  },
  chart: {
    marginBottom: 20,
    borderRadius: 16,
  },
  entry: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  date: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'right',
  },
});
