import { useState, useEffect } from "react";
import { comments, likes } from "../lib/apiClient";

export default function RecipeCard({ recipe }) {
  const [commentList, setCommentList] = useState([]);
  const [text, setText] = useState("");

  const [likeCount, setLikeCount] = useState(recipe.likeCount || 0);
  const [userLiked, setUserLiked] = useState(false);

  const userId = 1; // TODO: replace with logged-in user id

  useEffect(() => {
    loadComments();
    loadLikes();
  }, []);

  /* -------------------- Comments -------------------- */
  async function loadComments() {
    try {
      const res = await comments.byRecipe(recipe.id);
      setCommentList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error loading comments:", err);
      setCommentList([]);
    }
  }

  async function addComment() {
    if (!text) return;
    try {
      await comments.create(recipe.id, userId, text);
      setText("");
      loadComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  }

  /* -------------------- Likes -------------------- */
  async function loadLikes() {
    try {
      const res = await likes.byRecipe(recipe.id); // array of Like rows
      setLikeCount(res.length);
      setUserLiked(res.some((l) => l.userId === userId));
    } catch (err) {
      console.error("Error loading likes:", err);
      setLikeCount(recipe.likeCount || 0); // fallback to cached count
      setUserLiked(false);
    }
  }

  async function toggleLike() {
    try {
      if (userLiked) {
        await likes.remove(recipe.id, userId);
      } else {
        await likes.add(recipe.id, userId);
      }
      await loadLikes();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  /* -------------------- UI -------------------- */
  return (
    <div
      style={{
        margin: "15px 0",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h3>{recipe.title}</h3>
      <p>
        <b>Ingredients:</b> {recipe.ingredients}
      </p>
      <p>
        <b>Instructions:</b> {recipe.instructions}
      </p>

      {/* ❤️ Like button */}
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={toggleLike}
          style={{
            background: userLiked ? "#ff4d6d" : "#eee",
            color: userLiked ? "white" : "black",
            border: "none",
            borderRadius: "20px",
            padding: "6px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {userLiked ? "💖 Unlike" : "🤍 Like"} ({likeCount})
        </button>
      </div>

      {/* 💬 Comments */}
      <div>
        <h4>Comments</h4>
        {commentList.length === 0 && <p>No comments yet.</p>}
        <ul>
          {commentList.map((c, i) => (
            <li key={i}>
              <b>User {c.userId}:</b> {c.content}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "8px" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            style={{ padding: "5px", width: "70%" }}
          />
          <button onClick={addComment} style={{ marginLeft: "8px" }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
