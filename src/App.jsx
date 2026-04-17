import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { siteContent } from "./data/siteContent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home content={siteContent} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
