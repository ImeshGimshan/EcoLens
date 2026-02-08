"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCimorhsF0__jV3XobXXOz2DZQvQeD__h8",
  authDomain: "ecolens-a5e78.firebaseapp.com",
  projectId: "ecolens-a5e78",
  storageBucket: "ecolens-a5e78.firebasestorage.app",
  messagingSenderId: "625903159958",
  appId: "1:625903159958:web:81ca92bc78a66afb8f10b7",
  measurementId: "G-Y4M9K2L46K",
};

// Initialize Firebase (only once)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
