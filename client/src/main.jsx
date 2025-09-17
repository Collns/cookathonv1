// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App.jsx";
import Feed from "./pages/Feed.jsx";
import Search from "./pages/Search.jsx";
import CreateRecipe from "./pages/CreateRecipe.jsx";
import Pantry from "./pages/Pantry.jsx";
import Messages from "./pages/Messages.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import Profile from "./pages/Profile.jsx";

import "./styles/globals.css";

const mountEl = document.getElementById("root");
if (!mountEl) {
  document.body.innerHTML =
    '<pre style="padding:16px;font:14px/1.4 system-ui">Missing <div id="root"></div> in index.html</pre>';
} else {
  createRoot(mountEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Feed />} />
            <Route path="search" element={<Search />} />
            <Route path="new" element={<CreateRecipe />} />
            <Route path="pantry" element={<Pantry />} />
            <Route path="messages" element={<Messages />} />
            <Route path="r/:id" element={<RecipeDetail />} />
            <Route path="u/:username" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}