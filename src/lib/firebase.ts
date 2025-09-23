
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
    // or update it if it does. This is more robust than just updateDoc.
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
        // Create or update a user profile in Firestore
        const userProfileData: Partial<Farmer> = {
            name: user.displayName || user.email?.split('@')[0],
            email: user.email || '',
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        };
        await updateFarmerProfile(user.uid, userProfileData);
        return { success: true, user };
    } catch (error: any) {
        // Handle specific errors for better user feedback
        let errorMessage = 'An unexpected error occurred during Google Sign-In.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in window closed. Please try again.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
        }
        console.error("Google Sign-In Error:", error);
        return { success: false, error: errorMessage };
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
    sessionStorage.removeItem('isGuest');
    return signOut(auth);
};

export { auth, db };
export type { User };
