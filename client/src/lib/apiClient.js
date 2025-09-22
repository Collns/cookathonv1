const API_BASE = "http://localhost:5050/api";

async function http(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.error || data?.message || res.status);
  return data;
}

/* AI */
export const ai = {
  format: (instructions) => http("/ai/format", { method: "POST", body: { instructions } }),
  title: (ingredients) => http("/ai/title", { method: "POST", body: { ingredients } }),
  recommend: (ingredients) => http("/ai/recommend", { method: "POST", body: { ingredients } }),
};

/* Chatbot */
export const chatbot = {
  ask: (message) => http("/chatbot", { method: "POST", body: { message } }),
};

/* Likes */
export const likes = {
  add: (recipeId, userId) =>
    http("/likes", { method: "POST", body: { recipeId, userId } }),

  remove: (recipeId, userId) =>
    http("/likes", { method: "DELETE", body: { recipeId, userId } }),

  byRecipe: (recipeId) => http(`/likes?recipeId=${recipeId}`),
};


/* Comments */
export const comments = {
  create: (recipeId, userId, text) => http("/comments", { method: "POST", body: { recipeId, userId, text } }),
  byRecipe: (id) => http(`/comments?recipeId=${id}`),
  byUser: (id) => http(`/comments?userId=${id}`),
};

/* Admin */
export const admin = {
  users: () => http("/admin/users"),
};

/* Recipes */
export const recipes = {
  all: () => http("/recipes"),              // GET all recipes
  byId: (id) => http(`/recipes/${id}`),     // GET single recipe
};

