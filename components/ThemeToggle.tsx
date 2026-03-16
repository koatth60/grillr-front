"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved !== "light");
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--muted)",
        padding: "8px 12px",
        borderRadius: 6,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        zIndex: 1000,
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--green)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--green)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
      }}
    >
      {isDark ? "☀ light" : "◑ dark"}
    </button>
  );
}
