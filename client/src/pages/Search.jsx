import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!q.trim()) { setResults([]); return; }
      await new Promise(r => setTimeout(r, 200));
      if (active) setResults([]); // plug real /api/search here
    })();
    return () => { active = false; };
  }, [q]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search recipes, users, tags..."
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
      />
      <div className="mt-4 space-y-3">
        {results.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </div>
  );
}
