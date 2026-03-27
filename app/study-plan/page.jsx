"use client";

import { useState, useEffect } from 'react';

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setTimeout(() => {
        setIsActive(false);
        const msg = isBreak ? "Break is over! Time to study." : "Study session complete! Take a 5 min break.";
        alert(msg);
        
        if (!isBreak) {
          setIsBreak(true);
          setTimeLeft(5 * 60);
        } else {
          setIsBreak(false);
          setTimeLeft(25 * 60);
        }
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6 text-center">
      <h3 className="font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
        <i className="fa-solid fa-stopwatch text-red-500"></i>
        Pomodoro Timer
      </h3>
      <p className="text-xs text-gray-500 mb-4">{isBreak ? 'Break Time' : 'Study Focus'}</p>
      
      <div className={`text-4xl font-mono font-bold mb-6 ${isBreak ? 'text-green-500' : 'text-[#1e3a8a]'}`}>
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex justify-center gap-3">
        <button 
          onClick={toggleTimer}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#1e3a8a] hover:bg-blue-800'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetTimer}
          className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function StudyPlan() {
  const [mounted, setMounted] = useState(false);
  const [exams, setExams] = useState([]);
  
  // Form State
  const [selectedExams, setSelectedExams] = useState({});
  const [difficulties, setDifficulties] = useState({});
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [preferredTime, setPreferredTime] = useState('Morning');
  
  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // daily or weekly
  
  // Progress Tracking
  const [completedSlots, setCompletedSlots] = useState({});
  
  // History
  const [savedSchedules, setSavedSchedules] = useState([]);

  useEffect(() => {
    let mTimer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    // Load Exams
    const storedExams = localStorage.getItem('ulab_exams');
    if (storedExams) {
      setTimeout(() => {
        const parsed = JSON.parse(storedExams);
        setExams(parsed);
        
        // Auto-select first 3 exams for convenience if available
        const initialSelected = {};
        const initialDiffs = {};
        parsed.slice(0, 3).forEach(ex => {
          initialSelected[ex.id] = true;
          initialDiffs[ex.id] = 'Medium';
        });
        setSelectedExams(initialSelected);
        setDifficulties(initialDiffs);
      }, 0);
    }

    const saved = localStorage.getItem('ulab_study_schedules');
    if (saved) {
      setTimeout(() => setSavedSchedules(JSON.parse(saved)), 0);
    }
    
    return () => clearTimeout(mTimer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (mounted && savedSchedules.length > 0) {
      localStorage.setItem('ulab_study_schedules', JSON.stringify(savedSchedules));
    }
  }, [savedSchedules, mounted]);

  const handleExamToggle = (examId) => {
    setSelectedExams(prev => {
      const next = { ...prev, [examId]: !prev[examId] };
      if (!next[examId]) {
        // Clean up difficulty if unchecked
        const newDiffs = { ...difficulties };
        delete newDiffs[examId];
        setDifficulties(newDiffs);
      } else {
        setDifficulties(d => ({ ...d, [examId]: 'Medium' }));
      }
      return next;
    });
  };

  const generateSchedule = () => {
    setIsGenerating(true);
    
    // Simulate AI delay
    setTimeout(() => {
      const chosenExams = exams.filter(ex => selectedExams[ex.id]);
      
      if (chosenExams.length === 0) {
        alert("Please select at least one exam to generate a schedule.");
        setIsGenerating(false);
        return;
      }

      // Start time logic
      const timeMap = { 'Morning': 8, 'Afternoon': 14, 'Evening': 18, 'Night': 21 };
      let startHour = timeMap[preferredTime];

      const newSchedule = [];
      const topics = ["Review Core Concepts", "Read Chapter Notes", "Practice Past Papers", "Summarize Key Topics", "Quiz Yourself"];
      const colors = ['border-blue-400 bg-blue-50', 'border-purple-400 bg-purple-50', 'border-green-400 bg-green-50', 'border-orange-400 bg-orange-50'];

      // Generate 7 days
      let slotCounter = 0;
      for (let day = 0; day < 7; day++) {
        const dateDate = new Date();
        dateDate.setDate(dateDate.getDate() + day);
        
        let currentH = startHour;
        let currentM = 0;
        const dailySlots = [];

        // Distribute algorithm (simple round robin based on difficulty weight)
        // Hard = 3 slots, Medium = 2 slots, Easy = 1 slot pool
        let studyPool = [];
        chosenExams.forEach(ex => {
          const w = difficulties[ex.id] === 'Hard' ? 3 : difficulties[ex.id] === 'Medium' ? 2 : 1;
          for(let i=0; i<w; i++) studyPool.push(ex);
        });

        // Shuffle pool
        studyPool = studyPool.sort(() => Math.random() - 0.5);

        for (let slot = 0; slot < hoursPerDay; slot++) {
          const sub = studyPool[slot % studyPool.length] || chosenExams[0];
          const colorClass = colors[chosenExams.findIndex(e => e.id === sub.id) % colors.length];

          const startLabel = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
          
          let endM = currentM + 50;
          let endH = currentH + Math.floor(endM / 60);
          endM = endM % 60;
          const endLabel = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

          let breakM = endM + 10;
          let breakH = endH + Math.floor(breakM / 60);
          breakM = breakM % 60;
          const breakLabel = `${endLabel} - ${String(breakH).padStart(2, '0')}:${String(breakM).padStart(2, '0')}`;

          dailySlots.push({
            id: `s-${day}-${slot}`,
            examId: sub.id,
            subjectCode: sub.subjectCode,
            subjectName: sub.subjectName,
            time: `${startLabel} - ${endLabel}`,
            breakTime: breakLabel,
            topic: topics[Math.floor(Math.random() * topics.length)],
            color: colorClass
          });

          currentH = breakH;
          currentM = breakM;
          slotCounter++;
        }

        newSchedule.push({
          dateLabel: dateDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          dateObj: dateDate.toISOString(),
          slots: dailySlots
        });
      }

      setSchedule({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        days: newSchedule,
        totalSlots: slotCounter,
        completedSlots: {}
      });
      setCompletedSlots({});
      setIsGenerating(false);
    }, 1500); // 1.5s simulated delay
  };

  const handleCompleteSlot = (slotId) => {
    setCompletedSlots(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));
  };

  const saveCurrentSchedule = () => {
    if (!schedule) return;
    const newHistory = [{
      ...schedule,
      completedSlots: completedSlots
    }, ...savedSchedules];
    setSavedSchedules(newHistory);
    alert('Schedule saved to your profile!');
  };

  const loadSchedule = (histId) => {
    const loaded = savedSchedules.find(s => s.id === histId);
    if(loaded) {
      setSchedule(loaded);
      setCompletedSlots(loaded.completedSlots || {});
    }
  };

  const exportCalendar = () => {
    alert("Schedule exported to your device calendar!\n(Simulated action - ICS file downloaded)");
  };

  if (!mounted) return null;

  const totalSlotsCount = schedule?.totalSlots || 0;
  const completedSlotsCount = Object.values(completedSlots).filter(Boolean).length;
  const progressPercent = totalSlotsCount === 0 ? 0 : Math.round((completedSlotsCount / totalSlotsCount) * 100);

  return (
    <div className="min-h-full bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">🤖 AI Smart Study Scheduler</h1>
            <p className="text-gray-600 mt-1">Generate a personalized study plan optimized for your upcoming exams.</p>
          </div>
          
          {savedSchedules.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">History:</span>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                onChange={(e) => { if(e.target.value) loadSchedule(e.target.value); }}
              >
                <option value="">Load previous...</option>
                {savedSchedules.map(saved => (
                  <option key={saved.id} value={saved.id}>
                    {new Date(saved.createdAt).toLocaleDateString()} - {saved.totalSlots} slots
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Area (Form -> Schedule) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Input Form */}
            {!schedule && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-[#1e3a8a]"></i> Configure AI Scheduler
                </h2>
                
                <div className="space-y-6">
                  {/* Select Exams */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-3">1. Select Upcoming Exams to Study For</label>
                    {exams.length === 0 ? (
                      <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm">
                        No exams found. Please add exams in the Exam Routine page first.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exams.map(exam => (
                          <div key={exam.id} className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors ${selectedExams[exam.id] ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="mt-1 w-4 h-4 text-[#1e3a8a] rounded"
                                checked={!!selectedExams[exam.id]}
                                onChange={() => handleExamToggle(exam.id)}
                              />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">{exam.subjectCode}: {exam.subjectName}</p>
                                <p className="text-xs text-gray-500">Date: {exam.date} | Type: {exam.type}</p>
                              </div>
                            </label>
                            
                            {selectedExams[exam.id] && (
                              <div className="pl-7 mt-1">
                                <label className="text-xs text-gray-600 mr-2">Difficulty:</label>
                                <select 
                                  className="text-xs border border-gray-300 rounded p-1 bg-white"
                                  value={difficulties[exam.id] || 'Medium'}
                                  onChange={(e) => setDifficulties({...difficulties, [exam.id]: e.target.value})}
                                >
                                  <option value="Easy">Easy</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Hard">Hard</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">2. Hours Available Per Day</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="12" 
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">AI will split this into 50min study + 10min break blocks.</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">3. Preferred Study Time</label>
                      <select 
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      >
                        <option value="Morning">Morning (8:00 AM)</option>
                        <option value="Afternoon">Afternoon (2:00 PM)</option>
                        <option value="Evening">Evening (6:00 PM)</option>
                        <option value="Night">Night (9:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={generateSchedule}
                    disabled={isGenerating || exams.length === 0}
                    className="w-full mt-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex justify-center items-center gap-2 shadow-md disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <><i className="fa-solid fa-spinner fa-spin"></i> Generating Optimal Plan...</>
                    ) : (
                      <><i className="fa-solid fa-robot"></i> Generate Smart Schedule</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Generated Schedule Display */}
            {schedule && (
              <div className="space-y-6">
                
                {/* Stats & Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-semibold text-gray-600 uppercase">Plan Progress</p>
                      <p className="font-bold text-[#1e3a8a]">{progressPercent}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{completedSlotsCount} of {totalSlotsCount} modules completed</p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <button onClick={saveCurrentSchedule} className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 text-sm">
                      <i className="fa-regular fa-star"></i> Save
                    </button>
                    <button onClick={exportCalendar} className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-[#1e3a8a] font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm">
                      <i className="fa-regular fa-calendar-plus"></i> Export
                    </button>
                    <button onClick={() => setSchedule(null)} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 text-sm">
                      Reset
                    </button>
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-6">
                    <button 
                      onClick={() => setViewMode('daily')} 
                      className={`pb-3 font-semibold px-2 ${viewMode === 'daily' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Day-by-Day View
                    </button>
                    <button 
                      onClick={() => setViewMode('weekly')} 
                      className={`pb-3 font-semibold px-2 ${viewMode === 'weekly' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Weekly Overview
                    </button>
                  </div>

                  <div className="space-y-8">
                    {schedule.days.map((day, dIdx) => (
                      <div key={dIdx} className="relative">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 sticky top-0 bg-white/90 backdrop-blur pb-2 z-10 border-b border-gray-100">
                          {day.dateLabel}
                        </h3>
                        
                        <div className={`grid gap-4 ${viewMode === 'weekly' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                          {day.slots.map((slot, sIdx) => {
                            const isDone = !!completedSlots[slot.id];
                            return (
                              <div key={sIdx} className={`border pl-4 pr-5 py-4 rounded-xl flex gap-4 transition-all duration-300 ${slot.color} ${isDone ? 'opacity-50 grayscale' : 'hover:shadow-md'}`}>
                                <div className="mt-1">
                                  <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded cursor-pointer accent-[#1e3a8a]"
                                    checked={isDone}
                                    onChange={() => handleCompleteSlot(slot.id)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="font-bold text-gray-900 border-b border-black/10 pb-1 mb-1">
                                      {slot.subjectCode} - {slot.subjectName}
                                    </div>
                                    <span className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm whitespace-nowrap ml-2">
                                      {slot.time}
                                    </span>
                                  </div>
                                  <div className="text-sm font-medium text-gray-700 mb-1">
                                    <i className="fa-solid fa-bullseye text-blue-500 w-4"></i> Goal: {slot.topic}
                                  </div>
                                  <div className="text-xs text-gray-500 bg-white/60 inline-block px-2 py-1 rounded mt-1 border border-black/5">
                                    <i className="fa-solid fa-mug-hot text-orange-400 mr-1"></i> 
                                    Break: {slot.breakTime}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PomodoroTimer />

            <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-brain text-purple-500"></i> AI Study Tips
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm">🧠 Active Recall</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">Don&apos;t just re-read notes. Test yourself! Create flashcards from your selected exams and try to answer without looking.</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm">🍅 The Pomodoro Flow</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">Your generated schedule uses the 50/10 structure. 50 mins deep focus, 10 mins complete rest (walk around, don&apos;t check phone).</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm">📚 Interleaving</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">Ensure you mix topics during long days to keep your brain engaged and improve long-term retention.</p>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-white border border-indigo-200 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                Generate Subject Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}