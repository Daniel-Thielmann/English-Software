import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDCUO2iFNtSq6hnqX0R1UHxvodXZK1gQiE",
    authDomain: "codi-listening-ae9ad.firebaseapp.com",
    projectId: "codi-listening-ae9ad",
    storageBucket: "codi-listening-ae9ad.appspot.com",
    messagingSenderId: "556329953951",
    appId: "1:556329953951:web:789fecc5bf5e6895c350aa",
    measurementId: "G-WGBJ37RJFQ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
