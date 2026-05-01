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

// Check if Firebase config is available
const hasValidConfig =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

export const firebaseConfigError = !hasValidConfig
  ? "Firebase credentials not configured on this server. Authentication features will be unavailable."
  : null;

let app;
let auth = null;
let googleProvider = null;

// Only initialize Firebase if we have valid config
if (hasValidConfig) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    console.log("✓ Firebase initialized successfully");
  } catch (error) {
    console.warn("⚠ Firebase initialization failed:", error.message);
    auth = null;
    googleProvider = null;
  }
} else {
  console.warn("⚠ Firebase credentials not configured - using demo mode");
}

export { auth, googleProvider };

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
      return { success: false, error: firebaseConfigError || "Firebase not available. Please try again later." };
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
      return { success: false, error: firebaseConfigError || "Firebase not available. Please try again later." };
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
    if (!auth || !googleProvider) {
      return { success: false, error: firebaseConfigError || "Firebase not available" };
    }
    
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
    if (!auth) {
      return { success: false, error: firebaseConfigError || "Firebase not available" };
    }
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Confirm password reset
export const confirmReset = async (code, newPassword) => {
  try {
    if (!auth) {
      return { success: false, error: firebaseConfigError || "Firebase not available" };
    }
    await confirmPasswordReset(auth, code, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }
    clearStoredAuth();
    return { success: true };
  } catch (error) {
    clearStoredAuth();
    return { success: true }; // Clear local auth even if Firebase fails
  }
};

// Listen to auth state changes
export const onAuthStateChangeListener = (callback) => {
  if (!auth) {
    // Firebase not available - check localStorage for stored auth
    const storedAuth = getStoredAuth();
    callback(storedAuth);
    return () => {}; // Return empty unsubscribe function
  }
  
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
