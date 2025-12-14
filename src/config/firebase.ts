import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCePOyQvLEanzMmcdRUYctY16r-noA1k1U",
  authDomain: "city-samadhan.firebaseapp.com",
  projectId: "city-samadhan",
  storageBucket: "city-samadhan.appspot.com", // ✅ corrected
  messagingSenderId: "368438429966",
  appId: "1:368438429966:web:8a3167dbbe273ccf272f5f",
  measurementId: "G-E6GP177KWT"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const FIREBASE_AUTH = getAuth(app);
export const FIRESTORE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;