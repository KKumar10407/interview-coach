"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

function SegmentedToggle({ options, value, onChange}){
  return (
    <div className="flex rounded-lg border border-slate-800 overflow-hidden mb-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 text-sm font-medium transition ${
            value === opt.value ? "bg-slate-100 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(2); //diff is set 2 medium
  const [timerMode, setTimerMode] = useState("countdown"); //diff id set to countdown by default
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function startSession() {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      });
      const data = await res.json();
      console.log(data);
      router.push(`/session/${data.session.id}?questionId=${data.question.id}&timerMode=${timerMode}`);
    } catch (err) {
      console.error(err);
      alert("Could not start session -- is the Flask backend running on :5000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto pt-24 px-6">
      <a href="/history"
        className="absolute top-6 right-6 rounded-lg bg-slate-800 text-slate-100 text-sm font-medium px-4 py-2 hover:bg-slate-700 transition">
        History →
      </a>
      
      <h1 className="text-3xl font-semibold mb-2">Interview Coach</h1>
      <p className="text-slate-400 mb-8">
        Pick a topic. Get a real question. Get scored, specific feedback.
      </p>

      <input
        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 mb-4 outline-none focus:border-slate-500"
        placeholder="e.g. arrays and hashmaps, system design basics, behavioral"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && startSession()}
      />

      
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-slate-500 text-center text-green-500 font-bold text-sm mb-1">Difficulty</p>
          <SegmentedToggle
            options={[
            { value: 1, label: "Easy"},
            { value: 2, label: "Medium" },
            { value: 3, label: "Hard"},
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>
        <div className="flex-1">
          <p className="text-slate-500 text-center text-green-500 font-bold text-sm mb-1">Timer</p>
          <SegmentedToggle
            options={[
              { value: "none", label: "No timer"},
              { value: "countdown", label: "Count down" },
              { value: "countup", label: "Count up"},
            ]}
            value={timerMode}
            onChange={setTimerMode}
          />
        </div>
      </div>
      



      <button
        onClick={startSession}
        disabled={loading}
        className="w-full rounded-lg bg-slate-100 text-slate-950 font-medium py-3 hover:bg-white transition disabled:opacity-50"
      >
        {loading ? "Starting..." : "Start mock interview"}
      </button>
    </main>
  );
}
