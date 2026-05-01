import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Get auth config error (if any)
export const firebaseConfigError = !import.meta.env.VITE_FIREBASE_API_KEY
  ? "Firebase is not configured. Add VITE_FIREBASE_API_KEY and other Firebase credentials to .env.local"
  : null;

// Auth event constant
export const AUTH_CHANGED_EVENT = "firebase-auth-changed";

// Persist auth to localStorage
export const persistAuth = (authData) => {
  if (authData) {
    localStorage.setItem("skyx-auth", JSON.stringify(authData));
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
};

// Get stored auth from localStorage
export const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem("skyx-auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Clear stored auth
export const clearStoredAuth = () => {
  localStorage.removeItem("skyx-auth");
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    const idToken = await userCredential.user.getIdToken();
    const authData = {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        fullName:
          displayName || userCredential.user.displayName || email.split("@")[0],
      },
      token: idToken,
    };

    persistAuth(authData);
    return { success: true, user: authData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const idToken = await userCredential.user.getIdToken();

    const authData = {
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: userCredential.user.displayName || email.split("@")[0],
      },
      token: idToken,
    };

    persistAuth(authData);
    return { success: true, user: authData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const authData = {
      user: {
        id: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName || result.user.email.split("@")[0],
        photoURL: result.user.photoURL,
      },
      token: idToken,
      provider: "google",
    };

    persistAuth(authData);
    return { success: true, user: authData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Confirm password reset
export const confirmReset = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    clearStoredAuth();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChangeListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdToken();
      const authData = {
        user: {
          id: user.uid,
          email: user.email,
          fullName: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL,
        },
        token: idToken,
      };
      persistAuth(authData);
      callback(authData);
    } else {
      clearStoredAuth();
      callback(null);
    }
  });
};

export default auth;
