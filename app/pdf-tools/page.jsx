"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PDFTools() {
  const [mounted, setMounted] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [activeView, setActiveView] = useState('library'); // 'library' | 'viewer'
  const [activePdfId, setActivePdfId] = useState(null);
  
  // Library filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Viewer states
  const [activeTool, setActiveTool] = useState('select'); // select, highlight, underline, comment, draw
  const [annotations, setAnnotations] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('thumbnails'); // thumbnails | annotations
  const [activeColor, setActiveColor] = useState('#ffeb3b');

  // AI & Modals
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New PDF Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const subjects = ['All', 'CSE', 'EEE', 'BBA', 'English'];

  // Simulate Load
  useEffect(() => {
    let t1 = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem('ulab_pdfs');
      if (saved) {
        setPdfs(JSON.parse(saved));
      } else {
        // Seed data
        const initial = [
          { id: 1, title: 'Operating Systems Ch1-5', subject: 'CSE', pages: 45, size: '2.4 MB', lastOpened: '2026-03-25' },
          { id: 2, title: 'Calculus II Integrals', subject: 'EEE', pages: 120, size: '5.1 MB', lastOpened: '2026-03-24' },
        ];
        setPdfs(initial);
        localStorage.setItem('ulab_pdfs', JSON.stringify(initial));
      }
    }, 0);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (activePdfId) {
      let t2 = setTimeout(() => {
        const savedAnnotations = localStorage.getItem(`ulab_pdf_ann_${activePdfId}`);
        if (savedAnnotations) {
          setAnnotations(JSON.parse(savedAnnotations));
        } else {
          setAnnotations([]);
        }
      }, 0);
      return () => clearTimeout(t2);
    }
  }, [activePdfId]);

  const saveAnnotations = (newAnns) => {
    setAnnotations(newAnns);
    if (activePdfId) {
      localStorage.setItem(`ulab_pdf_ann_${activePdfId}`, JSON.stringify(newAnns));
    }
  };

  const currentPdf = pdfs.find(p => p.id === activePdfId) || null;

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newPdf = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject || 'General',
      pages: Math.floor(Math.random() * 50) + 10, // Mock
      size: '1.2 MB',
      lastOpened: new Date().toISOString().split('T')[0]
    };
    const updated = [newPdf, ...pdfs];
    setPdfs(updated);
    localStorage.setItem('ulab_pdfs', JSON.stringify(updated));
    setShowAddModal(false);
    
    // reset form
    setNewTitle('');
    setNewSubject('');
    setNewDesc('');
    
    // Open immediately
    setActivePdfId(newPdf.id);
    setActiveView('viewer');
  };

  const handleMockClickViewer = (e) => {
    if (activeTool === 'select' || activeTool === 'draw') return;
    
    // Minimal mock for adding annotations by clicking on the mock PDF
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnn = {
      id: Date.now(),
      type: activeTool,
      x, y,
      color: activeColor,
      text: activeTool === 'comment' ? 'New Note' : '',
      page: 1
    };

    saveAnnotations([...annotations, newAnn]);
    
    // Auto reset to select after comment
    if (activeTool === 'comment' || activeTool === 'highlight') {
       setActiveTool('select');
    }
  };

  const deleteAnnotation = (id) => {
    saveAnnotations(annotations.filter(a => a.id !== id));
  };

  const generateAISummary = () => {
    // Mock AI Call
    setSummaryData({
      text: "This document covers fundamental concepts of the selected subject, highlighting key definitions, processes, and expected outcomes.",
      bullets: [
        "Core principles are established in the first three chapters.",
        "Crucial theorems and mathematical proofs are provided for contextual grounding.",
        "Real-world application vectors demonstrate the practicality."
      ],
      definitions: [
        { term: "Heuristic", meaning: "A practical method for problem solving that is not guaranteed to be optimal." },
        { term: "Throughput", meaning: "The rate of production or the rate at which something is processed." }
      ],
      questions: [
        "What are the main constraints discussed?",
        "How does the primary theorem apply to edge cases?"
      ]
    });
    setShowSummaryModal(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 flex-col overflow-hidden">
      {/* Top Navbar Simulation */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2 mr-4">
            <i className="fa-solid fa-graduation-cap"></i>
            ScholarSpace
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="font-semibold text-gray-800 ml-2 flex items-center gap-2">
            <i className="fa-regular fa-file-pdf text-red-500"></i>
            PDF Study Tools
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {activeView === 'viewer' && (
            <button 
              onClick={() => setActiveView('library')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Back to Library
            </button>
          )}
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex flex-col items-center justify-center hover:bg-blue-200">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 w-full flex overflow-hidden relative">
        {activeView === 'library' ? (
          // --- LIBRARY VIEW ---
          <div className="flex-1 flex flex-col p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My PDF Library</h2>
                <p className="text-gray-500 text-sm mt-1">Manage, read, and annotate your course materials</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i> Upload New PDF
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search PDFs by title..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setCategoryFilter(sub)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      categoryFilter === sub ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pdfs
                .filter(p => categoryFilter === 'All' || p.subject === categoryFilter)
                .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(pdf => (
                <div 
                  key={pdf.id} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col group"
                  onClick={() => {
                    setActivePdfId(pdf.id);
                    setActiveView('viewer');
                  }}
                >
                  <div className="h-40 bg-gray-100 border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                    <i className="fa-regular fa-file-pdf text-6xl text-gray-300 group-hover:text-red-400 transition-colors"></i>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                      {pdf.pages} Pages
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">{pdf.title}</h3>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">{pdf.subject}</span>
                      <span>Last opened: {pdf.lastOpened}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {pdfs.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-xl">
                  <i className="fa-solid fa-folder-open text-4xl mb-3 text-gray-400"></i>
                  <p>Your library is empty. Upload a PDF to begin analyzing.</p>
                </div>
              )}
            </div>
            
          </div>
        ) : (
          // --- VIEWER & ANNOTATION VIEW ---
          <div className="flex-1 flex w-full bg-[#323639]">
            {/* Left Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 z-10 transition-all">
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setSidebarTab('thumbnails')}
                  className={`flex-1 py-3 text-sm font-medium ${sidebarTab === 'thumbnails' ? 'border-b-2 border-[#1e3a8a] text-[#1e3a8a]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-table-cells-large mr-2"></i> Document
                </button>
                <button 
                  onClick={() => setSidebarTab('annotations')}
                  className={`flex-1 py-3 text-sm font-medium ${sidebarTab === 'annotations' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-highlighter mr-2"></i> Notes
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {sidebarTab === 'thumbnails' ? (
                  <div className="flex flex-col gap-4">
                    {/* Mock thumbnails */}
                    {[1, 2, 3, 4, 5].map((page) => (
                      <div key={page} className={`aspect-3/4 bg-white border ${page === 1 ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20' : 'border-gray-200'} rounded-md shadow-sm flex items-center justify-center text-gray-400 relative cursor-pointer hover:border-gray-400`}>
                        <span className="absolute bottom-2 font-mono text-xs">Page {page}</span>
                        <i className="fa-regular fa-file-lines text-2xl"></i>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">My Annotations ({annotations.length})</p>
                    {annotations.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-6 bg-white rounded border border-dashed border-gray-200">No annotations yet. Use the tools above to highlight or add notes.</div>
                    ) : (
                      annotations.map(ann => (
                        <div key={ann.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group text-sm">
                           <div className="flex justify-between items-start mb-1">
                             <span className="flex items-center gap-1 font-medium capitalize text-gray-700">
                               {ann.type === 'highlight' && <span className="w-2 h-2 rounded-full inline-block mr-1" style={{backgroundColor: ann.color}}></span>}
                               {ann.type === 'comment' && <i className="fa-solid fa-comment text-blue-500 mr-1 text-xs"></i>}
                               {ann.type} - Pg {ann.page}
                             </span>
                             <button onClick={() => deleteAnnotation(ann.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                               <i className="fa-solid fa-trash text-xs"></i>
                             </button>
                           </div>
                           {ann.type === 'comment' && (
                             <input 
                               value={ann.text}
                               onChange={(e) => {
                                 const updated = annotations.map(a => a.id === ann.id ? {...a, text: e.target.value} : a);
                                 saveAnnotations(updated);
                               }}
                               className="w-full text-xs mt-1 p-1.5 bg-yellow-50 border border-yellow-200 rounded text-gray-800"
                               placeholder="Type a note..."
                             />
                           )}
                           {ann.type === 'highlight' && <p className="text-xs text-gray-500 italic mt-1 truncate">Selected Text area</p>}
                        </div>
                      ))
                    )}
                    
                    {annotations.length > 0 && (
                      <button className="mt-4 w-full py-2 bg-gray-100 text-gray-600 rounded text-xs font-semibold hover:bg-gray-200 transition">
                        <i className="fa-solid fa-file-export mr-1"></i> Export Notes
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Central Viewer Area */}
            <div className="flex-1 flex flex-col relative">
              {/* Annotation Toolbar */}
              <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="mr-4 font-semibold text-gray-700 text-sm truncate max-w-50">
                    {currentPdf?.title}
                  </div>
                  
                  <div className="h-6 w-px bg-gray-200 mr-2"></div>
                  
                  {/* Tool Buttons */}
                  {[
                    { id: 'select', icon: 'fa-solid fa-arrow-pointer', title: 'Select' },
                    { id: 'highlight', icon: 'fa-solid fa-highlighter', title: 'Highlight' },
                    { id: 'underline', icon: 'fa-solid fa-underline', title: 'Underline' },
                    { id: 'comment', icon: 'fa-solid fa-comment-medical', title: 'Comment / Sticky Note' },
                    { id: 'draw', icon: 'fa-solid fa-pen', title: 'Draw' }
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      title={tool.title}
                      className={`w-9 h-9 flex items-center justify-center rounded transition ${activeTool === tool.id ? 'bg-blue-100 text-[#1e3a8a]' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <i className={tool.icon}></i>
                    </button>
                  ))}
                  
                  {/* Color Picker (Only relevant for highlight) */}
                  <div className="ml-2 flex gap-1">
                    {['#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#f44336'].map(color => (
                       <button
                         key={color}
                         onClick={() => setActiveColor(color)}
                         className={`w-5 h-5 rounded-full border-2 ${activeColor === color ? 'border-gray-800' : 'border-transparent'} shadow-sm`}
                         style={{ backgroundColor: color }}
                       />
                    ))}
                  </div>
                </div>

                {/* AI Features */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={generateAISummary}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:shadow-md transition shadow-purple-500/20"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI Summary
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-50 transition">
                    <i className="fa-solid fa-clipboard-question text-green-600"></i> Generate Quiz
                  </button>
                </div>
              </div>

              {/* PDF Canvas area (Mocked) */}
              <div className="flex-1 overflow-auto bg-gray-200 p-8 flex justify-center cursor-crosshair relative" onClick={handleMockClickViewer}>
                {/* Mock PDF Page Rendering */}
                <div className="bg-white w-full max-w-200 min-h-282.75 shadow-lg relative shrink-0 text-gray-300 p-16 font-serif leading-relaxed">
                   <h1 className="text-3xl text-gray-800 font-bold mb-6 text-center">{currentPdf?.title}</h1>
                   <h2 className="text-xl text-gray-700 font-semibold mb-4 border-b pb-2">Chapter 1. Introduction</h2>
                   
                   <p className="mb-4 text-justify text-gray-600">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                   </p>
                   <p className="mb-4 text-justify text-gray-600">
                     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                   </p>
                   
                   <div className="bg-gray-50 border-l-4 border-blue-500 p-6 my-8">
                     <h3 className="font-bold text-gray-800 mb-2 mt-0">Key Concept Definition</h3>
                     <p className="text-gray-600 italic">&quot;The fundamental baseline of computational architectures requires a rigorous understanding of sequential logic gating.&quot;</p>
                   </div>
                   
                   <p className="mb-4 text-justify text-gray-600">
                     Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                   </p>

                   {/* Render physical annotations strictly within this page mock */}
                   {annotations.map(ann => {
                     if (ann.type === 'highlight') {
                        return (
                          <div key={ann.id} className="absolute mix-blend-multiply opacity-50 pointer-events-none" style={{ left: ann.x, top: ann.y - 10, width: 150, height: 20, backgroundColor: ann.color, borderRadius: 2 }}></div>
                        )
                     } else if (ann.type === 'comment') {
                        return (
                          <div key={ann.id} className="absolute z-20 shadow-lg rounded pointer-events-auto group" style={{ left: ann.x, top: ann.y, width: 200 }}>
                            <div className="bg-yellow-200 border-b border-yellow-300 p-1 rounded-t flex justify-between cursor-move">
                              <i className="fa-solid fa-thumbtack text-yellow-600 text-xs ml-1"></i>
                              <button onClick={(e) => { e.stopPropagation(); deleteAnnotation(ann.id); }} className="text-yellow-700 hover:text-red-500"><i className="fa-solid fa-times text-xs mr-1"></i></button>
                            </div>
                            <textarea 
                              className="w-full h-24 bg-yellow-100 p-2 text-sm text-gray-800 focus:outline-none rounded-b resize-none" 
                              value={ann.text}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                 const updated = annotations.map(a => a.id === ann.id ? {...a, text: e.target.value} : a);
                                 saveAnnotations(updated);
                              }}
                            />
                          </div>
                        )
                     }
                     return null;
                   })}
                   
                   {/* Tool Indicator Overlay */}
                   {activeTool !== 'select' && (
                     <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 pointer-events-none backdrop-blur-sm">
                       <i className="fa-solid fa-info-circle"></i> Click to add {activeTool}
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-up text-[#1e3a8a]"></i> Upload Document
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpload}>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-file-pdf text-2xl"></i>
                </div>
                <p className="font-semibold text-gray-700">Drag & drop your PDF here</p>
                <p className="text-xs text-gray-500 mt-1">or click to browse files (mock demo)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
                    placeholder="e.g., Intro to Machine Learning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Category</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] appearance-none"
                  >
                    <option value="" disabled>Select Subject</option>
                    {subjects.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] h-20 resize-none"
                    placeholder="Add some context..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-medium hover:bg-blue-800 transition"
                >
                  Upload & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-5 bg-linear-to-r from-purple-50 to-indigo-50 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
                AI Document Intelligence
              </h2>
              <button onClick={() => setShowSummaryModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-8">
              {/* Overall Summary */}
              <section>
                 <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <i className="fa-solid fa-align-left"></i> Executive Summary
                 </h3>
                 <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100 shadow-sm">{summaryData.text}</p>
              </section>

              {/* Key Highlights */}
              <section>
                 <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <i className="fa-solid fa-list-check"></i> Key Takeaways
                 </h3>
                 <ul className="space-y-3">
                   {summaryData.bullets.map((b, i) => (
                     <li key={i} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                       <i className="fa-solid fa-check text-green-500 mt-1"></i>
                       <span className="text-gray-700">{b}</span>
                     </li>
                   ))}
                 </ul>
              </section>

              {/* Definitions Grid */}
              <section>
                 <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <i className="fa-solid fa-book-open"></i> Important Definitions
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {summaryData.definitions.map((def, i) => (
                     <div key={i} className="bg-white p-4 rounded-lg border border-yellow-200 border-l-4 border-l-yellow-400 shadow-sm">
                       <h4 className="font-bold text-gray-800 mb-1">{def.term}</h4>
                       <p className="text-sm text-gray-600">{def.meaning}</p>
                     </div>
                   ))}
                 </div>
              </section>
              
              {/* Study Questions */}
              <section>
                 <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <i className="fa-solid fa-circle-question"></i> Practice Questions
                 </h3>
                 <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                    <ul className="list-decimal list-outside ml-4 space-y-2 text-blue-900 font-medium">
                      {summaryData.questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                 </div>
              </section>
            </div>
            
            <div className="bg-white p-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
               <button className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                 <i className="fa-regular fa-copy mr-2"></i> Copy All
               </button>
               <button className="px-5 py-2.5 bg-[#1e3a8a] text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-sm">
                 <i className="fa-solid fa-floppy-disk mr-2"></i> Save to My Notes
               </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Required CSS snippet inline to guarantee animation loading */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}