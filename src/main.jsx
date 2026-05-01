import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Suppress Firebase errors from blocking the app
window.addEventListener("error", (event) => {
  if (
    event.error?.message?.includes("Firebase") ||
    event.message?.includes("invalid-api-key")
  ) {
    console.warn("Firebase error suppressed:", event.error?.message);
    event.preventDefault();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message?.includes("Firebase") ||
    event.reason?.message?.includes("invalid-api-key")
  ) {
    console.warn(
      "Firebase promise rejection suppressed:",
      event.reason?.message,
    );
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
