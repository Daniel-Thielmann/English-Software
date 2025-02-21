import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCUO2iFNtSq6hnqX0R1UHxvodXZK1gQiE",
  authDomain: "codi-listening-ae9ad.firebaseapp.com",
  projectId: "codi-listening-ae9ad",
  storageBucket: "codi-listening-ae9ad.firebasestorage.app",
  messagingSenderId: "556329953951",
  appId: "1:556329953951:web:789fecc5bf5e6895c350aa",
  measurementId: "G-WGBJ37RJFQ",
};

// 🔹 Evita inicializar o Firebase mais de uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
