import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { Farmer } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// --- Firestore Functions ---

/**
 * Fetches a farmer's profile from Firestore.
 * @param uid - The user's unique ID.
 * @returns The farmer's profile object or null if not found.
 */
export async function getFarmerProfile(uid: string): Promise<(Farmer & { phone?: string }) | null> {
  try {
    const docRef = doc(db, "farmers", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Combine the document ID with the data
      return { id: docSnap.id, ...docSnap.data() } as Farmer & { phone?: string };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting farmer profile:", error);
    throw error;
  }
}

/**
 * Creates or updates a farmer's profile in Firestore.
 * @param uid - The user's unique ID.
 * @param data - The profile data to save.
 */
export async function updateFarmerProfile(uid: string, data: Partial<Farmer & { phone?: string }>): Promise<void> {
  try {
    const docRef = doc(db, "farmers", uid);
    // Use setDoc with merge: true to create the document if it doesn't exist,
    // or update it if it does.
    await setDoc(docRef, data, { merge: true });
    console.log("Profile updated successfully for UID:", uid);
  } catch (error) {
    console.error("Error updating farmer profile:", error);
    throw error;
  }
}
