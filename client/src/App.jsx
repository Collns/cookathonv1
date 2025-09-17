import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
          {/* If a route fails to match, nothing shows; the NotFound route above fixes that */}
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}
