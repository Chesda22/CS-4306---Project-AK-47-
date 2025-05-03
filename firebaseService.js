// firebaseService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const saveCarbonData = async (data) => {
  try {
    await addDoc(collection(db, 'carbonResults'), {
      ...data,
      timestamp: new Date().toISOString()
    });
    console.log('Data saved!');
  } catch (err) {
    console.error('Error saving data:', err);
  }
};
