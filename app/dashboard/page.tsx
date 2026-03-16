import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NewSessionForm from "@/components/NewSessionForm";
import DashboardStats from "@/components/DashboardStats";
import UpgradePrompt from "@/components/UpgradePrompt";
import { PLANS } from "@/lib/stripe";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { upgraded } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { sessions: { include: { questions: { orderBy: { order: "asc" } } }, orderBy: { createdAt: "desc" } } },
  });
  if (!user) redirect("/login");

  const isPro = user.plan === "PRO";
  const count = user.sessions.length;
  const atLimit = !isPro && count >= PLANS.FREE.sessions;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "var(--green)", fontWeight: 700 }}>~/dashboard</span>
          {isPro && <span style={{ background: "var(--purple)", color: "var(--btn-text)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>PRO</span>}
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>{user.email}</span>
          <Link href="/settings" style={{ color: "var(--muted)", textDecoration: "none" }}>settings</Link>
          <Link href="/api/auth/signout" style={{ color: "var(--red)", textDecoration: "none" }}>exit</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {upgraded && (
          <div style={{ background: "#3fb9501a", border: "1px solid #3fb95040", color: "var(--green)", padding: "10px 16px", borderRadius: 6, fontSize: 13 }}>
            ✓ upgraded to pro — unlimited sessions unlocked
          </div>
        )}

        {user.sessions.length > 0 && <DashboardStats sessions={user.sessions} />}

        {!isPro && <UpgradePrompt used={count} limit={PLANS.FREE.sessions} />}

        {/* New session */}
        <div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10 }}>// new interview session</p>
          {atLimit ? (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, textAlign: "center" }}>
              <p style={{ color: "var(--muted)", marginBottom: 16 }}>free session limit reached</p>
              <Link href="/pricing" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 600 }}>$ upgrade --plan=pro →</Link>
            </div>
          ) : (
            <NewSessionForm isPro={isPro} used={count} limit={PLANS.FREE.sessions} />
          )}
        </div>

        {/* Session history */}
        {user.sessions.length > 0 && (
          <div>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10 }}>// session history</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {user.sessions.map((s) => {
                const answered = s.questions.filter((q) => q.answer).length;
                const scores = s.questions.filter((q) => q.score !== null).map((q) => q.score!);
                const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
                const allDone = answered === s.questions.length && s.questions.length > 0;
                const color = avg === null ? "var(--muted)" : avg >= 7 ? "var(--green)" : avg >= 5 ? "var(--amber)" : "var(--red)";

                return (
                  <div key={s.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ color: "var(--muted)", fontSize: 11, flexShrink: 0 }}>
                      {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <Link href={`/interview/${s.id}`} style={{ color: "var(--text)", textDecoration: "none", flex: 1, fontWeight: 500 }}>
                      {s.jobTitle}
                    </Link>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{answered}/{s.questions.length}</span>
                    {avg !== null && (
                      <span style={{ color, fontWeight: 700, fontSize: 13, minWidth: 40, textAlign: "right" }}>{avg}/10</span>
                    )}
                    {allDone && (
                      <Link href={`/interview/${s.id}/report`} style={{ color: "var(--blue)", textDecoration: "none", fontSize: 12, flexShrink: 0 }}>
                        {s.report ? "report →" : "gen report →"}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
