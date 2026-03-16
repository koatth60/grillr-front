"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSessionForm({ isPro, used, limit }: { isPro: boolean; used: number; limit: number }) {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const remaining = isPro ? null : limit - used;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, jobDescription }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/interview/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.error === "FREE_LIMIT_REACHED" ? "free session limit reached — upgrade to continue" : "error: something went wrong");
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* title bar */}
      <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f85149", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d29922", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
        <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>new-session.sh</span>
        {remaining !== null && (
          <span style={{ marginLeft: "auto", color: remaining <= 1 ? "var(--amber)" : "var(--muted)", fontSize: 12 }}>
            {remaining} session{remaining !== 1 ? "s" : ""} remaining
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 20 }}>
        {error && (
          <div style={{ background: "#f851491a", border: "1px solid #f8514940", color: "var(--red)", padding: "8px 12px", borderRadius: 4, marginBottom: 16, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>✗ {error}</span>
            {error.includes("limit") && (
              <Link href="/pricing" style={{ color: "var(--blue)", textDecoration: "none", marginLeft: 12 }}>upgrade →</Link>
            )}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 6 }}>
            <span style={{ color: "var(--blue)" }}>--job-title</span>
          </label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            placeholder="e.g. Senior React Developer"
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "var(--green)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 6 }}>
            <span style={{ color: "var(--blue)" }}>--job-description</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={6}
            placeholder="Paste the full job description here..."
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none", resize: "vertical" }}
            onFocus={(e) => e.target.style.borderColor = "var(--green)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? "var(--surface2)" : "var(--green)", color: "#0d1117", border: "none", padding: "10px 18px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}
        >
          {loading ? "⟳ generating questions..." : "$ generate --questions →"}
        </button>
      </form>
    </div>
  );
}
