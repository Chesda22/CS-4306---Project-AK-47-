import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';   // adjust path if different

/**
 * Persists a footprint record and logs the result.
 * `data` must look like: { total: number, breakdown: { electricity, gasoline, meatMeals, publicTransport } }
 */
export async function saveFootprint({ total, breakdown }) {
  const doc = {
    total: Number(total),          // ← insure numeric
    timestamp: serverTimestamp(),  // ← critical for ordering
    electricity: breakdown.electricity,
    gasoline: breakdown.gasoline,
    meatConsumption: breakdown.meatMeals,
    publicTransport: breakdown.publicTransport,
  };

  try {
    const ref = await addDoc(collection(db, 'footprints'), doc);
    console.log(`✅ Saved to Firebase (id: ${ref.id}) — total: ${doc.total} kg`);
  } catch (err) {
    console.error('❌ Firebase save failed:', err);
  }
}
