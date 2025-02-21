import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrqy721fPRLour8vu6hqN4KlxOxy06VGY",
  authDomain: "speakmaster-50956.firebaseapp.com",
  projectId: "speakmaster-50956",
  storageBucket: "speakmaster-50956.firebasestorage.app",
  messagingSenderId: "299378003405",
  appId: "1:299378003405:web:ecaebd01c597f28530c884",
};

// 🔹 Evita inicializar o Firebase mais de uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
