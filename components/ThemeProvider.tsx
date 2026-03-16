"use client";

import { useEffect } from "react";

// Runs on mount — reads localStorage and applies theme before first paint
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return <>{children}</>;
}
