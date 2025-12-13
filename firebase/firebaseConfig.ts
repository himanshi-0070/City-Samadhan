// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCePOyQvLEanzMmcdRUYctY16r-noA1k1U",
  authDomain: "city-samadhan.firebaseapp.com",
  projectId: "city-samadhan",
  storageBucket: "city-samadhan.appspot.com",
  messagingSenderId: "368438429966",
  appId: "1:368438429966:web:8a3167dbbe273ccf272f5f",
  measurementId: "G-E6GP177KWT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
