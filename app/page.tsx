import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", padding: "0 24px" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 960, margin: "0 auto" }}>
        <span style={{ color: "var(--green)", fontWeight: 700 }}>~/interview-prep-ai</span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13 }}>pricing</Link>
          <Link href="/login" style={{ color: "var(--blue)", textDecoration: "none", fontSize: 13 }}>sign_in</Link>
          <Link href="/register" style={{ background: "var(--green)", color: "#0d1117", padding: "6px 14px", borderRadius: 4, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>get_started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 960, margin: "80px auto 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>// powered by claude AI</p>
          <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
            Ace your next<br />
            <span style={{ color: "var(--green)" }}>tech interview</span>
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 32, fontSize: 14 }}>
            Paste any job description → get 5 AI-tailored questions →
            answer them → receive expert feedback with a score.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/register" style={{ background: "var(--green)", color: "#0d1117", padding: "10px 20px", borderRadius: 4, textDecoration: "none", fontWeight: 700 }}>
              $ start --free
            </Link>
            <Link href="/pricing" style={{ border: "1px solid var(--border)", color: "var(--muted)", padding: "10px 20px", borderRadius: 4, textDecoration: "none" }}>
              view pricing
            </Link>
          </div>
        </div>

        {/* Terminal preview */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f85149", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d29922", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
            <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>session.tsx</span>
          </div>
          <div style={{ padding: 20, fontSize: 13, lineHeight: 2 }}>
            <p><span style={{ color: "var(--muted)" }}>$</span> <span style={{ color: "var(--green)" }}>generate</span> <span style={{ color: "var(--blue)" }}>--job</span> <span style={{ color: "#f0a868" }}>"Senior React Dev"</span></p>
            <p style={{ color: "var(--muted)" }}>✓ Analysing job description...</p>
            <p style={{ color: "var(--muted)" }}>✓ Generating 5 questions...</p>
            <p style={{ color: "var(--green)", marginTop: 8 }}>[01] What is the virtual DOM and why does React use it?</p>
            <p style={{ color: "var(--green)" }}>[02] Explain useCallback vs useMemo.</p>
            <p style={{ color: "var(--green)" }}>[03] How would you optimise a slow React app?</p>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>$ <span className="cursor" /></p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 960, margin: "80px auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { step: "01", color: "var(--blue)", title: "paste job description", desc: "Any role. Claude reads the JD and understands what the company actually wants." },
          { step: "02", color: "var(--green)", title: "get tailored questions", desc: "5 questions mixing technical, behavioural, and situational angles for that exact role." },
          { step: "03", color: "var(--amber)", title: "get scored feedback", desc: "Each answer scored 1–10 with detailed written feedback from Claude." },
        ].map((f) => (
          <div key={f.step} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 20 }}>
            <p style={{ color: f.color, fontWeight: 700, marginBottom: 8 }}>[{f.step}]</p>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>{f.title}</p>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <footer style={{ maxWidth: 960, margin: "0 auto 40px", borderTop: "1px solid var(--border)", paddingTop: 24 }}>
        <p style={{ color: "var(--muted)", fontSize: 12 }}>// built by Carlos Mendoza · <a href="https://github.com/koatth60" style={{ color: "var(--blue)", textDecoration: "none" }}>github.com/koatth60</a></p>
      </footer>
    </main>
  );
}
