// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA6WmT21dKagEHNFR5ldhbYJvx6iBYz4A8",
    authDomain: "csp-apotek.firebaseapp.com",
    projectId: "csp-apotek",
    storageBucket: "csp-apotek.firebasestorage.app",
    messagingSenderId: "1039884715816",
    appId: "1:1039884715816:web:29a5170ab23d127e93b21d",
    measurementId: "G-2C8R21XTZ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
