import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5OZhUAWlYb026IQ3VGUVkemwJIZS3AvE",
    authDomain: "codi-listening.firebaseapp.com",
    projectId: "codi-listening",
    storageBucket: "codi-listening.appspot.com",
    messagingSenderId: "42743346481",
    appId: "G-6E3380RZQP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
