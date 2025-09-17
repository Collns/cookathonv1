// BottomNav.jsx
import { NavLink } from "react-router-dom";

const Item = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "flex flex-col items-center justify-center px-4 py-2 text-xs " +
      (isActive ? "text-brand-600" : "text-neutral-600")
    }
  >
    <span className="w-5 h-5 rounded border border-current mb-1 inline-block" />
    {label}
  </NavLink>
);

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 border-t bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl grid grid-cols-5">
        <Item to="/" label="Feed" />
        <Item to="/search" label="Search" />
        <Item to="/new" label="New" />
        <Item to="/pantry" label="Pantry" />
        <Item to="/messages" label="Messages" /> {/* Fixed from "DMs" */}
      </div>
    </nav>
  );
}