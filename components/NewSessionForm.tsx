"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSessionForm() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, jobDescription }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/interview/${data.id}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4"
    >
      <div>
        <label className="text-sm text-slate-400 mb-1 block">Job Title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          placeholder="e.g. Senior React Developer"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-1 block">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
          rows={6}
          placeholder="Paste the full job description here..."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span> Generating questions...
          </>
        ) : (
          "Generate Interview Questions →"
        )}
      </button>
    </form>
  );
}
