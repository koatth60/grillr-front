type Session = { questions: { score: number | null; answer: string | null }[]; createdAt: Date | string };

export default function DashboardStats({ sessions }: { sessions: Session[] }) {
  const total = sessions.length;
  const allScores = sessions.flatMap((s) => s.questions.map((q) => q.score)).filter((s): s is number => s !== null);
  const avg = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;
  const best = allScores.length > 0 ? Math.max(...allScores) : null;
  const week = sessions.filter((s) => new Date(s.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;

  const stats = [
    { key: "sessions", label: "total_sessions", value: total, color: "var(--text)" },
    { key: "avg", label: "avg_score", value: avg !== null ? `${avg}/10` : "—", color: avg === null ? "var(--muted)" : avg >= 7 ? "var(--green)" : avg >= 5 ? "var(--amber)" : "var(--red)" },
    { key: "best", label: "best_score", value: best !== null ? `${best}/10` : "—", color: best !== null ? "var(--purple)" : "var(--muted)" },
    { key: "week", label: "this_week", value: week, color: "var(--blue)" },
  ];

  return (
    <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {stats.map((s) => (
        <div key={s.key} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
          <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 6 }}>// {s.label}</p>
          <p style={{ color: s.color, fontSize: 28, fontWeight: 700 }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
