"use client";
import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }
  return (
    <button onClick={handle} disabled={loading} style={{ width: "100%", background: loading ? "var(--surface2)" : "var(--green)", color: "var(--btn-text)", border: "none", padding: "9px 0", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>
      {loading ? "redirecting..." : "$ upgrade --pro →"}
    </button>
  );
}
