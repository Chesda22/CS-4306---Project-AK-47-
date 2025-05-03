// app/carbon-result.jsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions, useColorScheme,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, addDoc, onSnapshot, query,
  orderBy, serverTimestamp, getDocs, deleteDoc, doc, writeBatch,
} from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { generateTips } from '../utils/tips';
import firebaseConfig from '../firebaseConfig';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CarbonResult() {
  const { total, breakdown } = useLocalSearchParams();
  const scheme   = useColorScheme();
  const isDark   = scheme === 'dark';

  /* ---- parse breakdown ---- */
  let userData = null;
  try {
    userData = typeof breakdown === 'string' ? JSON.parse(breakdown) : breakdown;
    ['electricity', 'gasoline', 'meatMeals', 'publicTransport'].forEach(k => {
      if (typeof userData[k] !== 'number') throw new Error('bad field');
    });
  } catch { userData = null; }

  if (!userData)
    return (
      <View style={[styles.container, { backgroundColor: '#001F3F', justifyContent: 'center' }]}>
        <Text style={styles.warning}>⚠️ Unable to load your results.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>🔄 Go Back</Text>
        </TouchableOpacity>
      </View>
    );

  const totalValue = Number(total) || 0;
  const tips = generateTips(userData);

  /* ---- save once ---- */
  useEffect(() => {
    addDoc(collection(db, 'footprints'), {
      electricity: userData.electricity,
      gasoline: userData.gasoline,
      meatConsumption: userData.meatMeals,
      publicTransport: userData.publicTransport,
      recycledWaste: 0,
      total: totalValue,
      timestamp: serverTimestamp(),
    }).catch(e => console.warn('save fail', e));
  }, []);

  /* ---- animations ---- */
  const fade = useSharedValue(0), pulse = useSharedValue(0.85);
  useEffect(() => {
    fade.value = withTiming(1, { duration: 800 });
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.9, { duration: 400 })), -1, true
    );
  }, []);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const pulseStyle= useAnimatedStyle(() => ({ transform:[{ scale: pulse.value }] }));

  /* ---- listener ---- */
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [chartData,setChartData]= useState({ labels: [], datasets:[{data:[]}] });

  const refreshData = snap => {
    const rows = snap.docs.map(d => {
      const data=d.data();
      data.timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
      return data;
    });
    const chronological = [...rows].reverse();
    setHistory(rows);
    setChartData({
      labels: chronological.map((_,i)=>String(i+1)),
      datasets:[{ data: chronological.map(r=>r.total||0) }],
    });
    setLoading(false);
  };

  useEffect(()=> onSnapshot(query(collection(db,'footprints'),orderBy('timestamp','desc')),refreshData),[]);

  /* ---- clear all ---- */
  const [clearing,setClearing]=useState(false);
  const clearHistory = async () => {
    setClearing(true);
    try {
      const snap = await getDocs(collection(db,'footprints'));
      const batch = writeBatch(db);
      snap.forEach(d => batch.delete(doc(db,'footprints',d.id)));
      await batch.commit();
      setHistory([]);
      setChartData({ labels: [], datasets:[{data:[]}]});
    } finally {
      setClearing(false);
    }
  };

  /* ---- badge math (unchanged) ---- */
  const avgUS=16000,worldAvg=4000,pctUS=((totalValue-avgUS)/avgUS)*100,
        pctWorld=100-(totalValue/worldAvg)*100,trees=Math.ceil(totalValue/22);
  let badge='🔥 High Impact – Urgent Change Needed!';
  if(totalValue<3000)badge='🥇 Ultra Green Hero!';
  else if(totalValue<5000)badge='🏅 Green Champion!';
  else if(totalValue<8000)badge='🌱 Eco‑Warrior!';
  else if(totalValue<12000)badge='⚠️ Climate Aware – Room to Improve';
  else if(totalValue<16000)badge='🚨 Above Average – Take Action!';

  return (
    <ScrollView contentContainerStyle={[
      styles.container,{backgroundColor:isDark?'#000':'#001F3F'}]}>

      <Animated.View style={[styles.toast,fadeStyle]}>
        <Text style={styles.toastText}>🎉 Footprint calculated successfully!</Text>
      </Animated.View>
      <ConfettiCannon count={120} origin={{x:SCREEN_WIDTH/2,y:0}} autoStart fadeOut/>

      {/* total */}
      <Text style={styles.section}>🌍 Your Carbon Footprint</Text>
      <View style={styles.totalCard}>
        <Text style={styles.totalLbl}>Total</Text>
        <Text style={styles.totalVal}>{totalValue} kg CO₂</Text>
      </View>

      {/* breakdown */}
      <Text style={styles.sub}>📊 Breakdown</Text>
      <View style={[styles.totalCard,{alignItems:'flex-start',padding:22}]}>
        <Text style={styles.totalLbl}>• Electricity {userData.electricity}</Text>
        <Text style={styles.totalLbl}>• Gasoline {userData.gasoline}</Text>
        <Text style={styles.totalLbl}>• Meat meals {userData.meatMeals}</Text>
        <Text style={styles.totalLbl}>• Public T. {userData.publicTransport}</Text>

        <Text style={[styles.totalLbl,{marginTop:14}]}>💡 Tips:</Text>
        {tips.map((t,i)=>(
          <View key={i} style={styles.tipBox}>
            <Text style={styles.tipEmoji}>🌱</Text><Text style={styles.tipText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* badge */}
      <Animated.View style={[styles.badgeCard,pulseStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statRow}><Text style={styles.statLbl}>🇺🇸 vs U.S.</Text><Text style={styles.statVal}>{pctUS>0?pctUS.toFixed(1)+'% higher':'Below avg'}</Text></View>
        <View style={styles.statRow}><Text style={styles.statLbl}>🌍 vs World</Text><Text style={styles.statVal}>{Math.max(0,pctWorld).toFixed(1)}%</Text></View>
        <View style={styles.statRow}><Text style={styles.statLbl}>🌳 Trees/yr</Text><Text style={styles.statVal}>{trees}</Text></View>
      </Animated.View>

      {/* chart + history toggle */}
      <TouchableOpacity style={styles.btn} onPress={()=>setLoading(!loading)}>
        <Text style={styles.btnText}>{loading?'Show progress':'Hide progress'}</Text>
      </TouchableOpacity>

      {/* chart */}
      {!loading && history.length>0 && (
        <LineChart
          data={chartData} width={SCREEN_WIDTH-32} height={200} yAxisSuffix=" kg" bezier
          chartConfig={{
            backgroundGradientFrom:isDark?'#000':'#fff',
            backgroundGradientTo  :isDark?'#000':'#fff',
            decimalPlaces:0,
            color:o=>`rgba(0,200,83,${o})`,
            labelColor:()=>isDark?'#fff':'#000',
            propsForDots:{r:'4'},
          }}
          style={{marginVertical:8,borderRadius:8}}
        />
      )}

      {/* history list */}
      {loading&&<ActivityIndicator style={{marginTop:12}}/>}
      {!loading&&history.map((h,i)=>(
        <View key={h.timestamp?.getTime?.()??i} style={styles.historyCard}>
          <Text style={styles.historyMain}>{h.timestamp.toLocaleString()} — {h.total} kg</Text>
          <Text style={styles.historySmall}>Elec {h.electricity}, Gas {h.gasoline}, Meat {h.meatConsumption}</Text>
        </View>
      ))}

      {/* clear button */}
      <TouchableOpacity style={[styles.btn,{backgroundColor:'#b30000'}]} onPress={clearHistory} disabled={clearing}>
        <Text style={styles.btnText}>{clearing?'Clearing…':'🗑  Clear History'}</Text>
      </TouchableOpacity>

      {/* recalc */}
      <TouchableOpacity style={[styles.btn,{marginTop:12}]} onPress={()=>router.back()}>
        <Text style={styles.btnText}>🔄 Calculate Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---- styles (compact) ---- */
const styles = StyleSheet.create({
  container:{flexGrow:1,padding:20},
  warning:{color:'#FFD700',fontSize:18,textAlign:'center',marginBottom:12},
  toast:{backgroundColor:'#FFD700',padding:10,borderRadius:8,marginBottom:18},
  toastText:{textAlign:'center',fontWeight:'bold',color:'#001F3F'},
  section:{fontSize:26,fontWeight:'bold',color:'#FFD700',textAlign:'center',marginBottom:18},
  totalCard:{backgroundColor:'#FFD700',padding:20,borderRadius:14,alignItems:'center',marginBottom:20},
  totalLbl:{fontSize:16,color:'#001F3F',fontWeight:'600'},
  totalVal:{fontSize:28,fontWeight:'bold',color:'#001F3F'},
  sub:{fontSize:20,fontWeight:'bold',color:'#FFD700',textAlign:'center',marginBottom:8},
  badgeCard:{backgroundColor:'#004080',padding:18,borderRadius:12,borderWidth:1,borderColor:'#FFD700',marginBottom:20},
  badgeText:{color:'#00FF99',fontSize:20,fontWeight:'bold',textAlign:'center',marginBottom:10},
  statRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:6},
  statLbl:{color:'#FFD700',fontSize:16,fontWeight:'500'},
  statVal:{color:'#fff',fontSize:16,fontWeight:'600'},
  tipBox:{flexDirection:'row',alignItems:'flex-start',backgroundColor:'#003366',borderRadius:10,padding:8,marginTop:8},
  tipEmoji:{fontSize:18,marginRight:6}, tipText:{color:'#fff',flex:1,lineHeight:20},
  btn:{backgroundColor:'#007ACC',paddingVertical:14,borderRadius:10,alignItems:'center',marginTop:10},
  btnText:{color:'#fff',fontSize:16,fontWeight:'bold'},
  historyCard:{backgroundColor:'#00224d',borderRadius:8,padding:10,marginBottom:6},
  historyMain:{color:'#fff',fontWeight:'600'}, historySmall:{color:'#ccc',fontSize:12},
});
