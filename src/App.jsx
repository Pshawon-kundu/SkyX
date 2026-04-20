import { Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
import { siteContent } from "./data/siteContent";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && (
        <Suspense fallback={null}>
          <SplashScreen onComplete={() => setShowSplash(false)} />
        </Suspense>
      )}
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/" element={<Home content={siteContent} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
