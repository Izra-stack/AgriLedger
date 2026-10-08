import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3xBKfTX-NtnSZX2xqyHO_vGJY1w27Ntg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriledger-5d79a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agriledger-5d79a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agriledger-5d79a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "243924390325",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:243924390325:web:96c63089638a15c43489fc",
};

const firebaseConfig = requiredConfig;

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
