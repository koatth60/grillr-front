"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import TerminalWindow from "@/components/TerminalWindow";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
  }

  const fields = [
    { key: "name", label: "name", type: "text", placeholder: "Jane Doe" },
    { key: "email", label: "email", type: "email", placeholder: "user@example.com" },
    { key: "password", label: "password", type: "password", placeholder: "min 8 chars" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16, textAlign: "center" }}>~/grillr/auth</p>

        <TerminalWindow title="register.sh">
          <div style={{ padding: 24 }}>
            <p style={{ color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>$ register --new-user</p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 24 }}>Free plan · 3 sessions included.</p>

            {error && (
              <div style={{ background: "#f851491a", border: "1px solid #f8514940", color: "var(--red)", padding: "8px 12px", borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 6 }}>
                    <span style={{ color: "var(--blue)" }}>--{label}</span>
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
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
                {loading ? "creating account..." : "$ register →"}
              </button>
            </form>

            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 20, textAlign: "center" }}>
              have an account?{" "}
              <Link href="/login" style={{ color: "var(--blue)", textDecoration: "none" }}>login</Link>
            </p>
          </div>
        </TerminalWindow>
      </div>
    </main>
  );
}
