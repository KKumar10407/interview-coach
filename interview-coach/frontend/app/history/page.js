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
                                        <button onClick={() => {setSelectedQ(question); console.log(selectedQ);}}
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
        
        {selectedQ && (
            <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50"
                onClick={() => setSelectedQ(null)}>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}> 
                    <button
                        onClick={() => setSelectedQ(null)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"> 
            
                            ❌

                    </button>

                    <p className="text-slate-500 text-sm mb-1">Question</p>
                    <p className="text-slate-200 mb-4">{selectedQ.prompt}</p>
                    {selectedQ.correctness_score == null ? (
                        <>
                            <p className="text-slate-300 mt-4">This question is incomplete.</p>
                            <a
                                href={`/session/${selectedQ.session_id}?questionId=${selectedQ.id}`}
                                className
                            >
                            </a>
                        </>

                    ) : (
                    <>
                        <p className="text-slate-500 text-sm mt-4 mb-1">Answer</p>
                        <p className="text-slate-200 mb-4">{selectedQ.answer_text}</p>

                        <div className="flex gap-6 mb-3">
                            <div>
                                <p className="text-slate-500 text-xs">Correctness</p>
                                <p className="text-x1 font-semibold">{selectedQ.correctness_score}/10</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs">Communication</p>
                                <p className="text-x1 font-semibold">{selectedQ.communication_score}/10</p>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm mb-1">Feedback</p>
                        <p className="text-slate-300">{selectedQ.feedback}</p>
                    </>
                    )}
                </div>
            </div>
        )}




    </main>
    );
}

//note for later: stopPropogation helps it so that the popup doesnt close on contact. only clicking outside the box and on X would close it

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