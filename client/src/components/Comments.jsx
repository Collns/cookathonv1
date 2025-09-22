import { useState } from "react";
import { comments } from "../lib/apiClient";

export default function Comments() {
  const [recipeId, setRecipeId] = useState(1);
  const [userId, setUserId] = useState(1);
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  return (
    <section>
      <h2>Comments</h2>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment" />
      <button onClick={async () => {
        await comments.create(recipeId, userId, text);
        setList(await comments.byRecipe(recipeId));
      }}>Post</button>
      <button onClick={async () => setList(await comments.byUser(userId))}>Load User Comments</button>
      <ul>{list.map((c, i) => <li key={i}>{c.text || JSON.stringify(c)}</li>)}</ul>
    </section>
  );
}
