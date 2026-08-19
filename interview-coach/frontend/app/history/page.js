"use client";

import { useState, useEffect } from "react";
//import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function HistoryPage() {
    const [list, setList] = useState([]);
    const [openSessions, setOpenSessions] = useState(new Set()); 
    const [selectedQ, setSelectedQ] = useState(null); 

    async function fetchAllSessions(){
        const res = await fetch(`${API_BASE}/sessions`)
        const data = await res.json();
        setList(data);
    }

    function toggleSession(sessionId){
        setOpenSessions(prev => {
            const next = new Set(prev);
            if (next.has(sessionId)){
                next.delete(sessionId);
            }
            else {
                next.add(sessionId);
            }
            return next
        });
    }

    useEffect(() => {
        fetchAllSessions();
    }, [])


    return (
        <main className="max-w-2xl mx-auto pt-16 px-6 pb-16">
            <h1 className="text-2xl font-semibold mb-6">Session History</h1>

            <div className="space-y-3">
                {list.map(session => {
                    const isOpen = openSessions.has(session.id);
                    return (
                        <div key={session.id} className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                            <button
                                onClick={() => toggleSession(session.id)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition"
                            >
                                <span className="font-medium">{session.topic}</span>
                                <span className="text-slate-500">{isOpen ? "▲" : "▼"}</span>
                            </button>

                            {isOpen && (
                                <div className="border-t border-slate-800">
                                    {session.questions.map((question, index) => (
                                        <div
                                            key={question.id}
                                            className="flex items-center justify-between px-5 py-3 border-b border-slate-800 last:border-b-0"
                                        >
                                            <span className="text-slate-300">Question {index + 1}</span>

                                            {question.correctness_score === null ? (
                                                <span className="text-slate-500 italic">Incomplete</span>
                                            ) : (
                                                <span className="text-slate-300">
                                                    {question.correctness_score}/10 &nbsp; {question.communication_score}/10
                                                </span>
                                            )}
                                        <button onClick{() => setSelectedQ(question)}
                                            className="text-slate-500 hover:text-slate-300 cursor-pointer text-sm">
                                                View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>



        
    </main>
);
}

    // return (
    //     <ul>
    //         {list.map(session => (
    //             <li key={session.id}>
    //                 <span onClick={() => toggleSession(session.id)} style={{ cursor: "pointer" }}>
    //                     {session.topic}
    //                 </span>
    //                 {openSessions.has(session.id) && (
    //                     <ul>
    //                         {session.questions.map(question => {
    //                             if (!question.answer_text) return null;
    //                             return (
    //                                 <li key={question.id}>
    //                                     {question.correctness_score === null
    //                                         ? "Incomplete"
    //                                         : `Correctness: ${question.correctness_score}, Communication: ${question.communication_score}`}
    //                                 </li>
    //                             );
    //                         })}
    //                     </ul>
    //                 )}
    //             </li>
    //         ))}
    //     </ul>
    // );

//     return ( <ul>
//             {list.map(session => 
//                 <li key={session.id}>{session.topic}
//                 {session.questions.map(question => 
//                     <li key={question.id}>
//                         Correctness: {question.correctness_score},
//                         Communication: {question.communication_score}</li>
//                 )}</li>
//             )}
//         </ul>
//     );
// }