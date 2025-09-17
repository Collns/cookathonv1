import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fakeFetch();
        if (!cancelled) setRecipes(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-3">
      {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      {recipes.length === 0 && (
        <p className="text-center text-neutral-500 mt-10">No recipes yet.</p>
      )}
    </div>
  );
}

// temporary mock so UI shows something
async function fakeFetch() {
  await new Promise(r => setTimeout(r, 300));
  const now = Date.now();
  return [
    {
      id: "1",
      title: "Spicy Egg Toast",
      summary: "Eggs, chili flakes, buttered toast. 10-min breakfast.",
      createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
      author: { name: "Mimi" }
    },
    {
      id: "2",
      title: "Tomato Pasta",
      summary: "Garlic + olive oil + canned tomatoes.",
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      author: { name: "Dre" }
    }
  ];
}
