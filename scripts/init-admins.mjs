/**
 * Script to initialize default admin emails in Firestore
 * Run this once to set up the admin collection
 * 
 * Usage: node scripts/init-admins.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Firebase configuration (same as in lib/firebase.ts)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultAdmins = [
  "iamcyklon@gmail.com",
  "dinijayo@gmail.com",
];

async function initAdmins() {
  console.log('Initializing admin emails...');
  
  for (const email of defaultAdmins) {
    try {
      const docId = email.replace(/@/g, "_at_").replace(/\./g, "_dot_");
      const adminRef = doc(db, "admins", docId);
      
      await setDoc(adminRef, {
        email,
        addedAt: new Date().toISOString(),
      });
      
      console.log(`✓ Added admin: ${email}`);
    } catch (error) {
      console.error(`✗ Failed to add admin ${email}:`, error);
    }
  }
  
  console.log('\nInitialization complete!');
  process.exit(0);
}

initAdmins();
