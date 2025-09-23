import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import type { Farmer } from './types';


const firebaseConfig = {
  "projectId": "studio-3384337403-b24f3",
  "appId": "1:651522288971:web:462f61482346b81c030cce",
  "apiKey": "AIzaSyAyi2oHDeL2S_QApOJ9icjsS2ISXHePkIA",
  "authDomain": "studio-3384337403-b24f3.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "651522288971"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// --- Firestore Functions ---

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

// --- Auth Functions ---
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Create a user profile in Firestore if it's a new user
        const userDocRef = doc(db, 'farmers', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                avatarUrl: user.photoURL,
            }, { merge: true });
        }
        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const registerWithEmail = async (email: string, password: string):Promise<{success: boolean; user?: User; error?: string}> => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Create a basic profile
        await setDoc(doc(db, 'farmers', user.uid), {
            name: email.split('@')[0], // default name
            email: user.email,
            avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`
        });
        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const signInWithEmail = async (email: string, password: string):Promise<{success: boolean; user?: User; error?: string}> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};


export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const doSignOut = () => {
    return signOut(auth);
};

export { auth, db };
