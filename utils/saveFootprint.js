// utils/saveFootprint.js
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Persists a footprint record and logs the result.
 * @param {object} data – { total, breakdown } from the calculator
 */
export async function saveFootprint(data) {
  try {
    const docRef = await addDoc(collection(db, 'carbonHistory'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    // ✅ This shows in Metro / PowerShell
    console.log(
      `✅ Saved to Firebase (id: ${docRef.id}) — total: ${data.total} kg`
    );
  } catch (err) {
    console.error('❌ Firebase save failed:', err);
  }
}
