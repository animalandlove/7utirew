import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8xi6Wam4Xj1jym2ELb7RKNfoCkWLp-WA",
  authDomain: "animal-id-63976.firebaseapp.com",
  projectId: "animal-id-63976",
  storageBucket: "animal-id-63976.firebasestorage.app",
  messagingSenderId: "567919691760",
  appId: "1:567919691760:web:67d22aa98f326f4967ff35",
  measurementId: "G-WQB8Y7SLRL"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);