import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SousChef from "./components/SousChef";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./components/AdminPanel";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/souschef" element={<SousChef />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}
