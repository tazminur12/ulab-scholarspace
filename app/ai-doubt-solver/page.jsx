"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIDoubtSolver() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [followUp, setFollowUp] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const bottomRef = useRef(null);

  const subjects = ["All Subjects", "Computer Science", "Mathematics", "Biology", "Physics", "Chemistry", "English", "Business"];

  const exampleQuestions = [
    "Explain deadlock in OS.",
    "What is database normalization?",
    "Solve this equation: 2x + 5 = 15",
    "How does a React hook work?"
  ];

  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
      try {
        const storedHistory = JSON.parse(localStorage.getItem("ulab_doubt_history") || "[]");
        setHistory(storedHistory);
        setSavedNotes(JSON.parse(localStorage.getItem("ulab_notes") || "[]"));
      } catch (e) { console.error(e); }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (currentAnswer && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentAnswer]);

  const saveToHistory = (qaPair) => {
    const updated = [qaPair, ...history.filter(h => h.id !== qaPair.id)];
    setHistory(updated);
    try {
      localStorage.setItem("ulab_doubt_history", JSON.stringify(updated));
    } catch (e) { console.error(e); }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("ulab_doubt_history");
  };

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setQuery(prev => prev + (prev ? " " : "") + speechResult);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const simulateAIResponse = (q, subj) => {
    const lowerQ = q.toLowerCase();
    
    let answerObj = {
      id: Date.now(),
      query: q,
      subject: subj,
      timestamp: new Date().toLocaleTimeString(),
      type: "general",
      title: "Explanation",
      text: "Here is a breakdown of the concept you asked about. It's important to understand the base principles first.",
      steps: ["Identify the core problem.", "Break it down into smaller parts.", "Apply relevant formulas or logic."],
      examples: ["Think of it like building a house out of bricks."],
      resources: {
        notes: savedNotes.slice(0, 1),
        videos: [{ title: "Introduction to the Topic", channel: "StudyTube", duration: "10:25" }],
        pdfs: [{ title: "Chapter 4 Notes.pdf", pages: 12 }],
        discussions: [{ title: "Exam tips for this chapter?", replies: 4 }]
      }
    };

    if (lowerQ.includes("deadlock")) {
      answerObj.type = "cs-diagram";
      answerObj.title = "Deadlock (Operating Systems)";
      answerObj.text = "A **deadlock** is a situation in a multi-process environment where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.";
      answerObj.steps = [
        "**Mutual Exclusion**: At least one resource must be non-shareable.",
        "**Hold and Wait**: A process is holding at least one resource and waiting for additional resources held by other processes.",
        "**No Preemption**: A resource cannot be taken from a process unless the process releases it.",
        "**Circular Wait**: A set of processes are waiting for each other in a circular form."
      ];
      answerObj.diagram = `
  Process 1 (P1)        Process 2 (P2)
       |                      |
   (Holds R1)             (Holds R2)
       |                      |
   (Wants R2)             (Wants R1)
       \\______________________/
              (Circular Wait!)
      `;
      answerObj.examples = ["Two cars arriving at a narrow one-lane bridge from opposite directions. Neither can move until the other backs up."];
    } else if (lowerQ.includes("normalization")) {
      answerObj.type = "cs-text";
      answerObj.title = "Database Normalization";
      answerObj.text = "**Normalization** is the process of organizing data in a database to reduce redundancy and improve data integrity.";
      answerObj.steps = [
        "**1NF (First Normal Form)**: Ensure all columns are atomic (no multi-valued attributes).",
        "**2NF**: Meet 1NF and ensure no partial dependency (every non-key attribute is fully dependent on the primary key).",
        "**3NF**: Meet 2NF and ensure no transitive dependency (non-key attributes depend only on the primary key)."
      ];
      answerObj.examples = ["If you have a 'Student_Subject' table, instead of putting 'Teacher_Name' there, split it into 'Subjects' and 'Students' tables to avoid repeating the teacher's name."];
    } else if (lowerQ.includes("2x") || lowerQ.includes("equation") || lowerQ.includes("solve")) {
      answerObj.type = "math";
      answerObj.title = "Solving Linear Equation";
      answerObj.text = "Let's solve the algebraic equation **2x + 5 = 15** step-by-step.";
      answerObj.steps = [
        "**Original Equation**: 2x + 5 = 15",
        "**Step 1**: Subtract 5 from both sides to isolate the term with x.\n   2x = 15 - 5\n   2x = 10",
        "**Step 2**: Divide both sides by 2 to solve for x.\n   x = 10 / 2",
        "**Final Answer**: x = 5"
      ];
      answerObj.mathCheck = true;
    } else if (lowerQ.includes("react")) {
      answerObj.type = "programming";
      answerObj.title = "React Hooks";
      answerObj.text = "A **React Hook** is a special function that lets you 'hook into' React features like state and lifecycle methods inside functional components.";
      answerObj.code = `import { useState } from 'react';

function Counter() {
  // useState is a Hook
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`;
      answerObj.steps = [
        "Import the hook from 'react'.",
        "Call it at the top level of your component (not in loops or conditions).",
        "Use the returned values to render UI or trigger side effects."
      ];
    }

    return answerObj;
  };

  const handleAsk = () => {
    if (!query.trim()) return;
    setIsAsking(true);

    setTimeout(() => {
      const response = simulateAIResponse(query, subject);
      setCurrentAnswer(response);
      saveToHistory(response);
      setQuery("");
      setIsAsking(false);
    }, 1200);
  };

  const handleQuickAsk = (q) => {
    setQuery(q);
    // Auto submit
    setIsAsking(true);
    setTimeout(() => {
      const response = simulateAIResponse(q, subject);
      setCurrentAnswer(response);
      saveToHistory(response);
      setQuery("");
      setIsAsking(false);
    }, 1200);
  };

  const loadPreviousAnswer = (qaPair) => {
    setCurrentAnswer(qaPair);
  };

  const handleAction = (action) => {
    if (!currentAnswer) return;
    setIsAsking(true);
    setTimeout(() => {
      let mod = { ...currentAnswer };
      if (action === "simplify") {
        mod.text = "**Simplified:** " + mod.text.replace(/complex|advanced/g, "simple").replace(/intricate/g, "easy");
        mod.steps = ["Just think of it this way:", "1. It's just a set of rules.", "2. Follow the rules to get the result."];
      } else if (action === "example") {
        mod.examples = [...(mod.examples || []), "Here's another real-world analogy: It is like organizing a messy closet so you can find things faster."];
      }
      setCurrentAnswer(mod);
      setIsAsking(false);
    }, 800);
  };

  const handleSaveNote = () => {
    if (!currentAnswer) return;
    const newNote = {
      id: Date.now().toString(),
      title: `Doubt: ${currentAnswer.query}`,
      content: `# ${currentAnswer.title}\n\n${currentAnswer.text}\n\n## Details\n${currentAnswer.steps.map(s=>'- '+s).join('\n')}`,
      subject: currentAnswer.subject || 'General',
      date: new Date().toISOString().split('T')[0],
      isMarkdown: true
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ulab_notes') || '[]');
      localStorage.setItem('ulab_notes', JSON.stringify([newNote, ...existing]));
      alert('Answer saved to your Digital Notebook!');
    } catch(e) {}
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row overflow-hidden pb-4 md:pb-0">
      
      {/* Sidebar: History */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 h-64 md:h-auto">
        <div className="p-4 border-b border-gray-200 bg-[#1e3a8a] text-white flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left"></i> Ask History
          </h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-blue-200 hover:text-white" title="Clear History">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <i className="fa-solid fa-ghost text-3xl mb-2 opacity-50"></i>
              <p className="text-sm">No recent questions.</p>
            </div>
          ) : (
            history.map((h) => (
              <button 
                key={h.id} 
                onClick={() => loadPreviousAnswer(h)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${currentAnswer?.id === h.id ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm' : 'bg-white border-gray-100 text-gray-700 hover:border-blue-200 hover:bg-gray-50'}`}
              >
                <p className="font-semibold text-sm line-clamp-2 leading-tight">{h.query}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">{h.subject}</span>
                  <span>{h.timestamp}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 shrink-0 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-[#fbbf24]"></i> 
              AI Doubt Solver
            </h1>
            <p className="text-sm text-gray-500">Your personal tutor available 24/7.</p>
          </div>
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition">
             <i className="fa-solid fa-times"></i>
          </Link>
        </header>

        {/* Scrollable Answer Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {!currentAnswer && !isAsking ? (
            <div className="max-w-3xl mx-auto mt-[10vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-50">
                <i className="fa-solid fa-robot text-4xl text-blue-600"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What do you want to learn today?</h2>
              <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Ask any question from your lectures, assignments, or general curiosity. I'll break it down step-by-step for you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                {exampleQuestions.map((eq, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleQuickAsk(eq)}
                    className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-3 group"
                  >
                    <i className="fa-regular fa-lightbulb text-yellow-500 mt-1"></i>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{eq}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto pb-40">
              {/* The User Question */}
              <div className="flex justify-end mb-8">
                <div className="bg-blue-600 text-white p-5 rounded-2xl rounded-tr-sm max-w-2xl shadow-md">
                  <p className="text-lg">{currentAnswer?.query || query}</p>
                </div>
              </div>

              {/* Loading State */}
              {isAsking && (
                <div className="flex items-start mb-8">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center shrink-0 border border-blue-50 shadow-sm mr-4">
                    <i className="fa-solid fa-robot text-blue-600 text-sm"></i>
                  </div>
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <span className="ml-2 text-sm font-medium text-gray-500">Tutor is thinking...</span>
                  </div>
                </div>
              )}

              {/* AI Answer */}
              {currentAnswer && !isAsking && (
                <div className="flex items-start mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center shrink-0 border border-blue-50 shadow-sm mr-4 mt-1">
                    <i className="fa-solid fa-robot text-blue-600 text-sm"></i>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl rounded-tl-sm shadow-sm relative text-gray-800">
                      
                      {/* Floating actions */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-50 hover:opacity-100 transition-opacity">
                        <button onClick={handleSaveNote} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition" title="Save to Notes">
                          <i className="fa-solid fa-bookmark"></i>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition" title="Share">
                          <i className="fa-solid fa-share-nodes"></i>
                        </button>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-16">{currentAnswer.title}</h3>
                      
                      {/* Formatted Text */}
                      <p className="text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: currentAnswer.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800 bg-blue-50 px-1 rounded">$1</strong>') }}></p>
                      
                      {/* Diagram representation (if present) */}
                      {currentAnswer.diagram && (
                        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto shadow-inner mb-6 whitespace-pre">
                          {currentAnswer.diagram}
                        </div>
                      )}

                      {/* Code block (if present) */}
                      {currentAnswer.code && (
                        <div className="bg-[#1e293b] text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto shadow-inner mb-6 whitespace-pre">
                          <code dangerouslySetInnerHTML={{ __html: currentAnswer.code.replace(/useState/g, '<span class="text-cyan-400">useState</span>').replace(/return/g, '<span class="text-pink-400">return</span>').replace(/import/g, '<span class="text-purple-400">import</span>').replace(/function/g, '<span class="text-purple-400">function</span>') }} />
                        </div>
                      )}

                      {/* Step by step logic */}
                      {currentAnswer.steps && currentAnswer.steps.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                             <i className="fa-solid fa-list-ol text-blue-500"></i> Step-by-Step Breakdown
                          </h4>
                          <ul className="space-y-3">
                            {currentAnswer.steps.map((step, i) => (
                              <li key={i} className="flex gap-3 text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs shrink-0">{i+1}</span>
                                <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-bold">$1</strong>') }}></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Examples */}
                      {currentAnswer.examples && currentAnswer.examples.length > 0 && (
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-2">
                          <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <i className="fa-solid fa-lightbulb"></i> Examples
                          </h4>
                          <ul className="list-disc list-inside text-orange-900 pl-4 space-y-1">
                            {currentAnswer.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Interactive Feedback / Tutor Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleAction('simplify')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition text-sm flex items-center shadow-sm">
                        <i className="fa-solid fa-down-left-and-up-right-to-center mr-2"></i> Simplify further
                      </button>
                      <button onClick={() => handleAction('example')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition text-sm flex items-center shadow-sm">
                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Give me another example
                      </button>
                      <button className="px-4 py-2 bg-white border border-red-100 text-red-600 font-medium rounded-full hover:bg-red-50 hover:border-red-200 transition text-sm flex items-center shadow-sm">
                        <i className="fa-regular fa-face-frown-open mr-2"></i> I don't understand
                      </button>
                    </div>

                    {/* Related Study Resources */}
                    {currentAnswer.resources && (
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm mt-6">
                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Dive Deeper - Related Materials</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {currentAnswer.resources.notes?.length > 0 && currentAnswer.resources.notes.map((n, i) => (
                             <Link key={'n'+i} href="/notebook" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
                               <i className="fa-solid fa-file-lines text-blue-500 text-xl"></i>
                               <div className="flex-1 min-w-0">
                                 <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Your Note</p>
                                 <p className="text-sm font-semibold text-gray-800 truncate">{n.title}</p>
                               </div>
                             </Link>
                          ))}
                          {currentAnswer.resources.videos?.map((v, i) => (
                             <Link key={'v'+i} href="/youtube-learning" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
                               <i className="fa-brands fa-youtube text-red-500 text-xl"></i>
                               <div className="flex-1 min-w-0">
                                 <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">YouTube</p>
                                 <p className="text-sm font-semibold text-gray-800 truncate">{v.title}</p>
                               </div>
                             </Link>
                          ))}
                          {currentAnswer.resources.pdfs?.map((p, i) => (
                             <Link key={'p'+i} href="/pdf-tools" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">
                               <i className="fa-solid fa-file-pdf text-orange-500 text-xl"></i>
                               <div className="flex-1 min-w-0">
                                 <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Slide Library</p>
                                 <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                               </div>
                             </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={bottomRef}></div>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 shrink-0 z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-blue-100 shadow-inner flex flex-col focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all p-2">
            
            {/* Top Toolbar */}
            <div className="flex items-center gap-2 mb-2 px-2 pt-1 border-b border-gray-50 pb-2">
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1.5 font-medium outline-none"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="text-xs text-gray-400 font-medium px-2 hidden sm:inline">Ctrl + Enter to fast submit</span>
            </div>

            {/* Input Box Area */}
            <div className="flex items-end gap-2 px-2 pb-1 relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAsk();
                }}
                placeholder="Ask any academic doubt you have... (e.g. How does DNA replication work?)"
                className="flex-1 resize-none bg-transparent min-h-12 max-h-32 text-gray-900 placeholder-gray-400 outline-none leading-relaxed px-1 font-medium text-base"
                rows="1"
              ></textarea>
              
              <div className="flex items-center gap-2 h-full pb-1 shrink-0">
                <button 
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse scale-110' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Use Voice Input"
                >
                  <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                </button>
                <button 
                  onClick={handleAsk}
                  disabled={isAsking || !query.trim()}
                  className="bg-[#1e3a8a] text-white font-bold h-10 px-5 rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center gap-2"
                >
                  <span>Ask AI</span>
                  {!isAsking ? <i className="fa-solid fa-paper-plane -mr-1"></i> : <i className="fa-solid fa-spinner fa-spin"></i>}
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
