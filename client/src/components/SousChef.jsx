import { useState } from "react";
import { ai, chatbot } from "../lib/apiClient";

export default function SousChef() {
  const [ingredients, setIngredients] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRecommend() {
    try {
      setLoading(true);
      const res = await ai.recommend(ingredients);
      setResult({ type: "recommend", data: res });
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    try {
      setLoading(true);
      const res = await chatbot.ask(question);
      setResult({ type: "chat", data: res });
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: "1rem" }}>
      <h2>👨‍🍳 Sous Chef – Your AI Kitchen Assistant</h2>
      <p>Get recipe ideas or ask cooking questions.</p>

      {/* Ingredients input */}
      <div style={{ marginBottom: "1rem" }}>
        <label><b>What ingredients do you have?</b></label>
        <input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. rice, beans, tomatoes"
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
        <button onClick={handleRecommend} disabled={loading} style={{ marginTop: "8px" }}>
          🍳 Recommend Recipes
        </button>
      </div>

      {/* Chat input */}
      <div style={{ marginBottom: "1rem" }}>
        <label><b>Ask Sous Chef anything:</b></label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How long should I boil plantains?"
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
        <button onClick={handleAsk} disabled={loading} style={{ marginTop: "8px" }}>
          🤖 Ask
        </button>
      </div>

      {/* Results */}
      {loading && <p>Loading...</p>}
      {result && (
        <div style={{ marginTop: "1rem", padding: "10px", border: "1px solid #ddd" }}>
          <h4>Result</h4>
          {result.error && <p style={{ color: "red" }}>{result.error}</p>}

          {/* Cleaned-up Recommend */}
          {result.type === "recommend" && (
            <div>
              {Array.isArray(result.data?.suggestions) ? (
                result.data.suggestions.map((r, i) => (
                  <div key={i} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                    <h4>{r.title || "Untitled Recipe"}</h4>
                    <p><b>Ingredients:</b> {r.ingredients}</p>
                    <p><b>Instructions:</b> {r.instructions}</p>
                  </div>
                ))
              ) : (
                <p>No recipe suggestions found.</p>
              )}
            </div>
          )}

          {/* Cleaned-up Chat */}
          {result.type === "chat" && (
            <p>{result.data.reply || result.data.answer || "No answer provided."}</p>
          )}
        </div>
      )}
    </section>
  );
}
