// firebaseService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

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


export const fetchCarbonHistory = async () => {
  const querySnapshot = await getDocs(collection(db, 'carbonResults'));
  return querySnapshot.docs.map(doc => doc.data());
};

