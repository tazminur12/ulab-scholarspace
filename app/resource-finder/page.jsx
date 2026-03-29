"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResourceFinder() {
  const [mounted, setMounted] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Notes' | 'PDFs' | 'Videos' | 'Papers' | 'Discussions'
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Results & Tracking State
  const [activeTab, setActiveTab] = useState('All');
  const [recentSearches, setRecentSearches] = useState(['Operating System Deadlock', 'Database Normalization', 'Data Structures CSE 203']);
  const [savedSearches, setSavedSearches] = useState([{ id: 1, query: 'Machine Learning algorithms', notify: true }]);

  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Mock Data
  const mockNotes = [
    { id: 1, title: 'OS Chapter 4: Deadlocks Detailed Notes', subject: 'Operating Systems (CSE 305)', snippet: 'A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process...', author: 'Tazminur', date: 'Oct 12' },
    { id: 2, title: 'Deadlock Avoidance & Banker Algorithm', subject: 'Operating Systems (CSE 305)', snippet: 'Explanation of resource allocation graphs and how Banker algorithm ensures the system stays in a safe state...', author: 'Sarah', date: 'Oct 15' }
  ];

  const mockPdfs = [
    { id: 1, title: 'Silberschatz - Operating System Concepts 10th Ed', subject: 'Operating Systems', pages: 976, type: 'Book', size: '24 MB' },
    { id: 2, title: 'Lec 07 - Deadlock Characterization', subject: 'OS Lecture Slides', pages: 45, type: 'Presentation', size: '2.1 MB' }
  ];

  const mockVideos = [
    { id: 1, title: 'Operating System: Deadlocks and Banker Algorithm', channel: 'Gate Smashers', duration: '18:45', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop' },
    { id: 2, title: 'Deadlock Prevention vs Avoidance', channel: 'Neso Academy', duration: '12:20', thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=200&auto=format&fit=crop' }
  ];

  const mockPapers = [
    { id: 1, subject: 'Operating Systems', examType: 'Midterm', year: 'Spring 2023', code: 'CSE305' },
    { id: 2, subject: 'Operating Systems', examType: 'Final', year: 'Fall 2022', code: 'CSE305' }
  ];

  const mockDiscussions = [
    { id: 1, title: 'Can someone explain the circular wait condition clearly?', author: 'Rafiq M.', preview: 'I understand mutual exclusion and hold & wait, but circular wait string diagram always confuses me...', answers: 4, date: '2 days ago' },
    { id: 2, title: 'Important topics from Deadlock for upcoming midterm?', author: 'Nadia H.', preview: 'Does sir usually ask numericals on Banker algorithm or just theory?', answers: 12, date: '1 week ago' }
  ];

  const recommendations = {
    related: ['Process Synchronization', 'Semaphores & Mutex', 'Memory Management'],
    prerequisites: ['Process Concepts', 'CPU Scheduling'],
    advanced: ['Distributed Deadlock Detection', 'Recovery Algorithms']
  };

  const collections = [
    { id: 1, title: 'Complete Guide to OS', count: 45, color: 'from-blue-500 to-cyan-500', icon: 'fa-microchip' },
    { id: 2, title: 'Database Normalization Mastery', count: 12, color: 'from-purple-500 to-pink-500', icon: 'fa-database' },
    { id: 3, title: 'Data Structures Midterm Prep', count: 28, color: 'from-orange-500 to-red-500', icon: 'fa-network-wired' }
  ];

  // Actions
  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches([searchQuery, ...recentSearches].slice(0, 5));
      }
      setActiveTab('All'); // Reset tab on new search
    }, 600);
  };

  const saveCurrentSearch = () => {
    if (!searchQuery.trim()) return;
    if (!savedSearches.find(s => s.query.toLowerCase() === searchQuery.toLowerCase())) {
      setSavedSearches([...savedSearches, { id: Date.now(), query: searchQuery, notify: true }]);
      alert("Search saved! You'll be notified of new resources.");
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => {
      document.getElementById('searchForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
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
            <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
            Resource Finder
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition items-center gap-2">
             <i className="fa-solid fa-bookmark"></i> My Resources
          </button>
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Search Area */}
      <div className="flex-1 overflow-y-auto w-full relative">
         
         {/* Top Banner / Search Zone */}
         <div className={`bg-white border-b border-gray-200 transition-all duration-500 ease-in-out ${hasSearched ? 'py-6' : 'py-20 lg:py-32'}`}>
            <div className="max-w-5xl mx-auto px-4 md:px-8 w-full">
               
               {!hasSearched && (
                 <div className="text-center mb-8 animate-fade-in-up">
                   <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">What do you need to study today?</h2>
                   <p className="text-gray-500 text-lg">Unified search across notes, books, slides, papers, and videos.</p>
                 </div>
               )}

               <form id="searchForm" onSubmit={handleSearch} className="relative z-10 w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex flex-col md:flex-row gap-3">
                     
                     <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fa-solid fa-search text-gray-400 text-lg"></i>
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search any topic (e.g., Operating System Deadlock, CSE305 Midterm)"
                          className="w-full bg-white border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 text-gray-800 text-lg md:text-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition shadow-sm"
                          autoFocus
                        />
                     </div>
                     
                     <div className="flex gap-2">
                       <select 
                         value={activeFilter} 
                         onChange={(e) => setActiveFilter(e.target.value)}
                         className="bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold py-4 px-4 rounded-2xl focus:outline-none focus:border-blue-500 w-auto"
                       >
                         <option value="All">All Resources</option>
                         <option value="Notes">Notes</option>
                         <option value="PDFs">PDFs & Slides</option>
                         <option value="Videos">Videos</option>
                         <option value="Papers">Papers</option>
                         <option value="Discussions">Discussions</option>
                       </select>
                       
                       <button 
                         type="submit" 
                         disabled={isSearching}
                         className="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap min-w-35 disabled:opacity-70"
                       >
                         {isSearching ? (
                           <><i className="fa-solid fa-circle-notch fa-spin"></i> Searching</>
                         ) : 'Search'}
                       </button>
                     </div>
                  </div>
               </form>
               
               {/* Quick Links (Pre-search) */}
               {!hasSearched && (
                 <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    
                    {/* Recent & Saved Searches */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left text-blue-500"></i> Recent & Saved</h3>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {savedSearches.map(s => (
                          <div key={s.id} onClick={() => handleQuickSearch(s.query)} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition border border-transparent hover:border-gray-200 group">
                            <i className="fa-solid fa-bookmark text-yellow-500"></i>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 truncate">{s.query}</span>
                            <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Alert on</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((rs, idx) => (
                           <button key={idx} onClick={() => handleQuickSearch(rs)} className="bg-white border border-gray-300 hover:border-blue-400 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full transition">
                             {rs}
                           </button>
                        ))}
                      </div>
                    </div>

                    {/* Curated Collections */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><i className="fa-solid fa-layer-group text-purple-500"></i> Top Collections</h3>
                      <div className="space-y-3">
                         {collections.map(c => (
                           <div key={c.id} className="flex flex-col bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition cursor-pointer group">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${c.color} text-white flex items-center justify-center shadow-sm shrink-0`}>
                                   <i className={`fa-solid ${c.icon}`}></i>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                   <h4 className="font-bold text-gray-900 group-hover:text-blue-600 truncate text-sm">{c.title}</h4>
                                   <p className="text-xs text-gray-500 mt-0.5">Collection • {c.count} items</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                   <i className="fa-solid fa-chevron-right text-xs"></i>
                                </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
               )}
            </div>
         </div>

         {/* Results Area */}
         {hasSearched && !isSearching && (
           <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
              
              <div className="flex flex-col md:flex-row gap-8">
                 {/* Sidebar Recommendations */}
                 <div className="w-full md:w-64 shrink-0 space-y-6 order-2 md:order-1 hidden lg:block">
                    
                    <button onClick={saveCurrentSearch} className="w-full bg-white border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 mb-6">
                      <i className="fa-regular fa-bookmark"></i> Save This Search
                    </button>

                    <div className="bg-linear-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-5 shadow-sm">
                       <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-blue-500"></i> AI Insights</h3>
                       <p className="text-xs text-gray-600 mb-4">Based on your search for &quot;{searchQuery}&quot;</p>
                       
                       <div className="space-y-4">
                         <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prerequisites</h4>
                           <div className="space-y-2">
                             {recommendations.prerequisites.map((p, i) => (
                               <div key={i} onClick={() => handleQuickSearch(p)} className="text-sm font-medium text-blue-700 hover:underline cursor-pointer flex items-start gap-2">
                                  <i className="fa-solid fa-arrow-turn-up text-blue-300 mt-1 rotate-90 text-[10px]"></i> {p}
                               </div>
                             ))}
                           </div>
                         </div>
                         <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Related Topics</h4>
                           <div className="flex flex-wrap gap-1.5">
                             {recommendations.related.map((r, i) => (
                               <span key={i} onClick={() => handleQuickSearch(r)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-bold px-2 py-1 rounded cursor-pointer transition">
                                 {r}
                               </span>
                             ))}
                           </div>
                         </div>
                         <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Advance To</h4>
                           <div className="space-y-2">
                             {recommendations.advanced.map((a, i) => (
                               <div key={i} onClick={() => handleQuickSearch(a)} className="text-sm font-medium text-purple-700 hover:underline cursor-pointer flex items-start gap-2">
                                  <i className="fa-solid fa-arrow-trend-up text-purple-300 mt-1 text-[10px]"></i> {a}
                               </div>
                             ))}
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Main Results Column */}
                 <div className="flex-1 order-1 md:order-2">
                    
                    {/* Tabs */}
                    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10 pt-2">
                       {['All', 'Notes', 'PDFs', 'Videos', 'Papers', 'Discussions'].filter(t => activeFilter === 'All' || activeFilter === t).map(tab => (
                         <button 
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                         >
                           {tab === 'All' ? 'All Results (12)' : 
                            tab === 'Notes' ? `Notes (${mockNotes.length})` : 
                            tab === 'PDFs' ? `Library (${mockPdfs.length})` : 
                            tab === 'Videos' ? `Videos (${mockVideos.length})` : 
                            tab === 'Papers' ? `Qs Papers (${mockPapers.length})` : 
                            `Discussions (${mockDiscussions.length})`}
                         </button>
                       ))}
                    </div>

                    <div className="space-y-8 pb-20">
                       
                       {/* Notes Section */}
                       {(activeTab === 'All' || activeTab === 'Notes') && (
                         <section>
                           {activeTab === 'All' && <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><i className="fa-solid fa-book-open text-purple-500"></i> Notebook Resources</h3>}
                           <div className="space-y-4">
                             {mockNotes.map(n => (
                               <div key={n.id} className="bg-white border border-gray-200 hover:border-purple-300 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                                 <div className="flex justify-between items-start gap-4">
                                   <div>
                                     <div className="flex items-center gap-2 mb-1">
                                       <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Note</span>
                                       <span className="text-xs text-gray-500 font-medium">{n.subject}</span>
                                     </div>
                                     <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2 hover:text-blue-600 cursor-pointer">{n.title}</h4>
                                     <p className="text-sm text-gray-600 line-clamp-2 mb-3">{n.snippet}</p>
                                     <div className="flex items-center gap-3 text-xs text-gray-500">
                                       <span className="flex items-center gap-1"><i className="fa-regular fa-user"></i> {n.author}</span>
                                       <span className="flex items-center gap-1"><i className="fa-regular fa-clock"></i> {n.date}</span>
                                     </div>
                                   </div>
                                   <button className="shrink-0 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex flex-col items-center gap-1">
                                     <i className="fa-solid fa-bookmark"></i>
                                     <span>Save</span>
                                   </button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </section>
                       )}

                       {/* Videos Section */}
                       {(activeTab === 'All' || activeTab === 'Videos') && (
                         <section>
                           {activeTab === 'All' && <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><i className="fa-brands fa-youtube text-red-600"></i> Learning Videos</h3>}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {mockVideos.map(v => (
                               <div key={v.id} className="bg-white border border-gray-200 hover:border-red-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex group">
                                 <div className="w-32 md:w-40 relative shrink-0 bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center">
                                      <div className="w-10 h-10 bg-red-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <i className="fa-solid fa-play ml-1"></i>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                      {v.duration}
                                    </div>
                                 </div>
                                 <div className="p-3 flex flex-col flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                       <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Video</span>
                                   </div>
                                   <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-auto group-hover:text-blue-600">{v.title}</h4>
                                   <p className="text-xs text-gray-500 mt-2 font-medium"><i className="fa-solid fa-tv text-gray-400"></i> {v.channel}</p>
                                   <div className="flex justify-end gap-2 mt-2">
                                     <button className="text-xs text-gray-500 hover:text-blue-600 font-bold px-2 py-1 rounded bg-gray-50"><i className="fa-solid fa-clock"></i> Later</button>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </section>
                       )}

                       {/* PDFs Section */}
                       {(activeTab === 'All' || activeTab === 'PDFs') && (
                         <section>
                           {activeTab === 'All' && <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><i className="fa-solid fa-file-pdf text-red-500"></i> Library Documents</h3>}
                           <div className="space-y-3">
                             {mockPdfs.map(p => (
                               <div key={p.id} className="bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-3 shadow-sm hover:shadow-md transition flex items-center gap-4">
                                  <div className="w-12 h-14 bg-red-50 rounded flex items-center justify-center text-red-500 text-2xl shrink-0">
                                    <i className="fa-solid fa-file-pdf"></i>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                     <h4 className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 cursor-pointer">{p.title}</h4>
                                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                                       <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded">{p.type}</span>
                                       <span><i className="fa-regular fa-folder-open"></i> {p.subject}</span>
                                       <span>{p.pages} pages</span>
                                       <span>{p.size}</span>
                                     </div>
                                  </div>
                                  <div className="flex flex-col gap-1 shrink-0">
                                    <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-xs font-bold transition">View</button>
                                    <button className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded text-xs font-bold transition"><i className="fa-solid fa-download"></i></button>
                                  </div>
                               </div>
                             ))}
                           </div>
                         </section>
                       )}

                       {/* Papers Section */}
                       {(activeTab === 'All' || activeTab === 'Papers') && (
                         <section>
                           {activeTab === 'All' && <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><i className="fa-solid fa-file-lines text-green-600"></i> Question Bank</h3>}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {mockPapers.map(qp => (
                               <div key={qp.id} className="bg-white border border-gray-200 hover:border-green-300 rounded-xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center">
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                       <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Exam Paper</span>
                                       <span className="text-xs font-bold text-gray-500">{qp.code}</span>
                                     </div>
                                     <h4 className="text-base font-bold text-gray-900">{qp.subject}</h4>
                                     <p className="text-sm font-medium text-gray-600">{qp.examType} • {qp.year}</p>
                                  </div>
                                  <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                               </div>
                             ))}
                           </div>
                         </section>
                       )}

                       {/* Discussions Section */}
                       {(activeTab === 'All' || activeTab === 'Discussions') && (
                         <section>
                           {activeTab === 'All' && <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"><i className="fa-solid fa-comments text-orange-500"></i> Community Discussions</h3>}
                           <div className="space-y-4">
                             {mockDiscussions.map(d => (
                               <div key={d.id} className="bg-white border border-gray-200 hover:border-orange-300 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                                 <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Forum Q&A</span>
                                    <span className="text-xs text-gray-500 font-medium">{d.date} by <span className="font-bold text-gray-700">{d.author}</span></span>
                                 </div>
                                 <h4 className="text-base font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">{d.title}</h4>
                                 <p className="text-sm text-gray-600 line-clamp-1 mb-3">{d.preview}</p>
                                 <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                      <i className="fa-solid fa-reply text-green-500"></i> {d.answers} answers
                                    </span>
                                    <button className="text-sm font-bold text-blue-600 hover:underline">Join Discussion &rarr;</button>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </section>
                       )}
                       
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}