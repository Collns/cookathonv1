import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  const navStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #ddd",
    background: "#fff",
    fontSize: "14px",
  };

  const linkStyle = (active) => ({
    color: active ? "#2563eb" : "#444",
    fontWeight: active ? "600" : "400",
    textDecoration: "none",
  });

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle(pathname === "/")}>Home</Link>
      <Link to="/souschef" style={linkStyle(pathname === "/ai")}>Sous Chef</Link>
      <Link to="/chatbot" style={linkStyle(pathname === "/chatbot")}>Chatbot</Link>
      <Link to="/admin" style={linkStyle(pathname === "/admin")}>Admin</Link>
    </nav>
  );
}
