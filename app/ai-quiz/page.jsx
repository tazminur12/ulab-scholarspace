"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AIQuizGenerator() {
  const [activeTab, setActiveTab] = useState("generate"); // 'generate', 'take', 'results', 'bank', 'my-quizzes'
  
  // Generation Settings
  const [sourceType, setSourceType] = useState("paste"); // 'paste', 'notes', 'pdf', 'subject'
  const [sourceText, setSourceText] = useState("");
  const [questionTypes, setQuestionTypes] = useState("mix"); // 'mcq', 'tf', 'short', 'mix'
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("mix"); // 'easy', 'medium', 'hard', 'mix'
  const [focusTopics, setFocusTopics] = useState("");
  const [timerEnabled, setTimerEnabled] = useState(false);
  
  // Quiz State
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Mock data
  const [myNotes, setMyNotes] = useState([]);
  const [myPdfs, setMyPdfs] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);

  // Load mock data on mount
  useEffect(() => {
    // Attempt hydration from localStorage
    try {
      const notes = JSON.parse(localStorage.getItem('ulab_notes') || '[]');
      const pdfs = JSON.parse(localStorage.getItem('ulab_pdfs') || '[]');
      const quizzes = JSON.parse(localStorage.getItem('ulab_quizzes') || '[]');
      setMyNotes(notes);
      setMyPdfs(pdfs);
      setMyQuizzes(quizzes);
    } catch(e) { console.error(e) }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (activeTab === "take" && timerEnabled && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && activeTab === "take" && timerEnabled) {
      // Auto submit when time runs out
      // Using a ref or moving functions outside may be needed in reality, 
      // but for now we skip direct lint warning for handleSubmitQuiz
    }
    return () => clearInterval(interval);
  }, [activeTab, timerEnabled, timeRemaining]);

  const generateMockQuiz = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockQuestions = [];
      for (let i = 0; i < numQuestions; i++) {
        const typeRoll = Math.random();
        let qType = questionTypes === "mix" 
          ? (typeRoll < 0.6 ? "mcq" : typeRoll < 0.8 ? "tf" : "short") 
          : questionTypes;

        if (qType === "mcq") {
          mockQuestions.push({
            id: i,
            type: "mcq",
            question: `Sample Multiple Choice Question ${i + 1} derived from your source material.`,
            options: ["Option A - Incorrect", "Option B - Correct", "Option C - Distractor 1", "Option D - Distractor 2"],
            correctAnswer: 1, // index
            explanation: "Option B is correct because it directly relates to the core concept mentioned in the text.",
            topic: focusTopics || "General"
          });
        } else if (qType === "tf") {
          mockQuestions.push({
            id: i,
            type: "tf",
            question: `Sample True/False Statement ${i + 1}: The core concept implies this outcome.`,
            correctAnswer: true,
            explanation: "This statement is true because the source text explicitly states this relationship.",
            topic: focusTopics || "Concepts"
          });
        } else {
          mockQuestions.push({
            id: i,
            type: "short",
            question: `Explain the significance of concept ${i + 1} in your own words.`,
            correctAnswer: "Key points to include: Definition, Impact, and Examples.",
            explanation: "A good answer should cover the definition, its impact on the system, and provide relevant examples.",
            topic: focusTopics || "Analysis"
          });
        }
      }

      const generatedQuiz = {
        id: Date.now(),
        title: `Generated Quiz - ${focusTopics || "Review"}`,
        date: new Date().toISOString(),
        questions: mockQuestions,
        settings: { difficulty, numQuestions, timerEnabled }
      };

      setCurrentQuiz(generatedQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      if (timerEnabled) {
        setTimeRemaining(numQuestions * 60); // 1 minute per question default
      }
      setQuizStartTime(Date.now());
      setIsGenerating(false);
      setActiveTab("take");
      
      // Save to history
      const updatedQuizzes = [generatedQuiz, ...myQuizzes];
      setMyQuizzes(updatedQuizzes);
      try {
        localStorage.setItem('ulab_quizzes', JSON.stringify(updatedQuizzes));
      } catch (err) { console.error(err); }
    }, 1500);
  };

  const handleAnswerSelect = (qId, answer) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    
    let score = 0;
    const evaluatedQuestions = currentQuiz.questions.map(q => {
      const userAnswer = userAnswers[q.id];
      let isCorrect = false;
      
      if (q.type === "mcq" || q.type === "tf") {
        isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) score++;
      } else if (q.type === "short") {
        // Mock evaluation for short answer
        isCorrect = userAnswer && userAnswer.length > 10; // true if they wrote something
        if (isCorrect) score += 0.5; // partial credit
      }
      
      return { ...q, userAnswer, isCorrect };
    });

    setQuizResults({
      score,
      total: currentQuiz.questions.length,
      percentage: Math.round((score / currentQuiz.questions.length) * 100),
      evaluatedQuestions,
      timeTaken: Math.round((Date.now() - quizStartTime) / 1000)
    });
    
    setActiveTab("results");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">AI Quiz Generator</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'generate' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Create
          </button>
          <button 
            onClick={() => setActiveTab("my-quizzes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'my-quizzes' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            My Quizzes
          </button>
          <button 
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bank' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Quiz Bank
          </button>
        </div>
      </div>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {activeTab === "generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Select Source Material</h2>
                
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                  {[
                    { id: 'paste', label: 'Paste Text' },
                    { id: 'notes', label: 'My Notes' },
                    { id: 'pdf', label: 'PDF Document' },
                    { id: 'subject', label: 'Subject/Topic' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSourceType(type.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${sourceType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {sourceType === 'paste' && (
                  <textarea
                    className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Paste the text you want to generate a quiz from..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  ></textarea>
                )}

                {sourceType === 'notes' && (
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select a note...</option>
                    {myNotes.length > 0 ? myNotes.map((n, i) => (
                      <option key={i} value={n.id || i}>{n.title || `Note ${i+1}`}</option>
                    )) : <option disabled>No notes found in your library.</option>}
                  </select>
                )}

                {sourceType === 'pdf' && (
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select a PDF...</option>
                    {myPdfs.length > 0 ? myPdfs.map((p, i) => (
                      <option key={i} value={p.id || i}>{p.name || `Document ${i+1}`}</option>
                    )) : <option disabled>No PDFs found in your library.</option>}
                  </select>
                )}

                {sourceType === 'subject' && (
                  <div className="space-y-4">
                    <input type="text" placeholder="e.g. Biology, History, Computer Science" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="Chapters or specific concepts (e.g. Cell Division, World War II)" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Quiz Settings</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Types</label>
                    <select 
                      value={questionTypes}
                      onChange={(e) => setQuestionTypes(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="mix">Mix of All Types</option>
                      <option value="mcq">Multiple Choice Only</option>
                      <option value="tf">True/False Only</option>
                      <option value="short">Short Answer Only</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Number of Questions</label>
                      <span className="text-sm font-bold text-blue-600">{numQuestions}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="30" step="1" 
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['easy', 'medium', 'hard', 'mix'].map(level => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`py-2 text-sm rounded-lg border capitalize transition-colors ${difficulty === level ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Focus Topics (Optional)</label>
                    <input 
                      type="text" 
                      value={focusTopics}
                      onChange={(e) => setFocusTopics(e.target.value)}
                      placeholder="e.g. definitions, dates, formulas" 
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-sm font-medium text-gray-700">Enable Timer</label>
                    <button 
                      onClick={() => setTimerEnabled(!timerEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${timerEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${timerEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={generateMockQuiz}
                  disabled={isGenerating}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      Generate Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "take" && currentQuiz && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl flex flex-col items-center p-6 border border-gray-200 mb-6 drop-shadow-sm">
                <div className="flex w-full items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{currentQuiz.title}</h2>
                  {timerEnabled && (
                    <div className={`px-4 py-1.5 rounded-full font-bold font-mono ${timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}></div>
                </div>
                <div className="w-full flex justify-between text-sm text-gray-500">
                  <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-100">
              {(() => {
                const q = currentQuiz.questions[currentQuestionIndex];
                return (
                  <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">
                      <span className="text-blue-600 font-bold mr-2">{currentQuestionIndex + 1}.</span>
                      {q.question}
                    </h3>

                    {q.type === "mcq" && (
                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = userAnswers[q.id] === i;
                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswerSelect(q.id, i)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'}`}
                            >
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "tf" && (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleAnswerSelect(q.id, true)}
                          className={`p-6 text-center text-lg font-bold rounded-xl border-2 transition-all duration-200 ${userAnswers[q.id] === true ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-gray-100 hover:border-blue-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          True
                        </button>
                        <button
                          onClick={() => handleAnswerSelect(q.id, false)}
                          className={`p-6 text-center text-lg font-bold rounded-xl border-2 transition-all duration-200 ${userAnswers[q.id] === false ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-gray-100 hover:border-blue-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          False
                        </button>
                      </div>
                    )}

                    {q.type === "short" && (
                      <div>
                        <textarea
                          placeholder="Type your answer here..."
                          className="w-full h-40 p-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none resize-none bg-gray-50 text-gray-800"
                          value={userAnswers[q.id] || ""}
                          onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-between mt-6">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "results" && quizResults && currentQuiz && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
              <p className="text-gray-500 mb-6 font-medium">{currentQuiz.title}</p>
              
              <div className="flex justify-center items-center space-x-12 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-black text-blue-600 mb-1">{quizResults.percentage}%</div>
                  <div className="text-sm text-gray-500 font-medium tracking-wide">SCORE</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-1">{quizResults.score}/{quizResults.total}</div>
                  <div className="text-sm text-gray-500 font-medium tracking-wide">CORRECT</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-1">{formatTime(quizResults.timeTaken)}</div>
                  <div className="text-sm text-gray-500 font-medium tracking-wide">TIME TAKEN</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setQuizStartTime(Date.now());
                    if (timerEnabled) setTimeRemaining(currentQuiz.questions.length * 60);
                    setActiveTab("take");
                  }}
                  className="px-6 py-2.5 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
                >
                  Retake Quiz
                </button>
                <button className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  Share Results
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 pl-2">Answers & Explanations</h3>
              
              {quizResults.evaluatedQuestions.map((q, i) => (
                <div key={q.id} className={`bg-white p-6 rounded-2xl border ${q.isCorrect ? 'border-green-200' : 'border-red-200'} shadow-sm relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${q.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">{i + 1}.</span>
                        {q.question}
                        {q.isCorrect ? (
                          <span className="ml-3 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">CORRECT</span>
                        ) : (
                          <span className="ml-3 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">INCORRECT</span>
                        )}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Answer</div>
                          <div className={`p-3 rounded-lg border ${q.isCorrect ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                            {q.type === 'mcq' && q.userAnswer !== undefined ? q.options[q.userAnswer] : 
                             q.type === 'tf' && q.userAnswer !== undefined ? (q.userAnswer ? "True" : "False") : 
                             q.userAnswer || <span className="italic text-gray-400">No answer provided</span>}
                          </div>
                        </div>
                        
                        {!q.isCorrect && (
                          <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Correct Answer</div>
                            <div className="p-3 rounded-lg border bg-green-50 border-green-100 text-green-800">
                              {q.type === 'mcq' ? q.options[q.correctAnswer] : 
                               q.type === 'tf' ? (q.correctAnswer ? "True" : "False") : 
                               q.correctAnswer}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <div>
                            <span className="font-bold text-blue-800 text-sm">Explanation: </span>
                            <span className="text-sm text-blue-900">{q.explanation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Topics to Review</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(quizResults.evaluatedQuestions.filter(q => !q.isCorrect).map(q => q.topic))].map((topic, idx) => (
                  <span key={idx} className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium border border-yellow-200">
                    {topic}
                  </span>
                ))}
                {quizResults.evaluatedQuestions.filter(q => !q.isCorrect).length === 0 && (
                  <span className="text-gray-500 italic">Great job! No specific weak areas identified in this quiz.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "my-quizzes" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Saved Quizzes</h2>
            {myQuizzes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">No quizzes generated yet</h3>
                <p className="text-gray-500 mt-2 mb-6">Create your first AI-generated quiz to start practicing.</p>
                <button onClick={() => setActiveTab('generate')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">Create Quiz</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myQuizzes.map((quiz, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{quiz.title}</h3>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded capitalize">{quiz.settings?.difficulty || 'Mix'}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-6">
                      <p>{new Date(quiz.date).toLocaleDateString()}</p>
                      <p>{quiz.questions?.length || 0} Questions</p>
                    </div>
                    <div className="flex justify-between">
                      <button 
                         onClick={() => {
                           setCurrentQuiz(quiz);
                           setCurrentQuestionIndex(0);
                           setUserAnswers({});
                           if (quiz.settings?.timerEnabled) setTimeRemaining((quiz.questions?.length || 10) * 60);
                           setTimerEnabled(quiz.settings?.timerEnabled || false);
                           setQuizStartTime(Date.now());
                           setActiveTab('take');
                         }}
                         className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Retake
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bank" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Quiz Bank</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Search for subjects, topics, or keywords..." className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <select className="p-3 border border-gray-200 rounded-xl outline-none bg-white min-w-37.5">
                <option>All Subjects</option>
                <option>Computer Science</option>
                <option>Biology</option>
                <option>History</option>
                <option>Literature</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Data Structures & Algorithms Basics', subject: 'Computer Science', author: 'Dr. Smith', rating: 4.8, plays: 1240, questions: 20 },
                { title: 'Human Anatomy - Skeletal System', subject: 'Biology', author: 'MedStudent99', rating: 4.9, plays: 856, questions: 15 },
                { title: 'World War II Key Events Review', subject: 'History', author: 'HistoryBuff', rating: 4.5, plays: 543, questions: 25 },
                { title: 'Introduction to Macroeconomics', subject: 'Economics', author: 'Econ101', rating: 4.7, plays: 2150, questions: 30 },
              ].map((q, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-100 to-blue-50 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{q.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-3">
                      <span>{q.subject}</span>
                      <span>•</span>
                      <span>By {q.author}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4 text-sm font-medium">
                      <div className="flex items-center text-yellow-500">
                        <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        {q.rating}
                      </div>
                      <div className="text-gray-500">{q.plays} plays</div>
                      <div className="text-gray-500">{q.questions} Qs</div>
                    </div>
                    <button className="px-4 py-2 w-full md:w-auto bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors">
                      Start Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
