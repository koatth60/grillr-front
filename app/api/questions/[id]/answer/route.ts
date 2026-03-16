import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/claude";

// POST /api/questions/:id/answer — submit answer, get AI feedback
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { answer } = await req.json();

  const question = await prisma.question.findUnique({
    where: { id },
    include: { session: true },
  });

  if (!question || question.session.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ask Claude to evaluate the answer
  const { feedback, score } = await evaluateAnswer(
    question.text,
    answer,
    question.session.jobTitle
  );

  const updated = await prisma.question.update({
    where: { id },
    data: { answer, feedback, score },
  });

  return NextResponse.json(updated);
}
