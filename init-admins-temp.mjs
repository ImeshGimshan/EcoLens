/**
 * Temporary script to initialize admin emails in Firestore
 * Run this once: node init-admins-temp.mjs
 * 
 * After running successfully, you can delete this file.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin emails to add
const adminEmails = [
  "iamcyklon@gmail.com",
  "dinijayo@gmail.com",
];

async function initAdmins() {
  console.log('\n📧 Adding admin emails to Firestore...\n');
  
  for (const email of adminEmails) {
    try {
      const docId = email.replace(/@/g, "_at_").replace(/\./g, "_dot_");
      const adminRef = doc(db, "admins", docId);
      
      await setDoc(adminRef, {
        email,
        addedAt: new Date().toISOString(),
      });
      
      console.log(`✅ Added admin: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to add admin ${email}:`, error.message);
    }
  }
  
  console.log('\n✨ Initialization complete!');
  console.log('You can now delete this file: init-admins-temp.mjs\n');
  process.exit(0);
}

initAdmins().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
