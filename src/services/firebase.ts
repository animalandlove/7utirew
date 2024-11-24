import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8xi6Wam4Xj1jym2Exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "animal-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
  projectId: "animal-id-6397xxxxxxxxxx",
  storageBucket: "animal-id-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.firebasestorage.app",
  messagingSenderId: "567919691xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0",
  appId: "1:5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx691760:web:67xxxxxxxxxxxxxxxxxxxxxxxxxxx8f326f4967ff35",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxB8Y7SLRL"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
