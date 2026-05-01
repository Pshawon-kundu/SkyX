// Dynamic Firebase initialization - imported only when needed
// This prevents Firebase errors at app startup

// Firebase configuration - prioritize env vars, use minimal fallback
const getConfig = () => ({
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyC0PXBvO7LhwDdVvPbJm8gSQ2TS1yVxRnI",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skyx-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skyx-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skyx-project.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXX",
});

let firebaseInitialized = false;
let firebaseInitializing = false;
let firebaseError = null;
let authInstance = null;

// Initialize Firebase on first use (NOT at module load time) - using dynamic imports
async function initializeFirebase() {
  if (firebaseInitialized) return authInstance;
  if (firebaseInitializing) {
    // Wait for ongoing initialization
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (firebaseInitialized) {
          clearInterval(checkInterval);
          resolve(authInstance);
        }
      }, 100);
    });
  }

  firebaseInitializing = true;

  try {
    const { initializeApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");

    const app = initializeApp(getConfig());
    authInstance = getAuth(app);
    firebaseInitialized = true;
    firebaseInitializing = false;
    return authInstance;
  } catch (error) {
    console.warn("Firebase initialization warning:", error?.message || error);
    firebaseError = error?.message || String(error);
    firebaseInitialized = true;
    firebaseInitializing = false;
    // Don't throw - return null to allow app to continue
    return null;
  }
}

// Get auth instance, initializing if needed
export async function getAuthInstance() {
  if (!firebaseInitialized) {
    await initializeFirebase();
  }
  return authInstance;
}

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
    const auth = await getAuthInstance();
    if (!auth) {
      return {
        success: false,
        error: "Authentication is not available. Please try again later.",
      };
    }

    const { createUserWithEmailAndPassword, updateProfile } =
      await import("firebase/auth");

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
    const auth = await getAuthInstance();
    if (!auth) {
      return {
        success: false,
        error: "Authentication is not available. Please try again later.",
      };
    }

    const { signInWithEmailAndPassword } = await import("firebase/auth");

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
    let errorMessage = error.message;

    if (error.code === "auth/user-not-found") {
      errorMessage = "Account not found. Please create a new account.";
    } else if (
      error.code === "auth/invalid-password" ||
      error.code === "auth/invalid-credential"
    ) {
      errorMessage = "Invalid email or password.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many login attempts. Please try again later.";
    }

    return { success: false, error: errorMessage };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const auth = await getAuthInstance();
    if (!auth) {
      return {
        success: false,
        error: "Authentication is not available. Please try again later.",
      };
    }

    const { signInWithPopup, GoogleAuthProvider } =
      await import("firebase/auth");
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

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
    const auth = await getAuthInstance();
    if (!auth) {
      return {
        success: false,
        error: "Authentication is not available.",
      };
    }

    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Confirm password reset
export const confirmReset = async (code, newPassword) => {
  try {
    const auth = await getAuthInstance();
    if (!auth) {
      return {
        success: false,
        error: "Authentication is not available.",
      };
    }

    const { confirmPasswordReset } = await import("firebase/auth");
    await confirmPasswordReset(auth, code, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    const auth = await getAuthInstance();
    if (auth) {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    }
    clearStoredAuth();
    return { success: true };
  } catch (error) {
    clearStoredAuth();
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChangeListener = async (callback) => {
  try {
    const auth = await getAuthInstance();
    if (!auth) {
      console.warn("Firebase auth not available");
      callback(null);
      return () => {};
    }

    const { onAuthStateChanged } = await import("firebase/auth");

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const authData = {
          user: {
            id: user.uid,
            email: user.email,
            fullName: user.displayName || user.email.split("@")[0],
            photoURL: user.photoURL,
          },
          token,
        };
        persistAuth(authData);
        callback(authData);
      } else {
        clearStoredAuth();
        callback(null);
      }
    });
  } catch (error) {
    console.error("Auth listener error:", error);
    callback(null);
    return () => {};
  }
};

// Export auth config error (safe getter)
export const getFirebaseConfigError = () =>
  firebaseError
    ? `Firebase Error: ${firebaseError}. Sign-in may be unavailable.`
    : null;

export const firebaseConfigError = null; // Placeholder

// Default export - safe fallback
export default null;
