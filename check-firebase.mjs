import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { fileURLToPath } from "url";

// Load environment variables via native node arg or assume loaded

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Handle private key newlines
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

console.log("Testing Firebase Admin Initialization...");
console.log("Project ID:", serviceAccount.projectId);
console.log("Client Email:", serviceAccount.clientEmail);
console.log("Private Key Length:", serviceAccount.privateKey?.length);

if (
  !serviceAccount.projectId ||
  !serviceAccount.clientEmail ||
  !serviceAccount.privateKey
) {
  console.error("❌ Missing credentials in environment variables.");
  process.exit(1);
}

try {
  if (!getApps().length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  console.log("✅ Firebase Admin Initialized Successfully!");

  const db = admin.firestore();
  console.log("Attempting to connect to Firestore...");

  // Try a simple read (might fail if rules deny, but connection should work)
  // We'll just check if we can get a reference
  const collections = await db.listCollections();
  console.log(
    "✅ Firestore Connection Verification Passed. Collections found:",
    collections.length,
  );
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
}
