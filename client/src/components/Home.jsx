import { useState, useEffect } from "react";
import { recipes as recipesApi } from "../lib/apiClient";
import RecipeCard from "./RecipeCard";   // 👈 import your RecipeCard

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const res = await recipesApi.all();
      setRecipes(res);
    } catch (err) {
      console.error("Error loading recipes:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cookathon Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
      )}
    </div>
  );
}
