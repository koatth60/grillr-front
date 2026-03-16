import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NewSessionForm from "@/components/NewSessionForm";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    include: { questions: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg text-purple-400">InterviewPrep AI</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">{session.user.email}</span>
          <Link
            href="/api/auth/signout"
            className="text-slate-500 hover:text-white transition-colors"
          >
            Sign out
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* New session form */}
        <section>
          <h2 className="text-xl font-semibold mb-4">New Interview Session</h2>
          <NewSessionForm />
        </section>

        {/* Past sessions */}
        {sessions.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            <div className="space-y-3">
              {sessions.map((s) => {
                const answered = s.questions.filter((q) => q.answer).length;
                const avgScore =
                  answered > 0
                    ? Math.round(
                        s.questions
                          .filter((q) => q.score)
                          .reduce((acc, q) => acc + (q.score ?? 0), 0) /
                          answered
                      )
                    : null;

                return (
                  <Link
                    key={s.id}
                    href={`/interview/${s.id}`}
                    className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{s.jobTitle}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()} ·{" "}
                        {answered}/{s.questions.length} answered
                      </p>
                    </div>
                    {avgScore !== null && (
                      <div
                        className={`text-2xl font-bold ${
                          avgScore >= 7
                            ? "text-green-400"
                            : avgScore >= 5
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {avgScore}/10
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
