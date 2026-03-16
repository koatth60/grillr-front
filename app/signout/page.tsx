"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import TerminalWindow from "@/components/TerminalWindow";

export default function SignOutPage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16, textAlign: "center" }}>~/grillr/auth</p>

        <TerminalWindow title="signout.sh">
          <div style={{ padding: 24 }}>
            <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 4 }}>$ session --terminate</p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 24 }}>Are you sure you want to end your session?</p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ flex: 1, background: "var(--red)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}
              >
                $ confirm --logout
              </button>
              <button
                onClick={() => router.back()}
                style={{ flex: 1, background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)", padding: "10px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
              >
                cancel
              </button>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </main>
  );
}
