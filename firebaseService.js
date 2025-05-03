// firebaseService.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Save a result
export const saveCarbonData = async (data) => {
  try {
    await addDoc(collection(db, 'carbonResults'), {
      ...data,
      timestamp: new Date().toISOString()
    });
    console.log('Data saved!');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Fetch all results
export const fetchCarbonHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'carbonResults'));
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
