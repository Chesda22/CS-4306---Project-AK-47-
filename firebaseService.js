// firebaseService.js
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Save a new carbon footprint entry to Firestore.
 * Uses Firebase serverTimestamp to ensure consistent ordering.
 */
export const saveCarbonData = async (data) => {
  try {
    await addDoc(collection(db, 'carbonResults'), {
      ...data,
      timestamp: serverTimestamp()
    });
    console.log('✅ Data saved to Firebase!');
  } catch (error) {
    console.error('❌ Error saving data to Firebase:', error);
  }
};

/**
 * Fetch all carbon footprint entries from Firestore,
 * ordered by timestamp (most recent first).
 */
export const fetchCarbonHistory = async () => {
  try {
    const q = query(collection(db, 'carbonResults'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('❌ Error fetching history from Firebase:', error);
    return [];
  }
};
