import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

function EmergencyFallback() {
  return (
    <main className="boot-fallback" aria-label="SkyX loading fallback">
      <div className="boot-fallback__mark">X</div>
      <h1>SkyX</h1>
      <p>Build, play, and earn in a next-gen gaming ecosystem.</p>
    </main>
  );
}

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("SkyX render failed:", error);
  }

  render() {
    if (this.state.hasError) {
      document.body.style.overflow = "auto";
      return <EmergencyFallback />;
    }

    return this.props.children;
  }
}

function showEmergencyFallback(error) {
  console.error("SkyX startup failed:", error);
  document.body.style.overflow = "auto";

  const root = document.getElementById("root");
  if (!root) return;

  root.innerHTML = `
    <main class="boot-fallback" aria-label="SkyX loading fallback">
      <div class="boot-fallback__mark">X</div>
      <h1>SkyX</h1>
      <p>Build, play, and earn in a next-gen gaming ecosystem.</p>
    </main>
  `;
}

window.addEventListener("error", (event) => {
  showEmergencyFallback(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showEmergencyFallback(event.reason);
});

try {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RootErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RootErrorBoundary>
    </StrictMode>,
  );
} catch (error) {
  showEmergencyFallback(error);
}
