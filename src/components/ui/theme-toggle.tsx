"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("persona-theme");
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("persona-theme", next);
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: 16,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.06)",
        color: "var(--text)",
        fontWeight: 600,
        cursor: "pointer",
      }}
      type="button"
    >
      {theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    </button>
  );
}
