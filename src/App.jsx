export default function App() {
  if (typeof window !== "undefined") {
    document.documentElement.style.display = "block";
    document.documentElement.style.visibility = "visible";
    document.body.style.display = "block";
    document.body.style.visibility = "visible";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "black",
        color: "gold",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        padding: "20px",
        textAlign: "center",
        gap: "20px",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "48px", margin: "0" }}>🚀 SKYX</h1>
      <p style={{ fontSize: "20px", margin: "0", opacity: "0.8" }}>
        Gaming Economy Platform
      </p>
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#1a1a1a",
          borderRadius: "8px",
          border: "2px solid gold",
          maxWidth: "600px",
          fontSize: "18px",
        }}
      >
        <p>✓ React is rendering</p>
        <p>✓ App component loaded</p>
        <p style={{ marginTop: "20px", fontSize: "14px", opacity: "0.6" }}>
          You should see this text now!
        </p>
      </div>
    </div>
  );
}
