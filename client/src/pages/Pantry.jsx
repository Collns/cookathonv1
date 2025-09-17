import { useState } from "react";
import { suggestByPantry } from "../lib/api.js"; // Fixed import

export default function Pantry() {
  const [input, setInput] = useState("eggs, tomato, pasta");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function generate(e) {
    e?.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await suggestByPantry(input); // Fixed function call
      // Normalize to strings for the simple list UI
      const list =
        Array.isArray(res)
          ? res.map((v) => (typeof v === "string" ? v : (v?.title || JSON.stringify(v))))
          : [];
      setIdeas(list);
    } catch (e2) {
      setErr(e2.message || "Failed to get ideas");
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <form onSubmit={generate}>
        <label className="block font-semibold mb-2">What's in your pantry?</label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </form>

      {loading && <p className="mt-4 text-neutral-500">Thinking…</p>}
      {err && <p className="mt-4 text-red-600">{err}</p>}

      <ul className="mt-4 space-y-2">
        {ideas.map((t, i) => (
          <li key={i} className="rounded-xl border p-3">{t}</li>
        ))}
      </ul>
    </div>
  );
}