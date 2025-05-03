// firebaseService.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Save a result to Firestore
export const saveCarbonData = async (data) => {
  try {
    await addDoc(collection(db, 'carbonResults'), {
      ...data,
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Data saved to Firebase!');
  } catch (error) {
    console.error('❌ Error saving data:', error);
  }
};

// Fetch and clean history from Firestore
export const fetchCarbonHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'carbonResults'));
    return snapshot.docs
      .map(doc => doc.data())
      .filter(entry => entry.timestamp && entry.total); // 🔥 This filters invalid entries
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    return [];
  }
};
