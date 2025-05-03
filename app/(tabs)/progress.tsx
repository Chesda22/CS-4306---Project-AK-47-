import { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
// 🔴 Add Firebase Firestore imports:
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // adjust the import to your firebase config

// ... your other imports (chart library, styles, etc.)

export default function Progress() {
  const [history, setHistory] = useState([]);  
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    // 📡 Replace your existing fetch logic with an onSnapshot listener:
    const footprintsQuery = query(
      collection(db, 'footprints'),
      orderBy('timestamp', 'desc')  // ensure we get latest entries first
    );
    const unsubscribe = onSnapshot(footprintsQuery, (snapshot) => {
      const entries = snapshot.docs.map(doc => {
        const data = doc.data();
        // 🕒 Convert timestamp to JavaScript Date for consistency
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === 'function') {
            data.timestamp = data.timestamp.toDate();
          } else {
            // If timestamp is stored as number or string, convert to Date
            data.timestamp = new Date(data.timestamp);
          }
        }
        return data;
      });
      setHistory(entries);

      // 📝 Prepare chart data from entries
      const labels = entries.map(entry =>
        // format the date for the x-axis label (e.g., '12/31' or '31 Dec')
        entry.timestamp 
          ? entry.timestamp.toLocaleDateString() 
          : ''
      );
      const totals = entries.map(entry => entry.total || 0);
      setChartData({
        labels,
        datasets: [{ data: totals }]
      });
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);  // empty dependency – runs once on mount

  // 🔄 (Optional) If using a tab navigator that keeps screens mounted, 
  // consider adding a useFocusEffect to refresh data when the tab is shown.

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* 📊 Chart component */}
      {/* (Example using react-native-chart-kit) */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Carbon Footprint Over Time</Text>
      {/* Replace the following with your actual Chart component, passing chartData */}
      {
        /* <LineChart
             data={chartData}
             width={Dimensions.get('window').width - 32}
             height={220}
             chartConfig={...}
          /> 
        */
      }

      {/* 🕑 History list */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>History</Text>
      {history.map((entry, index) => (
        <View 
          key={entry.timestamp ? entry.timestamp.getTime() : index} 
          style={{ marginBottom: 12, padding: 12, backgroundColor: '#eee', borderRadius: 8 }}
        >
          {/* Format timestamp nicely */}
          <Text>Date: {entry.timestamp ? entry.timestamp.toLocaleString() : 'Unknown'}</Text>
          <Text>Total Carbon: {entry.total ?? 0} kg CO₂</Text>
          {/* You can also display breakdown if desired */}
          <Text style={{ fontSize: 12, color: '#555' }}>
            (Electricity: {entry.electricity}, Gasoline: {entry.gasoline}, Meat: {entry.meatConsumption}, Public Transport: {entry.publicTransport}, Recycled: {entry.recycledWaste})
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
