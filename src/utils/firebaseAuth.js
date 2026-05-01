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

// Firebase configuration - use env vars, fallback to defaults
// Browser API keys are meant to be public, so it's safe to embed them
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpZqyR2nzK2P6sXOdUHlQ2GBTZ2Kwi_Dc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skyx-74710.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skyx-74710",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skyx-74710.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "939772496272",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:939772496272:web:af2dc2e03ecd430ca20b15",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7Y7G27LR25",
};

// Initialize Firebase with error handling
let app;
let firebaseInitError = null;

try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase init failed:", error);
  firebaseInitError = error.message;
  // Create a dummy app to prevent crashes
  try {
    app = initializeApp({
      projectId: "dummy",
      apiKey: "dummy-key",
      authDomain: "dummy.firebaseapp.com",
    });
  } catch (e) {
    // Silent fallback
  }
}

export const auth = app ? getAuth(app) : null;

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Get auth config error (if any)
export const firebaseConfigError =
  firebaseInitError ||
  (!import.meta.env.VITE_FIREBASE_API_KEY
    ? "Firebase is not configured. Add VITE_FIREBASE_API_KEY and other Firebase credentials to .env.local"
    : null);

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
    if (!auth) {
      throw new Error(
        "Firebase not configured. Check your environment variables.",
      );
    }

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
    let errorMessage = error.message;

    if (error.code === "auth/email-already-in-use") {
      errorMessage =
        "This email is already registered. Please sign in instead.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Please enter a valid email address.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 8 characters.";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password accounts are not enabled.";
    }

    return { success: false, error: errorMessage };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    if (!auth) {
      throw new Error(
        "Firebase not configured. Check your environment variables.",
      );
    }

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
    // Better error messages
    let errorMessage = error.message;

    if (error.code === "auth/user-not-found") {
      errorMessage = "Account not found. Please create a new account.";
    } else if (
      error.code === "auth/invalid-password" ||
      error.code === "auth/invalid-credential"
    ) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many login attempts. Please try again later.";
    }

    return { success: false, error: errorMessage };
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
