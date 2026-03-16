"use client";
import Link from "next/link";

export default function UpgradePrompt({ used, limit }: { used: number; limit: number }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--amber)", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>
        <span style={{ color: "var(--amber)" }}>⚠</span> {used}/{limit} free sessions used
        <span style={{ color: "var(--muted)", marginLeft: 12 }}>// upgrade for unlimited access</span>
      </p>
      <Link href="/pricing" style={{ color: "var(--green)", textDecoration: "none", fontSize: 13, fontWeight: 600, flexShrink: 0, marginLeft: 16 }}>
        $ upgrade →
      </Link>
    </div>
  );
}
