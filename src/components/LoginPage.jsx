import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import {
  persistAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
  logOut,
  firebaseConfigError,
  getStoredAuth,
  AUTH_CHANGED_EVENT,
  onAuthStateChangeListener,
} from "../utils/firebaseAuth";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage({
  isDark = true,
  theme: initialTheme,
  onThemeToggle,
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(initialTheme || "dark");
  const [message, setMessage] = useState(() =>
    firebaseConfigError ? { type: "error", text: firebaseConfigError } : null,
  );
  const syncingUserRef = useRef(null);
  const redirectTimerRef = useRef(null);

  const resetMessage = () => setMessage(null);

  const syncProfile = useCallback(
    async (user) => {
      if (!user?.email) return;
      if (syncingUserRef.current === user.uid) return;

      syncingUserRef.current = user.uid;
      setLoading(true);

      try {
        const API_BASE = (
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        // Try to sync with backend, but don't fail if backend is unavailable
        try {
          const response = await fetch(`${API_BASE}/api/users/sync-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firebaseToken: await user.getIdToken(),
              fullName: user.displayName || name || user.email.split("@")[0],
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            console.warn("Backend sync warning:", data.error || "Sync failed");
            // Continue anyway - backend is optional
          }
        } catch (backendError) {
          console.warn(
            "Backend not available, continuing with Firebase auth",
            backendError,
          );
          // Backend is down or unreachable - this is ok, continue with local auth
        }

        // Store auth and proceed regardless of backend sync
        persistAuth({
          user: {
            id: user.uid,
            email: user.email,
            fullName: user.displayName || name || user.email.split("@")[0],
          },
          token: await user.getIdToken(),
        });

        setMessage({
          type: "success",
          text: "Signed in successfully.",
        });

        window.clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = window.setTimeout(() => {
          navigate("/profile");
        }, 500);
      } catch (error) {
        syncingUserRef.current = null;
        setMessage({
          type: "error",
          text: error.message || "Failed to sync profile.",
        });
      } finally {
        setLoading(false);
      }
    },
    [name, navigate],
  );

  useEffect(() => () => window.clearTimeout(redirectTimerRef.current), []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChangeListener(async (authData) => {
      if (!isMounted) return;

      if (authData && authData.user) {
        // User signed in via Firebase
        await syncProfile({
          ...authData.user,
          getIdToken: () => authData.token,
        });
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [syncProfile]);

  const submit = async (e) => {
    e.preventDefault();
    resetMessage();

    try {
      setLoading(true);

      if (mode === "reset") {
        // For reset mode, just send the password reset email
        if (!validateEmail(email)) {
          setMessage({
            type: "error",
            text: "Please enter a valid email address.",
          });
          setLoading(false);
          return;
        }

        const result = await resetPassword(email);
        if (result.success) {
          setMessage({
            type: "success",
            text: "Password reset link sent to your email. Check your inbox.",
          });
          setEmail("");
          setMode("login");
        } else {
          setMessage({
            type: "error",
            text: result.error || "Failed to send password reset email.",
          });
        }
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setMessage({
          type: "error",
          text: "Password must be at least 8 characters.",
        });
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setMessage({ type: "error", text: "Please enter a valid email." });
        setLoading(false);
        return;
      }

      if (mode === "signup" && name.trim().length < 2) {
        setMessage({ type: "error", text: "Please enter your name." });
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const result = await signUpWithEmail(email, password, name.trim());
        if (result.success) {
          setMessage({
            type: "success",
            text: "Account created successfully!",
          });
          // Redirect to profile after signup
          window.clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = window.setTimeout(() => {
            navigate("/profile");
          }, 500);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Signup failed.",
          });
        }
      } else {
        // login
        const result = await signInWithEmail(email, password);
        if (result.success) {
          setMessage({ type: "success", text: "Signed in successfully." });
          // Redirect to profile after login
          window.clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = window.setTimeout(() => {
            navigate("/profile");
          }, 500);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Login failed.",
          });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Authentication failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    resetMessage();

    setLoading(true);
    try {
      if (provider === "Google") {
        const result = await signInWithGoogle();
        if (result.success) {
          setMessage({
            type: "success",
            text: "Signed in with Google successfully.",
          });
          window.setTimeout(() => navigate("/"), 500);
        } else {
          setMessage({
            type: "error",
            text: result.error || "Failed to sign in with Google.",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: `${provider} sign-in is not yet supported. Please use email/password or Google.`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || `Failed to sign in with ${provider}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    resetMessage();

    if (!validateEmail(email)) {
      setMessage({
        type: "error",
        text: "Enter your email first, then request a password reset.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setMessage({
          type: "success",
          text: "Password reset link sent. Check your email.",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send password reset email.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send password reset email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isResetMode = mode === "reset";
  const title = isResetMode
    ? "Reset password"
    : mode === "login"
      ? "Welcome back"
      : "Create your account";
  const subtitle = isResetMode
    ? "Choose a new password for your SkyX account"
    : mode === "login"
      ? "Sign in to continue to SkyX"
      : "Sign up to get started with SkyX";
  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setPassword("");
    resetMessage();
  };

  return (
    <section
      id="login"
      className={`py-20 sm:py-28 ${
        theme === "dark" ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              document.documentElement.setAttribute("data-theme", newTheme);
              window.localStorage.setItem("skyx-theme", newTheme);
              if (onThemeToggle) onThemeToggle();
            }}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-200/20 transition-colors"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-700" />
            )}
          </button>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 ${
            theme === "dark"
              ? "border-purple-500/10 bg-slate-950/80"
              : "border-purple-200/40 bg-white/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-2xl font-extrabold ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {title}
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {subtitle}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  if (isResetMode) {
                    setMode("login");
                    setPassword("");
                    resetMessage();
                  } else {
                    switchMode();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                type="button"
              >
                {isResetMode
                  ? "Back to sign in"
                  : mode === "login"
                    ? "Create account"
                    : "Back to sign in"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {!isResetMode && (
              <>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleSocial("Google")}
                    className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:shadow-sm disabled:opacity-50 ${
                      theme === "dark"
                        ? "bg-slate-800 text-white border-slate-700"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                    type="button"
                    aria-label="Sign in with Google"
                    disabled={loading}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 533.5 544.3"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285f4"
                        d="M533.5 278.4c0-18.2-1.6-36.3-4.7-53.6H272v101.4h147.2c-6.4 34.8-25.7 64.3-54.8 84v69.8h88.5c51.8-47.7 81.6-118 81.6-201.6z"
                      />
                      <path
                        fill="#34a853"
                        d="M272 544.3c73.6 0 135.5-24.5 180.6-66.4l-88.5-69.8c-24.6 16.5-56 26.3-92.1 26.3-70.8 0-130.8-47.8-152.3-112.1H28.9v70.5C74.6 486.1 167.5 544.3 272 544.3z"
                      />
                      <path
                        fill="#fbbc04"
                        d="M119.7 324.3c-10.7-31.6-10.7-65.8 0-97.4V156.4H28.9c-41.2 80.2-41.2 174.6 0 254.8l90.8-70.5z"
                      />
                      <path
                        fill="#ea4335"
                        d="M272 108.1c39.9-.6 78.3 15.5 107.5 44.6l80.6-80.6C407.6 24.3 345.8 0 272 0 167.5 0 74.6 58.2 28.9 156.4l90.8 70.5C141.2 155.9 201.2 108.1 272 108.1z"
                      />
                    </svg>
                    <span className="text-sm">Continue with Google</span>
                  </button>
                </div>
              </>
            )}

            <form onSubmit={submit} className="grid gap-3">
              {mode === "signup" && (
                <label className="block">
                  <div className="mb-1 text-sm font-medium">Full name</div>
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-transparent">
                    <User size={16} className="text-slate-400" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Full name"
                    />
                  </div>
                </label>
              )}

              {!isResetMode && (
                <label className="block">
                  <div className="mb-1 text-sm font-medium">Email</div>
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-transparent">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Email address"
                      type="email"
                    />
                  </div>
                </label>
              )}

              {isResetMode && (
                <label className="block">
                  <div className="mb-1 text-sm font-medium">Email</div>
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-transparent">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Email address for password reset"
                      type="email"
                      autoComplete="email"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Enter your email to receive a password reset link.
                  </p>
                </label>
              )}

              {!isResetMode && (
                <label className="block">
                  <div className="mb-1 text-sm font-medium">Password</div>
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-transparent">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Password"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="inline-flex items-center p-1 text-slate-400"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("reset");
                      setPassword("");
                      resetMessage();
                    }}
                    className="text-purple-400 hover:underline disabled:opacity-50"
                    disabled={loading}
                  >
                    Forgot?
                  </button>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8v8z"
                          fill="currentColor"
                        ></path>
                      </svg>{" "}
                      Processing
                    </span>
                  ) : (
                    <>
                      {isResetMode
                        ? "Send reset link"
                        : mode === "login"
                          ? "Sign in"
                          : "Create account"}
                    </>
                  )}
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={() => {
                if (isResetMode) {
                  setMode("login");
                } else {
                  switchMode();
                }
              }}
              className="sm:hidden text-center text-sm font-medium text-purple-300"
            >
              {isResetMode
                ? "Back to sign in"
                : mode === "login"
                  ? "Create account"
                  : "Back to sign in"}
            </button>

            {message && (
              <Motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 rounded-lg px-4 py-3 text-sm ${
                  message.type === "error"
                    ? theme === "dark"
                      ? "bg-red-900/40 border border-red-700/60 text-red-100"
                      : "bg-red-100/80 border border-red-300 text-red-800"
                    : theme === "dark"
                      ? "bg-emerald-900/40 border border-emerald-700/60 text-emerald-100"
                      : "bg-emerald-100/80 border border-emerald-300 text-emerald-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">{message.text}</div>
                </div>
                {message.type === "error" &&
                  mode === "login" &&
                  message.text.includes("not found") && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        resetMessage();
                      }}
                      className={`mt-2 text-xs font-semibold underline ${
                        theme === "dark"
                          ? "text-red-200 hover:text-red-100"
                          : "text-red-700 hover:text-red-900"
                      }`}
                    >
                      Create a new account →
                    </button>
                  )}
              </Motion.div>
            )}

            <div className="pt-3 text-center text-xs text-slate-400">
              By continuing you agree to our{" "}
              <a className="text-purple-300 underline">Terms</a> and{" "}
              <a className="text-purple-300 underline">Privacy</a>.
            </div>

            {mode === "login" && (
              <div
                className={`mt-4 rounded-lg p-3 text-xs ${
                  theme === "dark"
                    ? "bg-slate-800/50 border border-slate-700/50 text-slate-300"
                    : "bg-slate-100 border border-slate-300 text-slate-600"
                }`}
              >
                <p className="font-semibold mb-2">💡 First time here?</p>
                <p className="mb-2">
                  Create a new account using the "Create account" button or sign
                  up with Google.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    resetMessage();
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline"
                >
                  Create account →
                </button>
              </div>
            )}
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
