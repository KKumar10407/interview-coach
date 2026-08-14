"use client";

import { useState, useEffect } from "react";
//import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function HistoryPage() {
    const [list, setList] = useState([]);
    const [openSessions, setOpenSessions] = useState(new Set());   // ← new


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

    return (                                                        // ← replaces old return
        <ul>
            {list.map(session => (
                <li key={session.id}>
                    <span onClick={() => toggleSession(session.id)} style={{ cursor: "pointer" }}>
                        {session.topic}
                    </span>
                    {openSessions.has(session.id) && (
                        <ul>
                            {session.questions.map(question => {
                                if (!question.answer_text) return null;
                                return (
                                    <li key={question.id}>
                                        {question.correctness_score === null
                                            ? "Incomplete"
                                            : `Correctness: ${question.correctness_score}, Communication: ${question.communication_score}`}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

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