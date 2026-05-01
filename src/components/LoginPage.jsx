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
} from "lucide-react";
import {
  persistAuth,
  supabase,
  supabaseConfigError,
} from "../utils/supabaseAuth";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

function getSessionName(session, fallbackName = "") {
  const metadata = session?.user?.user_metadata || {};
  return (
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    fallbackName.trim() ||
    session?.user?.email?.split("@")[0] ||
    "SkyX User"
  );
}

function isPasswordRecoveryUrl() {
  if (typeof window === "undefined") return false;

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  return hash.get("type") === "recovery" || search.get("type") === "recovery";
}

export default function LoginPage({ isDark = true }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(() =>
    supabaseConfigError
      ? { type: "error", text: supabaseConfigError }
      : null,
  );
  const syncingTokenRef = useRef(null);
  const redirectTimerRef = useRef(null);

  const resetMessage = () => setMessage(null);

  const syncProfile = useCallback(async (session) => {
    if (!session?.access_token) return;
    if (syncingTokenRef.current === session.access_token) return;

    syncingTokenRef.current = session.access_token;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/sync-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseToken: session.access_token,
          fullName: getSessionName(session, name),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Sync failed");
      }

      persistAuth(data);
      setMessage({
        type: "success",
        text: "Signed in successfully.",
      });

      window.clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = window.setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      syncingTokenRef.current = null;
      setMessage({
        type: "error",
        text: error.message || "Failed to sync profile.",
      });
    } finally {
      setLoading(false);
    }
  }, [name, navigate]);

  useEffect(() => () => window.clearTimeout(redirectTimerRef.current), []);

  // Recover persisted sessions and OAuth callbacks after Supabase redirects.
  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Could not restore your session.",
        });
        return;
      }

      if (data.session && !isPasswordRecoveryUrl()) {
        syncProfile(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setLoading(false);
        setMessage({
          type: "success",
          text: "Enter a new password to finish resetting your account.",
        });
        return;
      }

      if (event === "SIGNED_IN" && session && !isPasswordRecoveryUrl()) {
        await syncProfile(session);
      }

      if (event === "SIGNED_OUT") {
        syncingTokenRef.current = null;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncProfile]);

  const submit = async (e) => {
    e.preventDefault();
    resetMessage();

    if (!supabase) {
      // Fall back to server-side auth endpoints when Supabase client isn't configured
      // This allows the form to work on domains where VITE_* env vars are not set.
      try {
        setLoading(true);

        if (mode === "reset") {
          setMessage({ type: "error", text: "Password reset is unavailable without Supabase configuration." });
          setLoading(false);
          return;
        }

        if (mode === "signup") {
          const response = await fetch(`${API_BASE}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, fullName: name.trim(), password }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.error || "Registration failed");
          }

          persistAuth(data);
          setMessage({ type: "success", text: "Account created and signed in." });
          window.setTimeout(() => navigate("/"), 400);
          return;
        }

        // login
        const response = await fetch(`${API_BASE}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        persistAuth(data);
        setMessage({ type: "success", text: "Signed in successfully." });
        window.setTimeout(() => navigate("/"), 400);
        return;
      } catch (error) {
        setMessage({ type: "error", text: error.message || "Authentication failed." });
      } finally {
        setLoading(false);
      }
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }
    if (mode !== "reset" && !validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setMessage({ type: "error", text: "Please enter your name." });
      return;
    }

    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (data.session) {
          await syncProfile(data.session);
        } else {
          setMessage({
            type: "success",
            text: "Password updated. You can sign in now.",
          });
          setMode("login");
          setLoading(false);
        }
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
          },
        });

        if (error) throw error;
        if (data.session) {
          await syncProfile(data.session);
        } else {
          setMessage({
            type: "success",
            text: "Check your email to confirm your account.",
          });
          setLoading(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.session) {
          await syncProfile(data.session);
        } else {
          setMessage({
            type: "success",
            text: "Check your email to finish signing in.",
          });
          setLoading(false);
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Authentication failed.",
      });
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    resetMessage();
    if (!supabase) {
      setMessage({ type: "error", text: supabaseConfigError });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === "X" ? "twitter" : "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || `Failed to sign in with ${provider}.`,
      });
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    resetMessage();
    if (!supabase) {
      setMessage({ type: "error", text: supabaseConfigError });
      return;
    }
    if (!validateEmail(email)) {
      setMessage({
        type: "error",
        text: "Enter your email first, then request a password reset.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      setMessage({
        type: "success",
        text: "Password reset link sent. Check your email.",
      });
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
      className={`py-20 sm:py-28 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className={`rounded-3xl border p-8 sm:p-10 ${isDark ? "border-purple-500/10 bg-slate-950/80" : "border-purple-200/40 bg-white/90"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {title}
              </h2>
              <p
                className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {subtitle}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={switchMode}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                type="button"
              >
                {mode === "login" ? "Create account" : "Back to sign in"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {!isResetMode && (
              <>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleSocial("Google")}
                    className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:shadow-sm disabled:opacity-50 ${isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-700 border-slate-200"}`}
                    type="button"
                    aria-label="Sign in with Google"
                      disabled={loading || !supabase}
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

                  <button
                    onClick={() => handleSocial("X")}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 bg-slate-800 text-sm font-medium hover:shadow-sm disabled:opacity-50"
                    type="button"
                    aria-label="Sign in with X"
                      disabled={loading || !supabase}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.968 6.817H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-sm">Continue with X</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-sm text-slate-400">
                    or
                  </div>
                  <div className="h-px bg-slate-300/10" />
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

              <label className="block">
                <div className="mb-1 text-sm font-medium">
                  {isResetMode ? "New password" : "Password"}
                </div>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-transparent">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isResetMode ? "New secure password" : "At least 8 characters"
                    }
                    className="w-full bg-transparent text-sm outline-none"
                    aria-label={isResetMode ? "New password" : "Password"}
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

              {mode === "login" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-slate-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-purple-400 hover:underline disabled:opacity-50"
                    disabled={loading || !supabase}
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
                        ? "Update password"
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
              onClick={switchMode}
              className="sm:hidden text-center text-sm font-medium text-purple-300"
            >
              {mode === "login" ? "Create account" : "Back to sign in"}
            </button>

            {message && (
              <div
                className={`mt-2 rounded-md px-4 py-2 text-sm ${message.type === "error" ? (isDark ? "bg-red-800/60 text-red-100" : "bg-red-100 text-red-800") : isDark ? "bg-emerald-800/40 text-emerald-100" : "bg-emerald-100 text-emerald-800"}`}
              >
                {message.text}
              </div>
            )}

            <div className="pt-2 text-center text-xs text-slate-400">
              By continuing you agree to our{" "}
              <a className="text-purple-300 underline">Terms</a> and{" "}
              <a className="text-purple-300 underline">Privacy</a>.
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
