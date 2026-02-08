import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Fetch all admin emails from Firestore
 */
export async function getAdminEmails(): Promise<string[]> {
  try {
    const adminsRef = collection(db, "admins");
    const snapshot = await getDocs(adminsRef);
    
    const emails: string[] = [];
    console.log("Admin docs fetched:", snapshot.size);
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });
    
    return emails;
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
}

/**
 * Check if an email is an admin
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  try {
    const emails = await getAdminEmails();
    return emails.includes(email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Add a new admin email
 */
export async function addAdminEmail(email: string): Promise<boolean> {
  try {
    // Use email as document ID (replacing @ and . with _)
    const docId = email.replace(/@/g, "_at_").replace(/\./g, "_dot_");
    const adminRef = doc(db, "admins", docId);
    
    await setDoc(adminRef, {
      email,
      addedAt: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error("Error adding admin email:", error);
    return false;
  }
}

/**
 * Remove an admin email
 */
export async function removeAdminEmail(email: string): Promise<boolean> {
  try {
    const docId = email.replace(/@/g, "_at_").replace(/\./g, "_dot_");
    const adminRef = doc(db, "admins", docId);
    
    await deleteDoc(adminRef);
    
    return true;
  } catch (error) {
    console.error("Error removing admin email:", error);
    return false;
  }
}

/**
 * Initialize default admin emails (run once to seed the database)
 */
export async function initializeDefaultAdmins(): Promise<void> {
  const defaultAdmins = [
    "iamcyklon@gmail.com",
    "dinijayo@gmail.com",
  ];
  
  for (const email of defaultAdmins) {
    await addAdminEmail(email);
  }
  
  console.log("Default admin emails initialized");
}
