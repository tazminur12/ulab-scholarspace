"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AcademicEvents() {
  const [mounted, setMounted] = useState(false);
  
  // Views & Content State
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid' | 'calendar'
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'recommended'
  const [activeEvent, setActiveEvent] = useState(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(null); // event id
  const [showFeedbackModal, setShowFeedbackModal] = useState(null); // event id
  
  // Filters
  const [filterType, setFilterType] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  
  // User context
  const currentUser = { name: 'Sarah', dept: 'CSE', isAdmin: true }; // toggle isAdmin for Add Event button

  // Mock Events
  const [events, setEvents] = useState([]);
  
  const eventTypes = ['Seminar', 'Workshop', 'Competition', 'Deadline', 'Other'];
  const depts = ['All', 'CSE', 'EEE', 'BBA', 'English', 'General'];

  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
      const ds = new Date();
      
      const tmrw = new Date(ds); tmrw.setDate(tmrw.getDate() + 1);
      const nextwk = new Date(ds); nextwk.setDate(nextwk.getDate() + 5);
      const past = new Date(ds); past.setDate(past.getDate() - 10);
      
      const mockEvents = [
        {
          id: 1,
          title: 'AI in Modern Software Engineering Seminar',
          type: 'Seminar',
          date: tmrw.toISOString().split('T')[0],
          time: '14:00 - 16:00',
          location: 'Auditorium A',
          organizer: 'CSE Dept',
          description: 'Join industry experts to discuss how AI is shaping the future of software development, testing, and deployment. We will have Q&A sessions followed by a networking block.',
          interested: 45,
          isUserInterested: false,
          registrationUrl: 'https://example.com/reg',
          speaker: 'Dr. Alan Turing, Lead AI Researcher at TechCorp',
          isPast: false
        },
        {
          id: 2,
          title: 'Spring Undergraduate Hackathon',
          type: 'Competition',
          date: nextwk.toISOString().split('T')[0],
          time: '09:00 - 18:00',
          location: 'Lab 402 & 403',
          organizer: 'Computer Club',
          description: 'A 9-hour hackathon to build solutions for campus problems. Free food, prize money for top 3 teams!',
          interested: 120,
          isUserInterested: true,
          registrationUrl: 'https://example.com/hack',
          speaker: 'Multiple Mentors',
          isPast: false
        },
        {
          id: 3,
          title: 'Final Project Submission Deadline',
          type: 'Deadline',
          date: nextwk.toISOString().split('T')[0],
          time: '23:59',
          location: 'Online Canvas',
          organizer: 'All Departments',
          description: 'Last day to submit capstone and final term projects to the portal.',
          interested: 0,
          isUserInterested: false,
          registrationUrl: '',
          speaker: '',
          isPast: false
        },
        {
          id: 4,
          title: 'Resume Writing Workshop',
          type: 'Workshop',
          date: past.toISOString().split('T')[0],
          time: '15:00 - 17:00',
          location: 'Room 201',
          organizer: 'Career Services',
          description: 'Learn how to highlight your academic projects to catch recruiter attention.',
          interested: 85,
          isUserInterested: true,
          registrationUrl: '',
          speaker: 'Jane Doe, HR Consultant',
          isPast: true,
          feedback: []
        }
      ];
      setEvents(mockEvents);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Seminar': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Workshop': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Competition': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Deadline': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Seminar': return 'fa-person-chalkboard';
      case 'Workshop': return 'fa-hammer';
      case 'Competition': return 'fa-trophy';
      case 'Deadline': return 'fa-clock';
      default: return 'fa-calendar';
    }
  };

  // Handlers
  const toggleInterest = (id, e) => {
    if (e) e.stopPropagation();
    setEvents(events.map(ev => {
      if (ev.id === id) {
        return { 
          ...ev, 
          isUserInterested: !ev.isUserInterested,
          interested: ev.isUserInterested ? ev.interested - 1 : ev.interested + 1
        };
      }
      return ev;
    }));
  };

  const handleSetReminder = (timeStr, e) => {
    e.preventDefault();
    alert(`Reminder set for ${timeStr} before the event!`);
    setShowReminderModal(null);
  };

  const handleExport = () => {
    alert("Exporting events to .ics format... (Mock)");
  };

  // Add Form State
  const [newForm, setNewForm] = useState({
    title: '', type: 'Seminar', date: '', time: '', location: '', organizer: '', description: ''
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEv = {
      id: Date.now(),
      ...newForm,
      interested: 0,
      isUserInterested: false,
      isPast: false
    };
    setEvents([...events, newEv]);
    setShowAddModal(false);
  };

  let displayedEvents = events;
  
  if (activeTab === 'upcoming') displayedEvents = displayedEvents.filter(e => !e.isPast);
  if (activeTab === 'past') displayedEvents = displayedEvents.filter(e => e.isPast);
  if (activeTab === 'recommended') displayedEvents = displayedEvents.filter(e => !e.isPast && (e.organizer.includes(currentUser.dept) || e.type === 'Workshop'));

  if (filterType !== 'All') displayedEvents = displayedEvents.filter(e => e.type === filterType);
  if (filterDept !== 'All') displayedEvents = displayedEvents.filter(e => e.organizer.includes(filterDept) || filterDept === 'General');

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
            <i className="fa-solid fa-calendar-star text-blue-500 text-xl"></i>
            Academic Events
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {currentUser.isAdmin && (
             <button onClick={() => setShowAddModal(true)} className="hidden md:flex bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition items-center gap-2">
               <i className="fa-solid fa-plus"></i> Add Event
             </button>
          )}
          <button onClick={handleExport} className="hidden sm:flex bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition items-center gap-2" title="Export .iCal">
            <i className="fa-solid fa-download"></i> Export
          </button>
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center hover:bg-blue-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">

        {/* Search & Filter Sidebar (Desktop) */}
        <div className="w-64 bg-white border-r border-gray-200 h-full hidden flex-col shrink-0 p-5 lg:flex overflow-y-auto">
           
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Event Categories</h3>
           <div className="space-y-1 mb-8">
             <button onClick={() => setActiveTab('upcoming')} className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
               <i className="fa-solid fa-calendar-day w-5"></i> Upcoming Events
             </button>
             <button onClick={() => setActiveTab('recommended')} className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'recommended' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
               <i className="fa-solid fa-star w-5"></i> For You
             </button>
             <button onClick={() => setActiveTab('past')} className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition ${activeTab === 'past' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
               <i className="fa-solid fa-clock-rotate-left w-5"></i> Past Archive
             </button>
           </div>

           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filters</h3>
           <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Event Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-blue-500">
                  <option value="All">All Types</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Department</label>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-blue-500">
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
           </div>

           {/* Mini Legend */}
           <div className="mt-auto pt-6 border-t border-gray-100">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Legend</h3>
             <ul className="space-y-2 text-xs font-medium">
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Seminar</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Workshop</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Competition</li>
               <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Deadline</li>
             </ul>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden relative">
          
          {activeEvent ? (
            /* EVENT DETAILS VIEW */
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center fade-in">
               <div className="w-full max-w-3xl bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
                  
                  {/* Hero Cover */}
                  <div className={`h-40 md:h-56 relative ${
                    activeEvent.type === 'Seminar' ? 'bg-linear-to-r from-blue-600 to-indigo-700' :
                    activeEvent.type === 'Workshop' ? 'bg-linear-to-r from-purple-600 to-pink-700' :
                    activeEvent.type === 'Competition' ? 'bg-linear-to-r from-orange-500 to-red-600' :
                    'bg-linear-to-r from-gray-600 to-gray-800'
                  }`}>
                    <button onClick={() => setActiveEvent(null)} className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition flex items-center justify-center w-10 h-10">
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition flex items-center justify-center w-10 h-10 shadow-sm" title="Share event">
                         <i className="fa-solid fa-share-nodes"></i>
                       </button>
                       <button onClick={() => toggleInterest(activeEvent.id)} className={`p-2 rounded-full backdrop-blur-sm transition flex items-center justify-center w-10 h-10 shadow-sm ${activeEvent.isUserInterested ? 'bg-pink-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`} title="Mark Interested">
                         <i className="fa-solid fa-heart"></i>
                       </button>
                    </div>
                  </div>

                  {/* Body Sub-header */}
                  <div className="p-6 md:p-8 -mt-12 relative z-10">
                     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                       <div className="flex gap-4 items-center">
                         <div className="text-center shadow-sm border border-gray-100 rounded-xl overflow-hidden min-w-17.5">
                            <div className="bg-red-500 text-white text-[10px] uppercase font-bold py-1 px-2">
                              {new Date(activeEvent.date).toLocaleString('default', { month: 'short' })}
                            </div>
                            <div className="bg-white text-gray-900 font-extrabold text-2xl py-1">
                              {new Date(activeEvent.date).getDate()}
                            </div>
                         </div>
                         <div>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{activeEvent.title}</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">{activeEvent.organizer} • {activeEvent.interested} Interested</p>
                         </div>
                       </div>
                       
                       {!activeEvent.isPast && (
                         <div className="flex gap-2 shrink-0">
                           <button onClick={(e) => { e.stopPropagation(); setShowReminderModal(activeEvent.id); }} className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-800 transition flex items-center gap-2">
                             <i className="fa-regular fa-bell"></i> Remind Me
                           </button>
                         </div>
                       )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                           <section>
                             <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">About Event</h3>
                             <p className="text-gray-700 leading-relaxed text-sm">{activeEvent.description}</p>
                           </section>
                           
                           {activeEvent.speaker && (
                             <section>
                               <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Event Speakers/Mentors</h3>
                               <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg"><i className="fa-solid fa-user-tie"></i></div>
                                 <p className="font-semibold text-gray-800 text-sm">{activeEvent.speaker}</p>
                               </div>
                             </section>
                           )}

                           <section>
                             <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Discussion</h3>
                             <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500 mb-2">Have a question before the event?</p>
                                <button className="bg-white border text-gray-700 border-gray-300 rounded px-4 py-1.5 text-xs font-semibold hover:bg-gray-100">Start Discussion</button>
                             </div>
                           </section>
                        </div>

                        <div className="md:col-span-1 space-y-4">
                           <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Event Details</h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex gap-3">
                                  <i className="fa-regular fa-clock mt-1 text-blue-500"></i>
                                  <div>
                                    <p className="font-semibold text-gray-900">Time</p>
                                    <p className="text-gray-600">{activeEvent.time}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <i className="fa-solid fa-location-dot mt-1 text-red-500"></i>
                                  <div>
                                    <p className="font-semibold text-gray-900">Location</p>
                                    <p className="text-gray-600">{activeEvent.location}</p>
                                    <button className="text-blue-600 text-xs font-medium hover:underline mt-1">View campus map</button>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <i className="fa-solid fa-tag mt-1 text-purple-500"></i>
                                  <div>
                                    <p className="font-semibold text-gray-900">Category</p>
                                    <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold border ${getTypeColor(activeEvent.type)}`}>{activeEvent.type}</span>
                                  </div>
                                </div>
                              </div>
                           </div>
                           
                           {activeEvent.registrationUrl && !activeEvent.isPast && (
                             <a href="#" className="flex justify-center items-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm">
                               Register / RSVP External
                             </a>
                           )}
                           
                           {activeEvent.isPast && (
                             <button onClick={() => setShowFeedbackModal(activeEvent.id)} className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold py-3 rounded-xl transition shadow-sm text-sm border border-purple-200 flex items-center justify-center gap-2">
                               <i className="fa-solid fa-comment-dots"></i> Leave Feedback
                             </button>
                           )}
                        </div>
                     </div>

                  </div>
               </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex flex-wrap gap-4 items-center justify-between z-10 shrink-0">
                 
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                   <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                     <i className="fa-solid fa-list"></i> <span className="hidden sm:inline">List</span>
                   </button>
                   <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                     <i className="fa-solid fa-border-all"></i> <span className="hidden sm:inline">Grid</span>
                   </button>
                   <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                     <i className="fa-solid fa-calendar-days"></i> <span className="hidden sm:inline">Calendar View</span>
                   </button>
                 </div>

                 {/* Mobile Add Event Quick button */}
                 {currentUser.isAdmin && (
                   <button onClick={() => setShowAddModal(true)} className="md:hidden bg-[#1e3a8a] text-white px-3 py-1.5 rounded text-sm font-bold">
                     + New
                   </button>
                 )}
              </div>

              {/* View Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                 
                 {activeTab === 'recommended' && (
                   <div className="mb-8 bg-linear-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                     <i className="fa-solid fa-sparkles absolute right-4 bottom-0 text-8xl opacity-10"></i>
                     <h2 className="text-2xl font-bold mb-2 relative z-10 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-yellow-400"></i> Events for You</h2>
                     <p className="text-blue-100 text-sm relative z-10">Based on your major ({currentUser.dept}) and past event attendance.</p>
                   </div>
                 )}

                 {displayedEvents.length === 0 ? (
                   <div className="text-center py-20">
                     <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                       <i className="fa-regular fa-calendar-xmark"></i>
                     </div>
                     <h3 className="text-lg font-bold text-gray-800">No events found</h3>
                     <p className="text-gray-500 text-sm">Try adjusting your filters or checking a different tab.</p>
                   </div>
                 ) : (
                   <>
                     {viewMode === 'list' && (
                       <div className="max-w-4xl mx-auto space-y-4">
                         {displayedEvents.map(event => (
                           <div key={event.id} onClick={() => setActiveEvent(event)} className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row gap-4 lg:gap-6 group">
                              <div className="flex items-center md:items-start gap-4 md:flex-col md:w-32 shrink-0">
                                <div className="text-center shadow-sm border border-gray-100 rounded-xl overflow-hidden min-w-16.25">
                                  <div className="bg-red-500 text-white text-[10px] uppercase font-bold py-1 px-2">
                                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                  </div>
                                  <div className="bg-white text-gray-900 font-extrabold text-xl py-1">
                                    {new Date(event.date).getDate()}
                                  </div>
                                </div>
                                <div className="md:hidden flex flex-col gap-1">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border w-max ${getTypeColor(event.type)}`}>{event.type}</span>
                                  <p className="text-xs text-gray-500 font-bold">{event.time}</p>
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="hidden md:flex items-center gap-2 mb-2">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getTypeColor(event.type)}`}>{event.type}</span>
                                  <span className="text-xs text-gray-500 font-bold"><i className="fa-regular fa-clock"></i> {event.time}</span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition truncate-multiline">{event.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> {event.location} • <span className="font-semibold">{event.organizer}</span></p>
                                
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">{event.description}</p>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                    <i className="fa-solid fa-users text-blue-500"></i> {event.interested} interested
                                  </div>
                                  
                                  {!event.isPast && (
                                    <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition flex gap-2">
                                      <button onClick={(e) => toggleInterest(event.id, e)} className={`text-xs font-bold px-3 py-1.5 rounded border transition ${event.isUserInterested ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                        <i className={`fa-heart ${event.isUserInterested ? 'fa-solid' : 'fa-regular'}`}></i>
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setShowReminderModal(event.id); }} className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded transition">
                                        <i className="fa-regular fa-bell"></i> Remind
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                           </div>
                         ))}
                       </div>
                     )}

                     {viewMode === 'grid' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {displayedEvents.map(event => (
                           <div key={event.id} onClick={() => setActiveEvent(event)} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col h-full overflow-hidden group">
                              <div className={`h-2 relative ${
                                event.type === 'Seminar' ? 'bg-blue-500' :
                                event.type === 'Workshop' ? 'bg-purple-500' :
                                event.type === 'Competition' ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}></div>
                              <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getTypeColor(event.type)}`}>
                                    <i className={`fa-solid ${getTypeIcon(event.type)} mr-1`}></i> {event.type}
                                  </span>
                                  <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">
                                    {new Date(event.date).toLocaleDateString('en-US', {month:'short', day:'numeric'})}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight mb-2">{event.title}</h3>
                                <p className="text-xs text-gray-500 font-medium mb-3">{event.organizer}</p>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{event.description}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                                  <span className="flex items-center gap-1"><i className="fa-regular fa-clock text-gray-400"></i> {event.time.split(' - ')[0]}</span>
                                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><i className="fa-solid fa-fire text-orange-500"></i> {event.interested}</span>
                                </div>
                              </div>
                           </div>
                         ))}
                       </div>
                     )}

                     {viewMode === 'calendar' && (
                       <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-10 min-h-[60vh] flex flex-col items-center justify-center bg-[url('/grid-bg.svg')] bg-center">
                          <div className="text-center max-w-sm">
                            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
                              <i className="fa-solid fa-calendar-days text-4xl -rotate-3"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Full Calendar Integration</h2>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">The calendar matrix block logic maps here visually. For immediate event interaction mapping, use List or Grid views.</p>
                            <div className="flex gap-4 justify-center">
                              <button onClick={() => setViewMode('grid')} className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-xl font-medium shadow-sm hover:bg-blue-800 transition">
                                Return to Grid
                              </button>
                            </div>
                          </div>
                       </div>
                     )}
                   </>
                 )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Modals */}
      {/* 1. Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="bg-blue-50 border-b border-blue-100 p-4 text-center relative">
              <button onClick={() => setShowReminderModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark"></i></button>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-blue-500 text-xl shadow-sm mb-2"><i className="fa-regular fa-bell"></i></div>
              <h3 className="font-bold text-gray-800">Set Event Reminder</h3>
            </div>
            <div className="p-5 space-y-2">
              <button onClick={(e) => handleSetReminder('15 minutes', e)} className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 font-medium text-gray-700 transition">15 minutes before</button>
              <button onClick={(e) => handleSetReminder('1 hour', e)} className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 font-medium text-gray-700 transition">1 hour before</button>
              <button onClick={(e) => handleSetReminder('1 day', e)} className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 font-medium text-gray-700 transition">1 day before</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Event Form (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col md:items-center justify-center p-0 md:p-4 overflow-hidden">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-200 md:rounded-3xl shadow-2xl flex flex-col animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <i className="fa-solid fa-calendar-plus text-blue-600"></i> Create Academic Event
               </h2>
               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 rounded-full hover:bg-gray-200 transition">
                 <i className="fa-solid fa-times"></i>
               </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="overflow-y-auto flex-1 p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Event Title</label>
                   <input required value={newForm.title} onChange={e=>setNewForm({...newForm, title: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="E.g. Annual Tech Symposium" />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Event Type</label>
                   <select value={newForm.type} onChange={e=>setNewForm({...newForm, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium">
                     {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Organizing Department</label>
                   <select value={newForm.organizer} onChange={e=>setNewForm({...newForm, organizer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium">
                     <option value="">Select Department...</option>
                     {depts.filter(d=>d!=='All').map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Date</label>
                   <input required value={newForm.date} onChange={e=>setNewForm({...newForm, date: e.target.value})} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Time (e.g. 14:00 - 16:00)</label>
                   <input required value={newForm.time} onChange={e=>setNewForm({...newForm, time: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Start - End" />
                 </div>

                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Location or Virtual Link</label>
                   <input required value={newForm.location} onChange={e=>setNewForm({...newForm, location: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Room 402 or https://zoom.us/..." />
                 </div>

                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                   <textarea required value={newForm.description} onChange={e=>setNewForm({...newForm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-medium min-h-32 resize-none" placeholder="Provide full details about speakers, agenda, etc."></textarea>
                 </div>
               </div>
               
               <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                 <div className="flex items-center justify-between">
                   <div>
                     <span className="block font-bold text-sm text-gray-800">Requires Registration?</span>
                     <span className="block text-xs text-gray-500">Students must RSVP via external link.</span>
                   </div>
                   <input type="checkbox" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                 </div>
               </div>
               
               <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                 <i className="fa-regular fa-image text-3xl text-gray-400 mb-2"></i>
                 <p className="text-sm font-bold text-gray-600">Upload Featured Image</p>
                 <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
               </div>
            </form>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3 rounded-b-3xl">
               <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
               <button type="submit" onClick={handleAddEvent} className="px-6 py-2.5 rounded-xl font-bold bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-md transition flex items-center gap-2">
                 <i className="fa-solid fa-paper-plane"></i> Publish Event
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="bg-purple-50 border-b border-purple-100 p-4 text-center relative">
              <button onClick={() => setShowFeedbackModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark"></i></button>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-purple-500 text-xl shadow-sm mb-2"><i className="fa-solid fa-comment-dots"></i></div>
              <h3 className="font-bold text-gray-800">Leave Event Feedback</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-center gap-2 text-2xl text-gray-300">
                <button className="hover:text-yellow-400 focus:text-yellow-400"><i className="fa-solid fa-star"></i></button>
                <button className="hover:text-yellow-400 focus:text-yellow-400"><i className="fa-solid fa-star"></i></button>
                <button className="hover:text-yellow-400 focus:text-yellow-400"><i className="fa-solid fa-star"></i></button>
                <button className="hover:text-yellow-400 focus:text-yellow-400"><i className="fa-solid fa-star"></i></button>
                <button className="hover:text-yellow-400 focus:text-yellow-400"><i className="fa-solid fa-star"></i></button>
              </div>
              <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 text-sm" placeholder="What did you think of the event?" rows="3"></textarea>
              <button onClick={() => { alert('Feedback submitted!'); setShowFeedbackModal(null); }} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Keyframe Injection for Modals */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s ease-out forwards; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        .truncate-multiline {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}} />
    </div>
  );
}