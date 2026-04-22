import { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  ArrowLeft,
  X as XIcon,
} from "lucide-react";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage({ isDark = true }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const resetMessage = () => setMessage(null);

  const submit = async (e) => {
    e.preventDefault();
    resetMessage();

    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setMessage({ type: "error", text: "Please enter your name." });
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // Do not show success messages in UI for demo flows
  };

  const handleSocial = (provider) => {
    resetMessage();
    // For the demo, just simulate redirect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // intentionally not showing a success message here
    }, 700);
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
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p
                className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {mode === "login"
                  ? "Sign in to continue to SkyX"
                  : "Sign up to get started with SkyX"}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                type="button"
              >
                {mode === "login" ? "Create account" : "Have an account?"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-3">
              <button
                onClick={() => handleSocial("Google")}
                className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:shadow-sm ${isDark ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-700 border-slate-200"}`}
                type="button"
                aria-label="Sign in with Google"
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
                className="flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 bg-slate-800 text-sm font-medium hover:shadow-sm"
                type="button"
                aria-label="Sign in with X"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.03 9.03 0 0 1-2.86 1.09A4.52 4.52 0 0 0 12.07 4c0 .35.04.7.12 1.03A12.83 12.83 0 0 1 1.64 2.15 4.5 4.5 0 0 0 3 8.11a4.38 4.38 0 0 1-2.05-.57v.06A4.5 4.5 0 0 0 4.5 12a4.52 4.52 0 0 1-2.04.08 4.5 4.5 0 0 0 4.21 3.13A9.06 9.06 0 0 1 1 19.54 12.78 12.78 0 0 0 7 21c8.8 0 13.62-7.29 13.62-13.6 0-.21 0-.42-.01-.63A9.65 9.65 0 0 0 23 3z"
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

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-purple-400 hover:underline">
                  Forgot?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-bold text-white"
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
                    <>{mode === "login" ? "Sign in" : "Create account"}</>
                  )}
                </button>
              </div>
            </form>

            {message && message.type === "error" && (
              <div
                className={`mt-2 rounded-md px-4 py-2 text-sm ${isDark ? "bg-red-800/60 text-red-100" : "bg-red-100 text-red-800"}`}
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
