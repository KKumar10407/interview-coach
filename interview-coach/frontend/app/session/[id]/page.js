"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function SessionPage({ params }) {
  const searchParams = useSearchParams();

  const questionId = searchParams.get("questionId");
  //const questionText = searchParams.get("q") || "Loading question…";

  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [submitting, setSubmitting] = useState(false);

  const current = history[currentIndex] || null;
  const question = current ? current.question : null;
  const answer = current ? current.answer : "";
  const feedback = current ? current.feedback : null;

  //allows for the answer to be updated if we went back previously
  function updateAnswer(newAnswer){
    setHistory(prev =>
      prev.map((entry, i) => (i === currentIndex ? {...entry, answer : newAnswer } : entry))
    );
  }

  //Changing to normal constants to allow easy movement through the session history
  // const [answer, setAnswer] = useState("");
  // const [question, setQuestion] = useState(null) //creates a new box called question and can fil it with setQuestion
  // const [feedback, setFeedback] = useState(null);
  // const [submitting, setSubmitting] = useState(false);

  async function submitAnswer() {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/questions/${question.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setHistory(prev =>
        prev.map((entry, i) => (i === currentIndex ? {...entry, feedback: data} : entry))
      );
    } catch (err) {
      console.error(err);
      alert("Could not submit answer -- check the Flask backend is running.");
    } finally {
      setSubmitting(false);
    }
  }

  async function fetchQuestion(){
    const res = await fetch(`${API_BASE}/questions/${questionId}`)
    const data = await res.json();
    setHistory([{question: data.question, answer: "", feedback: null}]);
    setCurrentIndex(0); 
  }

  async function nextQuestion(){
    if (currentIndex < history.length - 1){
      setCurrentIndex(currentIndex + 1);
      return; //ensures new question isn't generated
    }
    
    const sessionId = params.id
    try {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setHistory(prev => [...prev, { question: data, answer: "", feedback: null}]);
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      console.error(err);
      alert("Could not load next question -- check the Flask backend is running, or try again in a moment.");
    } 

  }

  function previousQuestion(){
    if (currentIndex > 0){
      setCurrentIndex(currentIndex - 1);
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, [questionId])

  return (
    <main className="max-w-xl mx-auto pt-16 px-6">
      <a href="/" className="text-slate-500 text-sm hover:text-slate-300">
        ← new session
      </a>

      <div className="mt-6 mb-6 rounded-lg bg-slate-900 border border-slate-800 p-5">
        <p className="text-slate-500 text-sm mb-1">Question</p>
        
        <p className="text-lg">{question ? question.prompt : "Loading question..."}</p>
      </div>

      {!feedback ? (
        <>
          <textarea
            className="w-full h-40 rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 mb-4 outline-none focus:border-slate-500"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => updateAnswer(e.target.value)}
          />
          <button
            onClick={submitAnswer}
            disabled={submitting}
            className="w-full rounded-lg bg-slate-100 text-slate-950 font-medium py-3 hover:bg-white transition disabled:opacity-50"
          >
            {submitting ? "Scoring..." : "Submit answer"}
          </button>
        </>
      ) : (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex gap-6">
            <div>
              <p className="text-slate-500 text-xs">Correctness</p>
              <p className="text-2xl font-semibold">{feedback.correctness_score}/10</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Communication</p>
              <p className="text-2xl font-semibold">{feedback.communication_score}/10</p>
            </div>
          </div>
          <p className="text-slate-300">{feedback.feedback}</p>
        </div>
      )}

      <button
        onClick={nextQuestion}
        className="w-full mt-4 rounded-lg bg-slate-800 text-slate-100 font-medium py-3 hover:bg-slate-700 transition"
      >
        {feedback ? "Next question" : "Skip"}
      </button>

    </main>
  );
}
