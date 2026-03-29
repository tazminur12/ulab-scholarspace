"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GPACalculator() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('semester'); // semester | cumulative | what-if | progress

  // Data Mocks
  const gradesMap = [
    { label: 'A+', points: 4.00 },
    { label: 'A', points: 3.75 },
    { label: 'A-', points: 3.50 },
    { label: 'B+', points: 3.25 },
    { label: 'B', points: 3.00 },
    { label: 'B-', points: 2.75 },
    { label: 'C+', points: 2.50 },
    { label: 'C', points: 2.25 },
    { label: 'D', points: 2.00 },
    { label: 'F', points: 0.00 },
  ];

  const enrolledSubjectsMock = [
    { id: '1', code: 'CSE 201', name: 'Data Structures', credits: 3 },
    { id: '2', code: 'CSE 202', name: 'Data Structures Lab', credits: 1 },
    { id: '3', code: 'MAT 201', name: 'Linear Algebra', credits: 3 },
    { id: '4', code: 'ENG 102', name: 'English Composition II', credits: 3 },
    { id: '5', code: 'PHY 101', name: 'Physics I', credits: 3 },
  ];

  // Semester State
  const [courses, setCourses] = useState([
    { id: Date.now(), subject: 'CSE 201', credits: 3, grade: 'A' },
    { id: Date.now() + 1, subject: 'CSE 202', credits: 1, grade: 'A+' },
    { id: Date.now() + 2, subject: 'MAT 201', credits: 3, grade: 'B+' },
  ]);

  const [semesterResult, setSemesterResult] = useState({ gpa: 0, totalCredits: 0, points: 0 });

  // Cumulative State
  const [prevCredits, setPrevCredits] = useState(45);
  const [prevGPA, setPrevGPA] = useState(3.45);
  const [cumulativeResult, setCumulativeResult] = useState({ newGPA: 0, totalCredits: 0 });

  // What-If State
  const [targetGPA, setTargetGPA] = useState(3.50);
  const [whatIfResult, setWhatIfResult] = useState({ requiredTermGPA: 0, possible: true, message: '' });

  // Degree Progress State
  const totalRequiredCredits = 130;
  
  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
      calculateSemesterGPA();
      calculateCumulativeGPA();
      calculateWhatIf();
    }, 0);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, prevCredits, prevGPA, targetGPA]);

  // Calculations
  const calculateSemesterGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    
    courses.forEach(c => {
      const cr = parseFloat(c.credits) || 0;
      const gr = gradesMap.find(g => g.label === c.grade)?.points || 0;
      totalCredits += cr;
      totalPoints += (cr * gr);
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    setSemesterResult({ gpa: parseFloat(gpa), totalCredits, points: totalPoints });
    return { gpa: parseFloat(gpa), totalCredits, points: totalPoints };
  };

  const calculateCumulativeGPA = () => {
    const sem = calculateSemesterGPA();
    const pCred = parseFloat(prevCredits) || 0;
    const pGPA = parseFloat(prevGPA) || 0;

    const previousPoints = pCred * pGPA;
    const newTotalCredits = pCred + sem.totalCredits;
    const newTotalPoints = previousPoints + sem.points;

    const cgpa = newTotalCredits > 0 ? (newTotalPoints / newTotalCredits).toFixed(2) : pGPA.toFixed(2);
    setCumulativeResult({ newGPA: parseFloat(cgpa), totalCredits: newTotalCredits });
  };

  const calculateWhatIf = () => {
    // what term GPA is needed to hit target cumulative?
    // Formula: TargetGPA = (PrevPoints + (TermCredits * TermGPA)) / (PrevCredits + TermCredits)
    // TermGPA = ((TargetGPA * (PrevCredits + TermCredits)) - PrevPoints) / TermCredits

    const semCreds = calculateSemesterGPA().totalCredits;
    if (semCreds === 0) {
      setWhatIfResult({ requiredTermGPA: 0, possible: false, message: 'Please add courses to current semester to calculate' });
      return;
    }

    const pCred = parseFloat(prevCredits) || 0;
    const pGPA = parseFloat(prevGPA) || 0;
    const tGPA = parseFloat(targetGPA) || 0;
    
    const prevPoints = pCred * pGPA;
    const requiredPoints = (tGPA * (pCred + semCreds)) - prevPoints;
    const reqTermGPA = requiredPoints / semCreds;

    if (reqTermGPA > 4.0) {
      setWhatIfResult({ requiredTermGPA: reqTermGPA.toFixed(2), possible: false, message: 'Mathematically impossible to achieve this term.' });
    } else if (reqTermGPA < 0) {
      setWhatIfResult({ requiredTermGPA: 0, possible: true, message: 'Target already mathematically secured even with zero.' });
    } else {
      setWhatIfResult({ requiredTermGPA: reqTermGPA.toFixed(2), possible: true, message: `You need a term GPA of ${reqTermGPA.toFixed(2)} to reach your target.` });
    }
  };

  // Actions
  const handleAddCourse = () => {
    setCourses([...courses, { id: Date.now(), subject: 'Custom', credits: 3, grade: 'A' }]);
  };

  const handleUpdateCourse = (id, field, value) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        let update = { ...c, [field]: value };
        // auto-fill credits if subject changed to known mock
        if (field === 'subject') {
          const found = enrolledSubjectsMock.find(s => s.code === value);
          if (found) update.credits = found.credits;
        }
        return update;
      }
      return c;
    }));
  };

  const handleRemoveCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const saveScenario = () => {
    alert('Scenario saved successfully! (Simulation)');
  };

  const exportPDF = () => {
    alert('Downloading PDF report... (Simulation)');
  };

  const printReport = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2 mr-4">
            <i className="fa-solid fa-graduation-cap"></i>
            ScholarSpace
          </Link>
          <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
          <h1 className="font-semibold text-gray-800 ml-2 flex items-center gap-2">
            <i className="fa-solid fa-calculator text-blue-500 text-xl"></i>
            GPA Calculator
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={exportPDF} className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">
             <i className="fa-solid fa-download"></i> Export PDF
          </button>
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center hover:bg-blue-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Nav */}
        <div className="w-64 bg-white border-r border-gray-200 h-full flex-col shrink-0 p-4 space-y-2 hidden md:flex relative z-10 shadow-sm">
           <div className="mb-4 px-2">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Calculator Modes</h3>
           </div>
           
           <button 
             onClick={() => setActiveTab('semester')}
             className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === 'semester' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className={`fa-solid fa-calendar w-5 text-center ${activeTab === 'semester' ? 'text-blue-200' : 'text-gray-400'}`}></i> Semester GPA
           </button>
           
           <button 
             onClick={() => setActiveTab('cumulative')}
             className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === 'cumulative' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className={`fa-solid fa-chart-line w-5 text-center ${activeTab === 'cumulative' ? 'text-blue-200' : 'text-gray-400'}`}></i> Cumulative GPA
           </button>
           
           <button 
             onClick={() => setActiveTab('what-if')}
             className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === 'what-if' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className={`fa-solid fa-scale-balanced w-5 text-center ${activeTab === 'what-if' ? 'text-blue-200' : 'text-gray-400'}`}></i> What-If Analysis
           </button>
           
           <button 
             onClick={() => setActiveTab('progress')}
             className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-3 ${activeTab === 'progress' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className={`fa-solid fa-award w-5 text-center ${activeTab === 'progress' ? 'text-blue-200' : 'text-gray-400'}`}></i> Degree Progress
           </button>

           <div className="mt-auto pt-4 border-t border-gray-100 space-y-2 pb-2">
             <button onClick={saveScenario} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition flex items-center gap-3">
               <i className="fa-solid fa-bookmark w-5 text-center text-gray-400"></i> Save Scenario
             </button>
             <button onClick={printReport} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition flex items-center gap-3">
               <i className="fa-solid fa-print w-5 text-center text-gray-400"></i> Print Report
             </button>
             <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition flex items-center gap-3">
               <i className="fa-solid fa-share-nodes w-5 text-center text-gray-400"></i> Share with Advisor
             </button>
           </div>
        </div>

        {/* Top bar for mobile tabs */}
        <div className="md:hidden flex bg-white border-b border-gray-200 overflow-x-auto w-full z-10 shrink-0">
          <button onClick={() => setActiveTab('semester')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'semester' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-500'}`}>Semester</button>
          <button onClick={() => setActiveTab('cumulative')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'cumulative' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-500'}`}>Cumulative</button>
          <button onClick={() => setActiveTab('what-if')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'what-if' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-500'}`}>What-If</button>
          <button onClick={() => setActiveTab('progress')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'progress' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-500'}`}>Progress</button>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* SHARED COURSE INPUT (appears in Semester and Cumulative) */}
            {(activeTab === 'semester' || activeTab === 'cumulative') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="bg-gray-50 border-b border-gray-200 p-5 flex justify-between items-center">
                   <div>
                     <h2 className="text-lg font-bold text-gray-900">Current Semester Courses</h2>
                     <p className="text-sm text-gray-500">Add courses and expected grades to calculate.</p>
                   </div>
                   <button onClick={handleAddCourse} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2">
                     <i className="fa-solid fa-plus"></i> Add Course
                   </button>
                 </div>
                 
                 <div className="p-5">
                   {/* Mobile standard table equivalent */}
                   <div className="hidden md:grid grid-cols-12 gap-4 mb-3 font-bold text-xs text-gray-500 uppercase tracking-wider px-2">
                     <div className="col-span-5">Subject / Course</div>
                     <div className="col-span-3">Credits</div>
                     <div className="col-span-3">Expected Grade</div>
                     <div className="col-span-1 text-right">Actions</div>
                   </div>

                   <div className="space-y-3">
                     {courses.map(course => (
                       <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white border border-gray-100 p-3 md:p-2 rounded-xl hover:border-blue-300 transition">
                         
                         {/* Subject */}
                         <div className="col-span-1 md:col-span-5">
                           <label className="block md:hidden text-xs font-bold text-gray-400 mb-1">Course</label>
                           <input 
                             type="text" 
                             list="enrolled-subjects"
                             value={course.subject}
                             onChange={(e) => handleUpdateCourse(course.id, 'subject', e.target.value)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                             placeholder="e.g. CSE 101"
                           />
                           <datalist id="enrolled-subjects">
                             {enrolledSubjectsMock.map(sub => (
                               <option key={sub.id} value={sub.code}>{sub.name}</option>
                             ))}
                           </datalist>
                         </div>

                         {/* Credits */}
                         <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:block gap-3">
                           <div className="md:hidden pt-2">
                             <label className="text-xs font-bold text-gray-400 block pb-1">Credits</label>
                           </div>
                           <input 
                             type="number"
                             min="0"
                             step="0.5"
                             value={course.credits}
                             onChange={(e) => handleUpdateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                           />
                         </div>

                         {/* Grade */}
                         <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:block gap-3">
                           <div className="md:hidden pt-2">
                             <label className="text-xs font-bold text-gray-400 block pb-1">Expected Grade</label>
                           </div>
                           <select 
                             value={course.grade}
                             onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 font-bold text-center"
                           >
                             {gradesMap.map(g => (
                               <option key={g.label} value={g.label}>{g.label} ({g.points.toFixed(2)})</option>
                             ))}
                           </select>
                         </div>

                         {/* Remove */}
                         <div className="col-span-1 md:col-span-1 text-right mt-2 md:mt-0">
                           <button onClick={() => handleRemoveCourse(course.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition w-full md:w-auto flex justify-center items-center">
                             <i className="fa-solid fa-trash"></i> <span className="md:hidden ml-2 font-medium">Remove</span>
                           </button>
                         </div>

                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            )}

            {/* TAB: SEMESTER */}
            {activeTab === 'semester' && (
              <>
                <div className="bg-linear-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 md:p-8 shadow-lg text-white grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
                  <i className="fa-solid fa-chart-pie absolute right-0 bottom-0 text-9xl opacity-5 transform translate-x-4 translate-y-4"></i>
                  <div className="col-span-1 md:col-span-2 relative z-10 flex flex-col justify-center">
                     <h3 className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-1">Semester Summary</h3>
                     <p className="text-3xl font-bold mb-4">Calculated GPA</p>
                     <div className="flex gap-8">
                       <div>
                         <p className="text-blue-200 text-sm mb-1">Total Credits</p>
                         <p className="text-2xl font-bold">{semesterResult.totalCredits}</p>
                       </div>
                       <div>
                         <p className="text-blue-200 text-sm mb-1">Grade Points</p>
                         <p className="text-2xl font-bold">{semesterResult.points.toFixed(2)}</p>
                       </div>
                     </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center relative z-10 md:border-l border-white/20 pl-0 md:pl-6">
                     <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl w-full py-6">
                        <span className="block text-5xl font-extrabold">{semesterResult.gpa.toFixed(2)}</span>
                        <span className="block text-sm text-blue-200 font-medium mt-2">OUT OF 4.00</span>
                     </div>
                  </div>
                </div>

                {/* Grade Prediction (Mock) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-6">
                   <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
                     <i className="fa-solid fa-wand-magic-sparkles"></i>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 text-lg">AI Grade Prediction</h4>
                     <p className="text-gray-600 text-sm mt-1 mb-2">Based on your past semester patterns, quizzes, and midterm scores, AI predicts your realistic GPA.</p>
                     <p className="font-bold text-green-600 bg-green-50 px-3 py-1 inline-block rounded-full text-xs">
                       Predicted: {Math.max(1, semesterResult.gpa - 0.2).toFixed(2)} ~ {Math.min(4.0, semesterResult.gpa + 0.1).toFixed(2)} (High Confidence)
                     </p>
                   </div>
                </div>
              </>
            )}

            {/* TAB: CUMULATIVE */}
            {activeTab === 'cumulative' && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                  <div className="bg-gray-50 border-b border-gray-200 p-5">
                    <h2 className="text-lg font-bold text-gray-900">Prior Academic History</h2>
                    <p className="text-sm text-gray-500">Enter your overall status before this semester.</p>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Previous Credits Earned</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-solid fa-graduation-cap text-gray-400"></i>
                        </div>
                        <input 
                          type="number" 
                          min="0" step="1"
                          value={prevCredits}
                          onChange={(e) => setPrevCredits(parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Previous Cumulative GPA</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-solid fa-star text-gray-400"></i>
                        </div>
                        <input 
                          type="number" 
                          min="0" max="4.0" step="0.01"
                          value={prevGPA}
                          onChange={(e) => setPrevGPA(parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-purple-900 to-indigo-800 rounded-2xl p-6 md:p-8 shadow-lg text-white grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                  <i className="fa-solid fa-globe absolute right-0 bottom-0 text-9xl opacity-5 transform translate-x-4"></i>
                  <div className="relative z-10">
                     <h3 className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-1">Cumulative Summary</h3>
                     <p className="text-2xl font-bold mb-4 mt-2">New Overall Status</p>
                     <p className="text-sm text-purple-100">Total Credits Earned: <span className="font-bold text-white ml-2">{cumulativeResult.totalCredits}</span></p>
                     <p className="text-sm text-purple-100 mt-1">Impact from this semester: <span className="font-bold text-white ml-2">
                       {cumulativeResult.newGPA > prevGPA ? <><i className="fa-solid fa-arrow-up text-green-400 mr-1"></i> INCREASE</> : 
                        cumulativeResult.newGPA < prevGPA ? <><i className="fa-solid fa-arrow-down text-red-400 mr-1"></i> DECREASE</> : 
                        "NO CHANGE"}
                     </span></p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end relative z-10">
                     <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl w-full md:w-3/4 py-6">
                        <span className="block text-5xl font-extrabold">{cumulativeResult.newGPA.toFixed(2)}</span>
                        <span className="block text-sm text-purple-200 font-medium mt-2">CUMULATIVE GPA</span>
                     </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB: WHAT-IF */}
            {activeTab === 'what-if' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-bullseye text-blue-600"></i> Target Calculator
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">Find out exactly what grades you need this semester to reach your target cumulative GPA.</p>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                       <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Target Overall GPA</label>
                       <input 
                          type="number" 
                          min="0" max="4.0" step="0.01"
                          value={targetGPA}
                          onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 0)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-xl font-bold text-center focus:ring-2 focus:ring-blue-500"
                       />
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-8 border text-center shadow-lg relative overflow-hidden ${whatIfResult.possible ? 'bg-linear-to-br from-green-50 to-green-100 border-green-200' : 'bg-linear-to-br from-red-50 to-red-100 border-red-200'}`}>
                   {whatIfResult.possible ? (
                     <>
                      <h3 className="text-green-800 font-bold mb-2">Required Term GPA</h3>
                      <div className="text-6xl font-extrabold text-green-600 mb-4">{whatIfResult.requiredTermGPA}</div>
                      <p className="text-green-700 font-medium">{whatIfResult.message}</p>
                     </>
                   ) : (
                     <>
                      <h3 className="text-red-800 font-bold mb-2">Target Unreachable</h3>
                      <div className="w-20 h-20 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                      <p className="text-red-700 font-medium">{whatIfResult.message}</p>
                      <p className="text-sm text-red-600 mt-2">Maximum possible term GPA is 4.00. Consider taking more credits in future semesters.</p>
                     </>
                   )}
                </div>

                {whatIfResult.possible && whatIfResult.requiredTermGPA > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4">Possible Grade Combinations</h4>
                    <p className="text-sm text-gray-500 mb-4">To achieve a term GPA of {whatIfResult.requiredTermGPA} with {calculateSemesterGPA().totalCredits} credits, you might need a breakdown like:</p>
                    <div className="flex gap-2 mb-2">
                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold text-sm">A+</span>
                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold text-sm">A-</span>
                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold text-sm">B+</span>
                       <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm italic">(Estimated average mix)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROGRESS */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-graduation-cap text-blue-600"></i> Degree Progress
                  </h2>

                  <div className="mb-8">
                     <div className="flex justify-between items-end mb-2">
                       <span className="font-bold text-gray-700">Credits Completed</span>
                       <span className="font-bold text-xl text-[#1e3a8a]">{prevCredits} <span className="text-sm text-gray-400 font-normal">/ {totalRequiredCredits}</span></span>
                     </div>
                     <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                        <div className="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min(100, Math.round((prevCredits / totalRequiredCredits)* 100))}%`}}></div>
                     </div>
                     <p className="text-sm text-gray-500 mt-2 text-right">{Math.round((prevCredits / totalRequiredCredits)* 100)}% Complete</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                       <p className="text-xs font-bold text-blue-800 uppercase mb-1">Credits Remaining</p>
                       <p className="text-2xl font-bold text-blue-600">{Math.max(0, totalRequiredCredits - prevCredits)}</p>
                     </div>
                     <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                       <p className="text-xs font-bold text-purple-800 uppercase mb-1">Semesters Left</p>
                       <p className="text-2xl font-bold text-purple-600">~{Math.ceil(Math.max(0, totalRequiredCredits - prevCredits) / 12)}</p>
                     </div>
                     <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                       <p className="text-xs font-bold text-amber-800 uppercase mb-1">Major GPA</p>
                       <p className="text-2xl font-bold text-amber-600">3.65</p>
                     </div>
                  </div>
                </div>

                {/* History Chart Mock */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">GPA History Trend</h3>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">Update Record</button>
                  </div>
                  
                  <div className="h-48 flex items-end justify-between px-2 pb-6 border-b border-gray-200 relative pt-10">
                     {/* Y-axis labels */}
                     <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-6 pointer-events-none">
                       <span>4.0</span>
                       <span>3.0</span>
                       <span>2.0</span>
                     </div>
                     <div className="w-full absolute left-6 right-0 top-6 border-t border-dashed border-gray-200"></div>
                     <div className="w-full absolute left-6 right-0 top-24 border-t border-dashed border-gray-200"></div>
                     
                     <div className="flex w-full justify-between items-end pl-8 z-10 h-full">
                       {[
                         { term: 'Fall 24', val: 3.2 },
                         { term: 'Spr 25', val: 3.4 },
                         { term: 'Fall 25', val: 3.6 },
                         { term: 'Spr 26', val: 3.45 }
                       ].map((pt, i) => (
                         <div key={i} className="flex flex-col items-center group w-1/4">
                            <div className="relative w-8 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors" style={{ height: `${(pt.val / 4.0) * 100}%` }}>
                               <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{pt.val.toFixed(2)}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-medium">{pt.term}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}