// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVguBnGKZv3MEsmsjS1IA6IYULTPUt-qk",
  authDomain: "carbon-brain.firebaseapp.com",
  projectId: "carbon-brain",
  storageBucket: "carbon-brain.firebasestorage.app",
  messagingSenderId: "119580069675",
  appId: "1:119580069675:web:a91c06161ff8ecbfbaff6e",
  measurementId: "G-T7F0KFC395"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };


