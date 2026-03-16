"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
  order: number;
  answer: string | null;
  feedback: string | null;
  score: number | null;
};

export default function QuestionPanel({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState(question.answer ?? "");
  const [feedback, setFeedback] = useState(question.feedback);
  const [score, setScore] = useState(question.score);
  const [loading, setLoading] = useState(false);

  const alreadyAnswered = !!question.answer;

  async function submitAnswer() {
    if (!answer.trim() || loading) return;
    setLoading(true);

    const res = await fetch(`/api/questions/${question.id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (res.ok) {
      const data = await res.json();
      setFeedback(data.feedback);
      setScore(data.score);
      router.refresh();
    }
    setLoading(false);
  }

  const scoreColor =
    score !== null
      ? score >= 7
        ? "text-green-400"
        : score >= 5
        ? "text-yellow-400"
        : "text-red-400"
      : "";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <p className="text-white font-medium leading-relaxed">{question.text}</p>
      </div>

      {!alreadyAnswered ? (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Type your answer here..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500 mb-1">Your answer</p>
            <p className="text-slate-300 text-sm">{answer}</p>
          </div>

          {feedback && (
            <div className="flex items-start gap-4">
              <div className="flex-1 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-3">
                <p className="text-xs text-purple-400 mb-1">AI Feedback</p>
                <p className="text-slate-300 text-sm">{feedback}</p>
              </div>
              {score !== null && (
                <div className="flex flex-col items-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>
                    {score}
                  </span>
                  <span className="text-xs text-slate-500">/10</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
