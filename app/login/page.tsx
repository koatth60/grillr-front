"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TerminalWindow from "@/components/TerminalWindow";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("authentication failed: invalid credentials");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16, textAlign: "center" }}>~/grillr/auth</p>

        <TerminalWindow title="login.sh">
          <div style={{ padding: 24 }}>
            <p style={{ color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>$ authenticate --user</p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 24 }}>Enter your credentials to continue.</p>

            {error && (
              <div style={{ background: "#f851491a", border: "1px solid #f8514940", color: "var(--red)", padding: "8px 12px", borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "email", type: "email", value: email, set: setEmail, placeholder: "user@example.com" },
                { label: "password", type: "password", value: password, set: setPassword, placeholder: "••••••••" },
              ].map(({ label, type, value, set, placeholder }) => (
                <div key={label}>
                  <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 6 }}>
                    <span style={{ color: "var(--blue)" }}>--{label}</span>
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    required
                    placeholder={placeholder}
                    style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--green)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? "var(--surface2)" : "var(--green)", color: "var(--btn-text)", border: "none", padding: "10px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, marginTop: 4 }}
              >
                {loading ? "authenticating..." : "$ login →"}
              </button>
            </form>

            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 20, textAlign: "center" }}>
              no account?{" "}
              <Link href="/register" style={{ color: "var(--blue)", textDecoration: "none" }}>register --free</Link>
            </p>
          </div>
        </TerminalWindow>
      </div>
    </main>
  );
}
