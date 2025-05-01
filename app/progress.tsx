import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [history, setHistory] = useState<{ date: string; total: string }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('carbonHistory');
        const data = jsonValue != null ? JSON.parse(jsonValue) : [];

        // Sort by full timestamp
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(sorted.slice(-30).reverse());
      } catch (e) {
        console.error('Failed to load history', e);
      }
    };

    loadHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('carbonHistory');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const chartData = {
    labels: history.map((entry, i) => {
      const [date, time] = entry.date.split(' ');
      return i % 2 === 0 ? time : ''; // optional: reduce clutter
    }),
    datasets: [
      {
        data: history.map((entry) => parseFloat(entry.total)),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Carbon Footprint Progress</Text>

      {/* Chart Section */}
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

      {/* History Section */}
      {history.length === 0 ? (
        <Text style={styles.noData}>No progress yet. Start calculating!</Text>
      ) : (
        history.map((entry, index) => {
          const [date, ...timeParts] = entry.date.split(' ');
          const time = timeParts.join(' ');
          return (
            <View key={index} style={styles.entry}>
              <View>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.time}>{time}</Text>
              </View>
              <Text style={styles.value}>{entry.total} kg CO₂</Text>
            </View>
          );
        })
      )}

      {/* Clear Button */}
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear Progress</Text>
        </TouchableOpacity>
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
  clearButton: {
    marginTop: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
