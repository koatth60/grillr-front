import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import QuestionPanel from "@/components/QuestionPanel";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const interviewSession = await prisma.interviewSession.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) {
    notFound();
  }

  const answered = interviewSession.questions.filter((q) => q.answer).length;
  const total = interviewSession.questions.length;
  const avgScore =
    answered > 0
      ? Math.round(
          interviewSession.questions
            .filter((q) => q.score)
            .reduce((acc, q) => acc + (q.score ?? 0), 0) / answered
        )
      : null;

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-purple-400 hover:underline text-sm">
          ← Dashboard
        </Link>
        <div className="text-sm text-slate-400">
          {answered}/{total} answered
          {avgScore !== null && (
            <span
              className={`ml-3 font-bold ${
                avgScore >= 7
                  ? "text-green-400"
                  : avgScore >= 5
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              Avg: {avgScore}/10
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{interviewSession.jobTitle}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date(interviewSession.createdAt).toLocaleDateString()}
          </p>
        </div>

        {interviewSession.questions.map((question, i) => (
          <QuestionPanel key={question.id} question={question} index={i} />
        ))}
      </div>
    </main>
  );
}
