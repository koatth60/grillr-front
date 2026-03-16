import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import QuestionPanel from "@/components/QuestionPanel";

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) notFound();

  const answered = interviewSession.questions.filter((q) => q.answer).length;
  const total = interviewSession.questions.length;
  const allAnswered = answered === total && total > 0;
  const scores = interviewSession.questions.filter((q) => q.score !== null).map((q) => q.score!);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const avgColor = avg === null ? "var(--muted)" : avg >= 7 ? "var(--green)" : avg >= 5 ? "var(--amber)" : "var(--red)";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 13 }}>~/dashboard</Link>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--green)" }}>{interviewSession.jobTitle}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>{answered}/{total} answered</span>
          {avg !== null && <span style={{ color: avgColor, fontWeight: 700 }}>avg: {avg}/10</span>}
          {allAnswered && (
            <Link href={`/interview/${id}/report`} style={{ background: "var(--green)", color: "#0d1117", padding: "5px 12px", borderRadius: 4, textDecoration: "none", fontWeight: 600, fontSize: 12 }}>
              $ report →
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 4 }}>
            // {new Date(interviewSession.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{interviewSession.jobTitle}</h1>
        </div>

        {interviewSession.questions.map((q, i) => (
          <QuestionPanel key={q.id} question={q} index={i} />
        ))}

        {allAnswered && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--green)", borderRadius: 8, padding: 20, textAlign: "center" }}>
            <p style={{ color: "var(--green)", fontWeight: 700, marginBottom: 8 }}>✓ all questions answered</p>
            <Link href={`/interview/${id}/report`} style={{ color: "var(--green)", textDecoration: "none", fontWeight: 600 }}>
              $ generate-report →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
