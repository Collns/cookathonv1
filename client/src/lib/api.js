import axios from "axios";

const API_BASE = (
  (import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:5050/api"
).replace(/\/$/, "");


// axios instance so we can write api.get/post/etc.
const api = axios.create({
  baseURL: API_BASE,
  // withCredentials: true, // uncomment if your API uses cookies
});

// -------------------- Feed (infinite scroll)
export async function getFeed(params = {}) {
  const { page = 1, pageSize = 10 } = params;
  const { data } = await api.get("/feed", { params: { page, pageSize } });
  return data;
}

// -------------------- Single recipe
export async function getRecipe(id) {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
}

export function fetchRecipeById(id) {
  return http(`/recipes/${encodeURIComponent(id)}`); // <-- no extra backtick!
}

// -------------------- Create recipe (regular)
export async function createRecipe(payload) {
  const { data } = await api.post("/recipes", payload);
  return data;
}

// -------------------- Search
export async function searchRecipes(q) {
  const { data } = await api.get("/search", { params: { q } });
  return data;
}

// -------------------- Pantry → AI suggestions
export async function suggestByPantry(ingredients) {
  // `ingredients` can be an array or comma-separated string; normalize to array
  const items = Array.isArray(ingredients)
    ? ingredients
    : String(ingredients).split(",").map(s => s.trim()).filter(Boolean);

  const { data } = await api.post("/pantry/suggest", { items });
  return data;
}

// -------------------- Create recipe with AI
export async function createRecipeWithAI(payload) {
  const { data } = await api.post("/recipes/ai", payload);
  return data;
}
