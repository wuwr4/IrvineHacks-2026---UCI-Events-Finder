// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZHp6DxsxKQTo7ihh1tWt4Y4Dn3gtkcwI",
  authDomain: "irvine-hacks2026-event-finder.firebaseapp.com",
  projectId: "irvine-hacks2026-event-finder",
  storageBucket: "irvine-hacks2026-event-finder.firebasestorage.app",
  messagingSenderId: "952103681617",
  appId: "1:952103681617:web:662f60a5edbacfb38bc270",
  measurementId: "G-JGLN1L3KVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-west2")

export const verifyDormFn = httpsCallable(functions, "verifyDorm");
export const checkDormFn = httpsCallable(functions, "checkDorm");
