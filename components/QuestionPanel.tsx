"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = { id: string; text: string; order: number; answer: string | null; feedback: string | null; score: number | null };

function scoreBar(score: number): string {
  const filled = Math.round(score);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function scoreColor(score: number) {
  if (score >= 7) return "var(--green)";
  if (score >= 5) return "var(--amber)";
  return "var(--red)";
}

export default function QuestionPanel({ question, index }: { question: Question; index: number }) {
  const router = useRouter();
  const [answer, setAnswer] = useState(question.answer ?? "");
  const [feedback, setFeedback] = useState(question.feedback);
  const [score, setScore] = useState(question.score);
  const [loading, setLoading] = useState(false);

  async function submit() {
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

  const num = String(index + 1).padStart(2, "0");

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {/* Question header */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>[{num}]</span>
        <span style={{ color: "var(--text)", lineHeight: 1.6 }}>{question.text}</span>
        {score !== null && (
          <span style={{ marginLeft: "auto", color: scoreColor(score), fontWeight: 700, flexShrink: 0, fontSize: 13 }}>
            {score}/10
          </span>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {!question.answer ? (
          // Answer input
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
              <span style={{ color: "var(--green)", paddingTop: 10, flexShrink: 0 }}>$</span>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                placeholder="type your answer here..."
                style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "8px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none", resize: "vertical" }}
                onFocus={(e) => e.target.style.borderColor = "var(--green)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <button
              onClick={submit}
              disabled={loading || !answer.trim()}
              style={{ background: "transparent", border: "1px solid var(--green)", color: "var(--green)", padding: "6px 14px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 12, opacity: !answer.trim() ? 0.4 : 1 }}
            >
              {loading ? "evaluating..." : "$ submit →"}
            </button>
          </div>
        ) : (
          // Answered state
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* User answer */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: 12 }}>
              <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 6 }}>// your answer</p>
              <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{answer}</p>
            </div>

            {/* AI feedback */}
            {feedback && score !== null && (
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ color: "var(--muted)", fontSize: 11 }}>// ai feedback</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="score-bar" style={{ color: scoreColor(score), fontSize: 11 }}>{scoreBar(score)}</span>
                    <span style={{ color: scoreColor(score), fontWeight: 700, fontSize: 13 }}>{score}/10</span>
                  </div>
                </div>
                <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
