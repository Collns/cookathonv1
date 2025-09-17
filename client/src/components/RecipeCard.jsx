import { Link } from "react-router-dom";
import { formatDistanceToNow } from "../lib/time.js";

export default function RecipeCard({ recipe, detailed = false }) {
  return (
    <article className="border rounded-2xl p-3 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-brand-500/20" />
        <div className="text-sm">
          <div className="font-medium">{recipe?.author?.name || "Anon"}</div>
          <div className="text-neutral-500">
            {formatDistanceToNow(recipe?.createdAt)}
          </div>
        </div>
      </div>

      <Link to={`/r/${recipe?.id || ""}`}>
        <h2 className="text-lg font-semibold">{recipe?.title}</h2>
      </Link>

      {recipe?.summary && (
        <p className="text-sm text-neutral-700 mt-1">{recipe.summary}</p>
      )}

      {detailed && Array.isArray(recipe?.steps) && (
        <ol className="mt-3 list-decimal pl-6 space-y-1 text-sm">
          {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      )}
    </article>
  );
}
