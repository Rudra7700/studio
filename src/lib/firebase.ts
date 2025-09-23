
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, enableIndexedDbPersistence } from "firebase/firestore";
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

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one.
      // This is a normal scenario.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence.
      console.warn('Firestore persistence is not supported in this browser.');
    }
  });


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
        } else if (error.code === 'auth/configuration-not-found') {
            errorMessage = 'Google Sign-In is not enabled for this project. Please enable it in your Firebase Console under Authentication > Sign-in method.';
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'This domain is not authorized for authentication. Please add it to the list of authorized domains in your Firebase project.';
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
        await updateFarmerProfile(user.uid, {
            name: email.split('@')[0], // default name
            email: user.email || email,
            avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`
        });
        return { success: true, user };
    } catch (error: any) {
        let friendlyError = 'An unexpected error occurred.';
        if (error.code === 'auth/email-already-in-use') {
            friendlyError = 'This email is already registered. Please try logging in.';
        } else if (error.code === 'auth/weak-password') {
            friendlyError = 'The password is too weak. Please use at least 6 characters.';
        }
        return { success: false, error: friendlyError };
    }
};

export const signInWithEmail = async (email: string, password: string): Promise<{success: boolean; user?: User; error?: string}> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        try {
            const userDoc = await getDoc(doc(db, 'farmers', user.uid));
            if (!userDoc.exists()) {
                // If user document doesn't exist, create one
                await updateFarmerProfile(user.uid, {
                    name: user.email?.split('@')[0],
                    email: user.email,
                    avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
                });
            }
        } catch (docError: any) {
            // This is the special case to handle offline issues during the getDoc call
            if (docError.message.includes('offline')) {
                console.warn("Could not fetch document while offline. Assuming profile exists or creating a local version.");
                // We can proceed, and if the doc is truly missing, it will be created on the next online interaction.
                // Or, we can proactively write it, which is safer.
                 await updateFarmerProfile(user.uid, {
                    name: user.email?.split('@')[0],
                    email: user.email,
                    avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
                });
            } else {
                // Re-throw other document errors
                throw docError;
            }
        }
        
        return { success: true, user };
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            return { success: false, error: 'Invalid email or password.' };
        }
        if (error.message.includes('offline')) {
             return { success: false, error: 'Failed to login because the client is offline. Please check your connection.' };
        }
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
