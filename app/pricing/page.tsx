import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const session = await auth();
  const { demo } = await searchParams;
  let userPlan = "FREE";
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    userPlan = user?.plan ?? "FREE";
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--green)", fontWeight: 700, textDecoration: "none" }}>~/grillr</Link>
        {session?.user
          ? <Link href="/dashboard" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13 }}>dashboard →</Link>
          : <Link href="/login" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13 }}>login</Link>
        }
      </nav>

      <div style={{ maxWidth: 700, margin: "60px auto", padding: "0 24px" }}>
        <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 8 }}>// pricing.md</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>simple pricing</h1>
        <p style={{ color: "var(--muted)", marginBottom: 40 }}>Start free. Upgrade when you need more.</p>

        {demo && (
          <div style={{ background: "#d299221a", border: "1px solid #d2992240", color: "var(--amber)", padding: "10px 14px", borderRadius: 6, marginBottom: 24, fontSize: 13 }}>
            ⚠ demo mode — Stripe test keys not configured. In production, test with card 4242 4242 4242 4242.
          </div>
        )}

        <div className="plans-grid">
          {[
            {
              id: "FREE", name: "free", price: "$0", period: "/forever",
              features: ["3 interview sessions", "5 questions per session", "AI feedback + scoring", "session history"],
              highlight: false,
            },
            {
              id: "PRO", name: "pro", price: "$9", period: "/month",
              features: ["unlimited sessions", "5 questions per session", "AI feedback + scoring", "full performance reports", "email reports", "priority processing"],
              highlight: true,
            },
          ].map((plan) => (
            <div key={plan.id} style={{ background: "var(--surface)", border: `1px solid ${plan.highlight ? "var(--green)" : "var(--border)"}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f85149", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d29922", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
                <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 6 }}>{plan.name}.md</span>
                {plan.id === "PRO" && <span style={{ marginLeft: "auto", background: "var(--green)", color: "var(--btn-text)", fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 3 }}>popular</span>}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: plan.highlight ? "var(--green)" : "var(--text)" }}>{plan.price}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ color: "var(--muted)", fontSize: 13 }}>
                      <span style={{ color: "var(--green)", marginRight: 8 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                {plan.id === "PRO" && userPlan !== "PRO" ? (
                  session?.user ? <CheckoutButton /> : (
                    <Link href="/register" style={{ display: "block", background: "var(--green)", color: "var(--btn-text)", padding: "9px 0", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 13, textAlign: "center" }}>
                      $ get_started →
                    </Link>
                  )
                ) : (
                  <div style={{ background: "var(--surface2)", color: "var(--muted)", padding: "9px 0", borderRadius: 4, textAlign: "center", fontSize: 13 }}>
                    {plan.id === userPlan ? "// current plan" : "free"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
