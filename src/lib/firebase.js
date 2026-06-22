import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByhyNyDwNnC1RSq7GL0FWLJI77iTMe-_A",
  authDomain: "medicobharat-1.firebaseapp.com",
  projectId: "medicobharat-1",
  storageBucket: "medicobharat-1.firebasestorage.app",
  messagingSenderId: "623585872367",
  appId: "1:623585872367:web:c3719e216dbd045bd90e1a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);