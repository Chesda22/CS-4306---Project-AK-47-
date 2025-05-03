// app/(tabs)/progress.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, ActivityIndicator, Dimensions,
  useColorScheme, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection, query, orderBy, onSnapshot,
  getDocs, deleteDoc, doc, writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Progress() {
  const isDark = useColorScheme() === 'dark';

  const [history,setHistory]   = useState<any[]>([]);
  const [chart,setChart]       = useState({ labels:[], datasets:[{data:[]}]});
  const [loading,setLoading]   = useState(true);
  const [clearing,setClearing] = useState(false);

  /* listener */
  const attach = ()=> onSnapshot(
    query(collection(db,'footprints'),orderBy('timestamp','desc')),
    snap=>{
      const rows=snap.docs.map(d=>{
        const data=d.data();
        data.timestamp= data.timestamp?.toDate ? data.timestamp.toDate():new Date();
        return data;
      });
      setHistory(rows);
      const chrono=[...rows].reverse();
      setChart({labels:chrono.map((_,i)=>String(i+1)), datasets:[{data:chrono.map(r=>r.total??0)}]});
      setLoading(false);
    },
    err=>{console.error('listener',err);setLoading(false);}
  );

  useFocusEffect(React.useCallback(()=>{setLoading(true); return attach();},[]));

  /* clear */
  const clearAll=async()=>{
    setClearing(true);
    try{
      const snap=await getDocs(collection(db,'footprints'));
      const batch=writeBatch(db);
      snap.forEach(d=>batch.delete(doc(db,'footprints',d.id)));
      await batch.commit();
      setHistory([]); setChart({labels:[],datasets:[{data:[]}]} );
    }finally{ setClearing(false); }
  };

  /* styles */
  const s=StyleSheet.create({
    scr:{flexGrow:1,padding:16,backgroundColor:isDark?'#000':'#fff'},
    title:{fontSize:20,fontWeight:'700',color:isDark?'#fff':'#000',marginBottom:8},
    card:{padding:12,borderRadius:8,backgroundColor:isDark?'#1e1e1e':'#f1f1f1',marginBottom:12},
    cText:{color:isDark?'#fff':'#000'},
    small:{fontSize:12,color:isDark?'#ccc':'#555'},
    empty:{color:isDark?'#bbb':'#888',marginTop:32,textAlign:'center'},
    btn:{backgroundColor:'#b30000',paddingVertical:12,borderRadius:8,alignItems:'center',marginTop:12},
    btnText:{color:'#fff',fontWeight:'600',fontSize:16},
  });

  return(
    <ScrollView contentContainerStyle={s.scr}>
      <Text style={s.title}>Carbon Footprint Over Time</Text>

      {loading&&<ActivityIndicator/>}

      {!loading&&history.length===0&&<Text style={s.empty}>No footprints yet.</Text>}

      {!loading&&history.length>0&&<>
        <LineChart data={chart} width={SCREEN_WIDTH-32} height={220} yAxisSuffix=" kg"
          chartConfig={{
            backgroundGradientFrom:isDark?'#000':'#fff',
            backgroundGradientTo:isDark?'#000':'#fff',
            decimalPlaces:0,
            color:o=>`rgba(0,200,83,${o})`,
            labelColor:()=>isDark?'#fff':'#000',
            propsForDots:{r:'4'},
          }} bezier style={{marginVertical:8,borderRadius:8}}
        />

        <Text style={[s.title,{marginTop:24}]}>History</Text>
        {history.map((e,i)=>(
          <View key={e.timestamp?.getTime?.()??i} style={s.card}>
            <Text style={s.cText}>Date: {e.timestamp.toLocaleString()}</Text>
            <Text style={s.cText}>Total: {e.total??0} kg CO₂</Text>
            <Text style={s.small}>
              Elec {e.electricity} | Gas {e.gasoline} | Meat {e.meatConsumption} | PT {e.publicTransport}
            </Text>
          </View>
        ))}
      </>}

      <TouchableOpacity style={s.btn} onPress={clearAll} disabled={clearing}>
        <Text style={s.btnText}>{clearing?'Clearing…':'🗑  Clear History'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
