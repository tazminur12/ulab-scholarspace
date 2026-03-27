"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SlidesLibrary() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ role: 'student', department: 'CSE' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All'); // 'All', 'Department', 'Favorites'
  const [activeSubject, setActiveSubject] = useState('All');
  
  const [slides, setSlides] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [readSlides, setReadSlides] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({ 'Week 1': true });

  const [viewerSlide, setViewerSlide] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const subjects = ['All', 'CSE101', 'CSE301', 'CSE302', 'BBA101', 'ENG101'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) { console.error(e) }
      }

      // Mock Data
      const mockSlides = [
        { id: 1, title: 'Intro to Data Structures', subject: 'CSE301', week: 'Week 1', date: '2026-01-10', downloads: 145, thumbnail: 'text-blue-500' },
        { id: 2, title: 'Arrays & Linked Lists', subject: 'CSE301', week: 'Week 1', date: '2026-01-15', downloads: 120, thumbnail: 'text-indigo-500' },
        { id: 3, title: 'Stack & Queues', subject: 'CSE301', week: 'Week 2', date: '2026-01-22', downloads: 89, thumbnail: 'text-purple-500' },
        { id: 4, title: 'Trees & Graphs', subject: 'CSE301', week: 'Week 3', date: '2026-01-29', downloads: 156, thumbnail: 'text-pink-500' },
        { id: 5, title: 'Intro to Database', subject: 'CSE302', week: 'Week 1', date: '2026-01-12', downloads: 201, thumbnail: 'text-amber-500' },
        { id: 6, title: 'ER Diagrams', subject: 'CSE302', week: 'Week 2', date: '2026-01-19', downloads: 110, thumbnail: 'text-green-500' },
      ];
      setSlides(mockSlides);

      const savedFav = localStorage.getItem('ulab_fav_slides');
      if (savedFav) setFavorites(JSON.parse(savedFav));

      const savedRead = localStorage.getItem('ulab_read_slides');
      if (savedRead) setReadSlides(JSON.parse(savedRead));

      const savedRecent = localStorage.getItem('ulab_recent_slides');
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('ulab_fav_slides', JSON.stringify(updated));
  };

  const markAsRead = (id) => {
    if (!readSlides.includes(id)) {
      const updated = [...readSlides, id];
      setReadSlides(updated);
      localStorage.setItem('ulab_read_slides', JSON.stringify(updated));
    }
  };

  const openViewer = (slide) => {
    setViewerSlide(slide);
    markAsRead(slide.id);
    
    const isRecent = recentlyViewed.find(r => r.id === slide.id);
    if (!isRecent) {
      const updatedRecent = [slide, ...recentlyViewed].slice(0, 5);
      setRecentlyViewed(updatedRecent);
      localStorage.setItem('ulab_recent_slides', JSON.stringify(updatedRecent));
    }
  };

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  };

  const downloadSlide = (e, slide) => {
    e.stopPropagation();
    alert(`Downloading ${slide.title}...`);
  };

  const filteredSlides = slides.filter(slide => {
    if (filterMode === 'Favorites' && !favorites.includes(slide.id)) return false;
    // Assume my dept is CSE for mockup
    if (filterMode === 'Department' && !slide.subject.startsWith('CSE')) return false;
    
    if (activeSubject !== 'All' && slide.subject !== activeSubject) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return slide.title.toLowerCase().includes(q) || slide.subject.toLowerCase().includes(q) || slide.week.toLowerCase().includes(q);
    }
    return true;
  });

  const getSlidesByWeek = (weekStr) => {
    return filteredSlides.filter(s => s.week === weekStr);
  };

  if (!mounted) return null;

  const canUpload = user.role === 'teacher' || user.role === 'admin';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar - Same as dashboard layout but we use a fixed layout here for simplicity if needed, or we rely on the LayoutWrapper. We are wrapped by LayoutWrapper so no global sidebar if we don't import it. We should assume we are navigating via Link back to dashboard */}
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-blue-600 bg-gray-100 p-2 rounded-lg transition">
               <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a] tracking-tight">ULAB Lecture Slide Library</h1>
              <p className="text-sm text-gray-500">Access and organize your course materials</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search slides, courses, weeks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
              />
            </div>
            <select 
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 py-2 px-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Department">My Department</option>
              <option value="Favorites">My Favorites</option>
            </select>
            {canUpload && (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i> Upload Slide
              </button>
            )}
          </div>
        </header>

        {/* Horizontal Subjects Tab */}
        <div className="bg-white border-b border-gray-200 px-6 py-0 flex items-center shrink-0 overflow-x-auto scroolbar-hide">
          <div className="flex gap-1 py-2 min-w-max">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSubject === sub 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content scrollable area */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          
          {/* Main Slides Area */}
          <div className="flex-1">
            {filteredSlides.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <i className="fa-solid fa-folder-open text-6xl text-gray-200 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-600">No slides found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {weeks.map(week => {
                  const weekSlides = getSlidesByWeek(week);
                  if (weekSlides.length === 0) return null;
                  
                  const isExpanded = !!expandedWeeks[week];
                  
                  return (
                    <div key={week} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      {/* Week Header */}
                      <div 
                        className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => toggleWeek(week)}
                      >
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-800">{week}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{weekSlides.length}</span>
                        </div>
                        <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400`}></i>
                      </div>
                      
                      {/* Week Content */}
                      {isExpanded && (
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {weekSlides.map(slide => (
                            <div key={slide.id} onClick={() => openViewer(slide)} className="border border-gray-200 rounded-xl overflow-hidden group cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all flex flex-col h-full bg-white relative">
                              {/* Thumbnail */}
                              <div className="h-32 bg-gray-100 border-b border-gray-200 flex items-center justify-center relative overflow-hidden">
                                <i className={`fa-solid fa-file-pdf text-5xl ${slide.thumbnail} opacity-80 group-hover:scale-110 transition-transform`}></i>
                                <div className="absolute top-2 right-2 flex gap-1">
                                  {readSlides.includes(slide.id) && (
                                    <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm" title="Viewed">
                                      <i className="fa-solid fa-check"></i> Read
                                    </span>
                                  )}
                                  <button onClick={(e) => toggleFavorite(e, slide.id)} className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm bg-white ${favorites.includes(slide.id) ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-500'}`}>
                                    <i className={`fa-star ${favorites.includes(slide.id) ? 'fa-solid' : 'fa-regular'} text-xs`}></i>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Details */}
                              <div className="p-4 flex-1 flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">{slide.subject}</span>
                                <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{slide.title}</h4>
                                <div className="mt-auto pt-3 flex justify-between items-center text-xs text-gray-500">
                                  <span><i className="fa-regular fa-calendar mr-1"></i>{slide.date}</span>
                                  <span><i className="fa-solid fa-download mr-1"></i>{slide.downloads}</span>
                                </div>
                                <div className="mt-3 flex gap-2 w-full">
                                  <button onClick={(e) => downloadSlide(e, slide)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 rounded text-xs font-medium border border-gray-200 transition">
                                    Download
                                  </button>
                                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded text-xs font-medium border border-blue-100 transition">
                                    View
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar - Recently Viewed */}
          <div className="w-full md:w-64 xl:w-72 shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-500"></i> Recently Viewed
              </h3>
              
              <div className="space-y-3">
                {recentlyViewed.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No recent slides</p>
                ) : (
                  recentlyViewed.map((slide, i) => (
                    <button 
                      key={i} 
                      onClick={() => openViewer(slide)}
                      className="w-full text-left p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 transition-colors flex items-start gap-3 group"
                    >
                      <div className="mt-0.5"><i className={`fa-solid fa-file-pdf ${slide.thumbnail} opacity-70`}></i></div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 line-clamp-1 group-hover:text-blue-600 transition">{slide.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{slide.subject} • {slide.week}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl border border-blue-100 p-5 shadow-sm">
              <h3 className="font-bold text-[#1e3a8a] text-sm mb-2">Study Tip</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect slides directly to your Digital Notebook! Open any slide and click &quot;Add to Notes&quot; to automatically create a study layout with the attached PDF.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* PDF Viewer Modal */}
      {viewerSlide && (
        <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col backdrop-blur-sm">
          {/* Viewer Toolbar */}
          <div className="h-14 bg-gray-800 text-white flex items-center justify-between px-4 shrink-0 shadow-md">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewerSlide(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
              <div className="border-l border-gray-600 pl-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider">{viewerSlide.subject} • {viewerSlide.week}</div>
                <h2 className="font-bold text-sm line-clamp-1">{viewerSlide.title}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden mr-2">
                <button className="p-2 w-10 hover:bg-gray-600"><i className="fa-solid fa-minus text-xs"></i></button>
                <span className="text-xs font-mono w-12 text-center text-gray-300">100%</span>
                <button className="p-2 w-10 hover:bg-gray-600"><i className="fa-solid fa-plus text-xs"></i></button>
              </div>
              
              <Link href={`/notebook?attachSlide=${viewerSlide.id}`} className="hidden sm:flex text-xs font-medium bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white items-center gap-2 transition">
                <i className="fa-solid fa-book-medical"></i> Add to Notes
              </Link>
              
              <button className="text-xs font-medium bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-white flex items-center gap-2 transition ml-1">
                <i className="fa-solid fa-message"></i> Ask Question
              </button>
              
              <button className="p-2 hover:bg-gray-700 rounded text-gray-300 transition ml-2" title="Download">
                <i className="fa-solid fa-download"></i>
              </button>
              <button className="p-2 hover:bg-gray-700 rounded text-gray-300 transition" title="Fullscreen">
                <i className="fa-solid fa-expand"></i>
              </button>
            </div>
          </div>
          
          {/* Main Viewer Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Thumbnails */}
            <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4 hidden md:flex flex-col gap-4">
              {[1,2,3,4,5].map(page => (
                <div key={page} className={`aspect-4/3 bg-white rounded cursor-pointer relative group flex items-center justify-center ${page === 1 ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}>
                   <span className="text-gray-400 font-bold text-2xl">Page {page}</span>
                   <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">{page}</div>
                </div>
              ))}
            </div>
            
            {/* Slide Display */}
            <div className="flex-1 bg-gray-900 flex items-center justify-center p-4 sm:p-8 relative">
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition shadow-lg backdrop-blur-md z-10">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <div className="w-full max-w-4xl aspect-4/3 bg-white shadow-2xl rounded flex items-center justify-center">
                <div className="text-center">
                   <h1 className="text-4xl font-bold text-gray-800 mb-4">{viewerSlide.title}</h1>
                   <p className="text-xl text-gray-500">{viewerSlide.subject} - {viewerSlide.week}</p>
                   <div className="mt-10 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-mono">Simulated PDF Viewer</div>
                </div>
              </div>
              
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition shadow-lg backdrop-blur-md z-10">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">Upload New Slide</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slide Title</label>
                <input type="text" placeholder="e.g. Chapter 1: Introduction to Networks" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white">
                    {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Week Number</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white">
                    {weeks.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File (PDF only)</label>
                <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 text-center hover:bg-blue-50 transition cursor-pointer group">
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-400 mb-3 group-hover:-translate-y-1 transition-transform"></i>
                  <p className="text-sm font-medium text-gray-700">Click to browse or drag file here</p>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Complete Upload</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}