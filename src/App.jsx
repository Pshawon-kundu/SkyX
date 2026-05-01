import { Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
import { siteContent } from "./data/siteContent";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("skyx-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (!showSplash) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [showSplash]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("skyx-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      {showSplash && (
        <Suspense fallback={null}>
          <SplashScreen onComplete={() => setShowSplash(false)} />
        </Suspense>
      )}
      <Suspense fallback={<div />}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                content={siteContent}
                theme={theme}
                onThemeToggle={handleThemeToggle}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                isDark={theme === "dark"}
                theme={theme}
                onThemeToggle={handleThemeToggle}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
