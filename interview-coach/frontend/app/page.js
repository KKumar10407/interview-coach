"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function startSession() {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      router.push(`/session/${data.session.id}?questionId=${data.question.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not start session -- is the Flask backend running on :5000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto pt-24 px-6">
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
