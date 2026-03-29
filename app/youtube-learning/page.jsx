"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function YoutubeLearningCenter() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState('library'); // 'library' | 'player'
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  
  // Player state
  const [activeVideo, setActiveVideo] = useState(null);
  const [playerTab, setPlayerTab] = useState('notes'); // notes, transcript, discussion
  const [videoNotes, setVideoNotes] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  
  // Library mock data
  const subjects = ['All', 'Computer Science', 'Mathematics', 'Business', 'English'];
  
  const savedVideos = [
    { id: 'j4mXy9X5FhQ', title: 'Data Structures and Algorithms Complete Course', subject: 'Computer Science', duration: '4:15:20', channel: 'CodeAcademy', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', recommended: true, upvotes: 245 },
    { id: 'k2P_pH5O3jc', title: 'Calculus 1 Full College Course', subject: 'Mathematics', duration: '3:20:10', channel: 'MathNinja', progress: 12, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80', recommended: false, upvotes: 120 },
    { id: 'eM1A9nF1KMo', title: 'Introduction to Marketing Management', subject: 'Business', duration: '1:45:00', channel: 'BizSchool', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', recommended: true, upvotes: 89 }
  ];

  const recommendedChannels = [
    { name: 'MIT OpenCourseWare', subs: '4.5M', topics: 'Engineering, Science', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&q=80' },
    { name: 'CrashCourse', subs: '15M', topics: 'Various', img: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=100&q=80' },
    { name: 'FreeCodeCamp', subs: '8M', topics: 'Computer Science', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&q=80' },
  ];

  const mockTranscript = [
    { time: '0:00', text: "Welcome to this complete course on Data Structures." },
    { time: '0:15', text: "Before we begin coding, let's understand algorithmic time complexity." },
    { time: '0:45', text: "Big O notation allows us to abstractly measure performance." },
    { time: '1:20', text: "We will start with arrays and linked lists." }
  ];

  useEffect(() => {
    let t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const openVideo = (vid) => {
    setActiveVideo(vid);
    setActiveView('player');
    
    // Load notes specific to this video from local storage
    const savedLocalNotes = localStorage.getItem(`ulab_yt_notes_${vid.id}`);
    if (savedLocalNotes) setVideoNotes(savedLocalNotes);
    else setVideoNotes('');
    
    const savedBookmarks = localStorage.getItem(`ulab_yt_books_${vid.id}`);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    else setBookmarks([]);
  };

  const closePlayer = () => {
    setActiveView('library');
    setActiveVideo(null);
  };

  const handleSaveNotes = (e) => {
    const val = e.target.value;
    setVideoNotes(val);
    if (activeVideo) {
      localStorage.setItem(`ulab_yt_notes_${activeVideo.id}`, val);
    }
  };

  const addBookmark = () => {
    // In a real app we'd query the youtube JS API for player.getCurrentTime()
    // Here we'll mock capturing the current timestamp 
    const mockCurrentMinutes = Math.floor(Math.random() * 10);
    const mockCurrentSeconds = Math.floor(Math.random() * 59).toString().padStart(2, '0');
    const timeStr = `${mockCurrentMinutes}:${mockCurrentSeconds}`;
    
    const newBk = { id: Date.now(), time: timeStr, note: 'New vital timestamp marker' };
    const updated = [...bookmarks, newBk].sort((a,b) => a.time.localeCompare(b.time));
    setBookmarks(updated);
    if (activeVideo) {
      localStorage.setItem(`ulab_yt_books_${activeVideo.id}`, JSON.stringify(updated));
    }
  };

  const deleteBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    if (activeVideo) localStorage.setItem(`ulab_yt_books_${activeVideo.id}`, JSON.stringify(updated));
  };

  const handleShare = () => {
    alert("Video successfully shared to the course Community Discussion board!");
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 flex-col overflow-hidden">
      {/* Top Navbar Simulation */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2 mr-4">
            <i className="fa-solid fa-graduation-cap"></i>
            ScholarSpace
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="font-semibold text-gray-800 ml-2 flex items-center gap-2">
            <i className="fa-brands fa-youtube text-red-600 text-xl"></i>
            Video Lectures Library
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {activeView === 'player' && (
            <button 
              onClick={closePlayer}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i> Library
            </button>
          )}
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center hover:bg-blue-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden flex relative">
        {activeView === 'library' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
            <div className="max-w-7xl mx-auto space-y-10">
              
              {/* Search & Filters */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1 relative">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                     <input 
                       type="text" 
                       placeholder="Search global YouTube educational catalog..."
                       className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                   <div className="md:w-64">
                     <select 
                       value={subjectFilter}
                       onChange={(e) => setSubjectFilter(e.target.value)}
                       className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-700"
                     >
                       {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                </div>
              </div>

              {/* Recommended Channels Banner */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-award text-yellow-500"></i> Expert Channels
                  </h2>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedChannels.map((ch, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ch.img} alt={ch.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-800">{ch.name}</h4>
                        <p className="text-xs text-gray-500">{ch.subs} Subscribers • {ch.topics}</p>
                      </div>
                      <button className="ml-auto w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                        <i className="fa-solid fa-plus text-sm"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Saved Playlists & Videos Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-bookmark text-blue-600"></i> My Curated Playlists
                  </h2>
                  
                  {/* Progress Stats */}
                  <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm">
                    <span className="font-semibold text-gray-700">Course Progress:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-[65%]"></div>
                      </div>
                      <span className="text-xs font-bold text-green-600">65%</span>
                    </div>
                    <div title="Completion Certificate Available" className="text-yellow-500 ml-2">
                      <i className="fa-solid fa-certificate"></i>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedVideos
                    .filter(v => subjectFilter === 'All' || v.subject === subjectFilter)
                    .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(video => (
                    <div key={video.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition group flex flex-col">
                      <div className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden" onClick={() => openVideo(video)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                           <div className="w-16 h-16 bg-red-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                             <i className="fa-solid fa-play text-2xl ml-1"></i>
                           </div>
                        </div>

                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                          {video.duration}
                        </span>
                        
                        {/* Progress Bar inside thumbnail */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50">
                          <div className={`h-full ${video.progress === 100 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${video.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="font-bold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition leading-snug" onClick={() => openVideo(video)}>
                            {video.title}
                          </h3>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-chalkboard-user"></i> {video.channel}
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                            {video.subject}
                          </span>
                          
                          <div className="flex gap-3">
                             {/* Upvote Mock */}
                             <button className={`text-xs flex items-center gap-1 font-medium ${video.recommended ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
                               <i className="fa-solid fa-arrow-up"></i> {video.upvotes}
                             </button>
                             
                             <button className="text-gray-400 hover:text-red-500 transition tooltip" title="Attached Notes Available">
                               <i className="fa-solid fa-file-signature"></i>
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        ) : (
          /* ----- VIDEO PLAYER & INTERACTION VIEW ----- */
          <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden">
            
            {/* Left: Main Video Context */}
            <div className="flex-1 flex flex-col bg-black h-full overflow-y-auto lg:overflow-hidden relative">
              <div className="w-full aspect-video bg-black flex items-center justify-center shrink-0">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo?.id}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              
              <div className="flex-1 bg-white p-6 overflow-y-auto w-full max-w-4xl mx-auto text-gray-800 border-x border-gray-200">
                  <h1 className="text-2xl font-bold mb-2">{activeVideo?.title}</h1>
                  <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gray-200">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                         {activeVideo?.channel.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900">{activeVideo?.channel}</h3>
                         <p className="text-xs text-gray-500">Instructor / Educator</p>
                       </div>
                     </div>
                     
                     <div className="flex gap-3">
                       <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition flex items-center gap-2">
                         <i className="fa-regular fa-calendar-plus"></i> Add to Study Plan
                       </button>
                       <button onClick={handleShare} className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-full hover:bg-blue-100 transition flex items-center gap-2">
                         <i className="fa-solid fa-share-nodes"></i> Share to Group
                       </button>
                     </div>
                  </div>
                  
                  <div className="py-6 content">
                    <p className="text-gray-600 leading-relaxed">
                      This lecture covers crucial syllabus material for <strong>{activeVideo?.subject}</strong>. 
                      Ensure you review the transcription alongside your saved timestamps for peak retention. 
                      Completing this module increments your overall course progress bar.
                    </p>
                  </div>
              </div>
            </div>

            {/* Right: Learning Tools Sidebar */}
            <div className="w-full lg:w-100 shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col h-full z-10 transition-all shadow-xl lg:shadow-none">
               <div className="flex border-b border-gray-200 bg-white shrink-0">
                  <button 
                    onClick={() => setPlayerTab('notes')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${playerTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <i className="fa-solid fa-pen-nib mr-2"></i> Notes
                  </button>
                  <button 
                    onClick={() => setPlayerTab('transcript')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${playerTab === 'transcript' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <i className="fa-solid fa-closed-captioning mr-2"></i> Transcript
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 w-full h-full relative">
                 {playerTab === 'notes' && (
                   <div className="flex flex-col h-full">
                     {/* Bookmarks Strip */}
                     <div className="mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-bold text-gray-800">Timestamps</h4>
                          <button onClick={addBookmark} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold hover:bg-red-100 flex items-center gap-1 transition">
                            <i className="fa-solid fa-stopwatch"></i> Tag Time
                          </button>
                        </div>
                        
                        {bookmarks.length === 0 ? (
                           <div className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                             No timestamps saved for this video.
                           </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {bookmarks.map(b => (
                              <div key={b.id} className="group flex gap-2 items-start bg-blue-50/50 p-2 rounded-lg border border-blue-100 hover:bg-blue-50 transition cursor-pointer">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">{b.time}</span>
                                <input 
                                  value={b.note}
                                  onChange={(e) => {
                                    const updated = bookmarks.map(bm => bm.id === b.id ? {...bm, note: e.target.value} : bm);
                                    setBookmarks(updated);
                                    localStorage.setItem(`ulab_yt_books_${activeVideo?.id}`, JSON.stringify(updated));
                                  }}
                                  className="text-xs bg-transparent border-none p-0 focus:ring-0 w-full text-gray-700 font-medium"
                                />
                                <button onClick={(e) => { e.stopPropagation(); deleteBookmark(b.id); }} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                  <i className="fa-solid fa-times text-xs"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                     </div>

                     {/* Text Editor */}
                     <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-75">
                        <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                           <h4 className="text-sm font-bold text-gray-700"><i className="fa-regular fa-file-lines mr-1"></i> Running Notes</h4>
                        </div>
                        <textarea 
                          className="w-full flex-1 p-4 resize-none border-none focus:ring-0 text-sm text-gray-700 leading-relaxed bg-transparent"
                          placeholder="Type notes specific to this video here. They save automatically..."
                          value={videoNotes}
                          onChange={handleSaveNotes}
                        ></textarea>
                     </div>
                   </div>
                 )}

                 {playerTab === 'transcript' && (
                   <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 relative">
                        <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input 
                          type="text" 
                          placeholder="Search transcript..."
                          className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={transcriptSearch}
                          onChange={(e) => setTranscriptSearch(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockTranscript
                          .filter(t => t.text.toLowerCase().includes(transcriptSearch.toLowerCase()))
                          .map((t, idx) => (
                           <div key={idx} className="flex gap-4 group cursor-pointer hover:bg-yellow-50 p-2 -mx-2 rounded-lg transition">
                             <span className="text-xs font-mono text-blue-600 font-bold shrink-0 pt-0.5">{t.time}</span>
                             <p className="text-sm text-gray-700 group-hover:text-gray-900">{t.text}</p>
                           </div>
                        ))}
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}