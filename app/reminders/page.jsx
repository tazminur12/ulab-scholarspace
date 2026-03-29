"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RemindersPage() {
  const [mounted, setMounted] = useState(false);
  
  // Views
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'calendar' | 'settings'
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Assignment');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newRepeat, setNewRepeat] = useState('Never');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
    defaultTime: '60', // minutes before
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    types: {
      exam: true,
      class: true,
      assignment: true,
      event: true
    },
    autoGenerate: {
      exams: true,
      classes: true,
      events: false
    },
    soundEnabled: true
  });

  // Mock Data
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Data Structures Assignment due in 1 hour', type: 'assignment', time: '10 min ago', read: false },
    { id: 2, text: 'Midterm Exam Schedule has been updated', type: 'exam', time: '2 hours ago', read: false },
    { id: 3, text: 'Tomorrow: Software Engineering Lecture at 10 AM', type: 'class', time: '5 hours ago', read: true }
  ]);

  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
      
      const saved = localStorage.getItem('ulab_reminders');
      if (saved) {
        setReminders(JSON.parse(saved));
      } else {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 5);
        
        const initialReminders = [
          {
            id: 1,
            title: 'Complete React Components',
            type: 'Assignment',
            date: today.toISOString().split('T')[0],
            time: '23:59',
            repeat: 'Never',
            description: 'Finish the buttons and modals for the UI.',
            subject: 'Software Engineering',
            completed: false
          },
          {
            id: 2,
            title: 'Midterm Exam',
            type: 'Exam',
            date: tomorrow.toISOString().split('T')[0],
            time: '10:00',
            repeat: 'Never',
            description: 'Covers chapters 1-5.',
            subject: 'Data Structures',
            completed: false
          },
          {
            id: 3,
            title: 'Study Group Meeting',
            type: 'Event',
            date: nextWeek.toISOString().split('T')[0],
            time: '15:00',
            repeat: 'Weekly',
            description: 'Meet at the library.',
            subject: 'General',
            completed: false
          }
        ];
        setReminders(initialReminders);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const saveReminders = (newReminders) => {
    setReminders(newReminders);
    localStorage.setItem('ulab_reminders', JSON.stringify(newReminders));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newTime) return;

    const newReminder = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      repeat: newRepeat,
      description: newDescription,
      subject: newSubject,
      completed: false
    };

    saveReminders([...reminders, newReminder]);
    setShowAddModal(false);
    
    // reset
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewDescription('');
    setNewSubject('');
  };

  const toggleComplete = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    saveReminders(updated);
  };

  const deleteReminder = (id) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      const updated = reminders.filter(r => r.id !== id);
      saveReminders(updated);
    }
  };

  const snoozeReminder = (id) => {
    alert(`Reminder ${id} snoozed for 1 hour! (Simulation)`);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleRequestPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          alert('Notifications enabled!');
          if (settings.soundEnabled) {
            // Simulated sound play
          }
          new Notification("ScholarSpace", { body: "Notifications successfully enabled!" });
        }
      });
    } else {
      alert("Browser does not support desktop notifications.");
    }
  };

  // Helper functions to categorize grouped reminders
  const categorizeReminders = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
    
    const weekEndDate = new Date();
    weekEndDate.setDate(weekEndDate.getDate() + 7);
    const weekEndStr = weekEndDate.toISOString().split('T')[0];

    return reminders.reduce(
      (acc, r) => {
        if (r.completed) return acc; // Only show pending in active groups
        
        if (r.date === todayStr) {
          acc.today.push(r);
        } else if (r.date === tomorrowStr) {
          acc.tomorrow.push(r);
        } else if (r.date > tomorrowStr && r.date <= weekEndStr) {
          acc.thisWeek.push(r);
        } else if (r.date > weekEndStr) {
          acc.later.push(r);
        } else {
          acc.past.push(r);
        }
        return acc;
      },
      { today: [], tomorrow: [], thisWeek: [], later: [], past: [] }
    );
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Exam': return <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg"><i className="fa-solid fa-file-pen"></i></div>;
      case 'Class': return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg"><i className="fa-solid fa-chalkboard-user"></i></div>;
      case 'Assignment': return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg"><i className="fa-solid fa-book"></i></div>;
      default: return <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg"><i className="fa-regular fa-calendar-check"></i></div>;
    }
  };

  const renderReminderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{title} <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs ml-2">{items.length}</span></h3>
        <div className="space-y-3">
          {items.map(r => (
            <div key={r.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-300 transition group">
              <div className="pt-1">
                {getIcon(r.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900">{r.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    r.type === 'Exam' ? 'bg-red-50 text-red-600' :
                    r.type === 'Assignment' ? 'bg-purple-50 text-purple-600' :
                    r.type === 'Class' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {r.type}
                  </span>
                </div>
                
                <p className="text-xs text-blue-600 font-medium mt-1 mb-2 flex items-center gap-1">
                  <i className="fa-regular fa-clock"></i> {r.date} at {r.time}
                  {r.subject && <><span className="text-gray-300 mx-1">•</span><span className="text-gray-500">{r.subject}</span></>}
                </p>
                
                {r.description && <p className="text-sm text-gray-600 mb-3">{r.description}</p>}
                
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => toggleComplete(r.id)} className="text-sm font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Complete
                  </button>
                  <button onClick={() => snoozeReminder(r.id)} className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i className="fa-solid fa-moon"></i> Snooze
                  </button>
                  <button onClick={() => deleteReminder(r.id)} className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg ml-auto flex items-center gap-1">
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  const grouped = categorizeReminders();
  const unreadNotifs = notifications.filter(n => !n.read).length;

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
            <i className="fa-solid fa-bell text-blue-500 text-xl"></i>
            Reminders & Notifications
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
             <button 
               onClick={() => setShowNotificationCenter(!showNotificationCenter)}
               className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition relative"
             >
                <i className="fa-solid fa-bell"></i>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {unreadNotifs}
                  </span>
                )}
             </button>

             {/* Notification Dropdown */}
             {showNotificationCenter && (
               <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-up">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <div className="flex gap-2">
                      <button onClick={markAllNotificationsRead} className="text-xs text-blue-600 font-medium hover:underline">Mark read</button>
                      <button onClick={clearNotifications} className="text-xs text-gray-500 font-medium hover:underline">Clear</button>
                    </div>
                 </div>
                 <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-gray-500">No recent notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-lg mb-1 flex gap-3 items-start ${n.read ? 'bg-transparent' : 'bg-blue-50 border border-blue-100'}`}>
                           <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${n.type === 'assignment' ? 'bg-purple-100 text-purple-600' : n.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                             <i className={`fa-solid ${n.type === 'assignment' ? 'fa-book' : n.type === 'exam' ? 'fa-pen-clip' : 'fa-chalkboard'}`}></i>
                           </div>
                           <div className="flex-1">
                             <p className={`text-sm ${n.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>{n.text}</p>
                             <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{n.time}</p>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               </div>
             )}
          </div>
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center hover:bg-blue-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Nav Tabs */}
        <div className="w-56 bg-white border-r border-gray-200 h-full flex-col shrink-0 p-4 space-y-2 hidden md:flex relative z-10">
           <button onClick={() => setShowAddModal(true)} className="w-full bg-[#1e3a8a] text-white font-medium py-2.5 rounded-xl hover:bg-blue-800 transition shadow-sm flex justify-center items-center gap-2 mb-6">
              <i className="fa-solid fa-plus"></i> Add Reminder
           </button>

           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2 mb-2">Views</h4>
           <button 
             onClick={() => setActiveTab('list')}
             className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeTab === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className="fa-solid fa-list-ul w-4 text-center"></i> Upcoming List
           </button>
           <button 
             onClick={() => setActiveTab('calendar')}
             className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
           >
             <i className="fa-regular fa-calendar-days w-4 text-center"></i> Calendar View
           </button>
           
           <div className="mt-8">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2 mb-2">Configuration</h4>
             <button 
               onClick={() => setActiveTab('settings')}
               className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
             >
               <i className="fa-solid fa-gear w-4 text-center"></i> Settings
             </button>
           </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <div className="max-w-4xl mx-auto">
            
            {activeTab === 'list' && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Reminders</h2>
                    <p className="text-gray-500 text-sm mt-1">Stay on top of your academic schedule.</p>
                  </div>
                  <button onClick={() => setShowAddModal(true)} className="md:hidden bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    + Add
                  </button>
                </div>

                {grouped.today.length === 0 && grouped.tomorrow.length === 0 && grouped.thisWeek.length === 0 && grouped.later.length === 0 && grouped.past.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
                    <h3 className="text-gray-800 font-bold mb-1">All caught up!</h3>
                    <p className="text-gray-500 text-sm">You have no upcoming reminders.</p>
                  </div>
                ) : (
                  <>
                    {grouped.today.length > 0 && (
                      <div className="mb-8">
                        <div className="bg-linear-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 shadow-md mb-6 relative overflow-hidden">
                          <i className="fa-solid fa-bolt absolute right-4 -bottom-4 text-8xl text-white opacity-10"></i>
                          <h3 className="text-xl font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                            <i className="fa-solid fa-calendar-day"></i> Due Today
                          </h3>
                        </div>
                        {grouped.today.map(r => (
                          <div key={r.id} className="bg-white rounded-2xl p-5 border-l-4 border-l-red-500 shadow-sm border border-gray-100 mb-4 flex gap-4 transition hover:shadow-md group">
                            <div className="pt-1">
                               {getIcon(r.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 text-lg">{r.title}</h4>
                                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 animate-pulse">
                                  Action Required
                                </span>
                              </div>
                              <p className="text-sm font-bold text-red-600 mt-1 mb-2 flex items-center gap-1">
                                <i className="fa-regular fa-clock"></i> Today at {r.time}
                                {r.subject && <span className="text-gray-500 ml-2 font-medium">• {r.subject}</span>}
                              </p>
                              {r.description && <p className="text-sm text-gray-600 mb-3">{r.description}</p>}
                              
                              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => toggleComplete(r.id)} className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
                                  <i className="fa-solid fa-check"></i> Mark Complete
                                </button>
                                <button onClick={() => snoozeReminder(r.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition">Snooze</button>
                                <button onClick={() => deleteReminder(r.id)} className="text-gray-400 hover:text-red-600 ml-auto transition">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {renderReminderGroup('Tomorrow', grouped.tomorrow)}
                    {renderReminderGroup('Later This Week', grouped.thisWeek)}
                    {renderReminderGroup('Upcoming Later', grouped.later)}
                    
                    {grouped.past.length > 0 && (
                       <div className="mt-12 opacity-50 hover:opacity-100 transition">
                         {renderReminderGroup('Overdue / Past', grouped.past)}
                       </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'calendar' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-150 flex items-center justify-center">
                 <div className="text-center">
                   <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <i className="fa-solid fa-calendar-days text-4xl"></i>
                   </div>
                   <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar View</h2>
                   <p className="text-gray-500 mb-6">A full monthly/weekly calendar grid integration goes here. For now, rely on standard list views.</p>
                   <div className="flex gap-4 justify-center">
                     <button className="px-6 py-2 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                       <i className="fa-brands fa-google"></i> Sync with Google Calendar
                     </button>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">Notification & Reminder Settings</h2>
                  <p className="text-sm text-gray-500">Manage how and when you receive alerts.</p>
                </div>
                
                <div className="p-6 space-y-8">
                  
                  {/* Browser Perms */}
                  <div>
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-desktop text-blue-500"></i> System Permissions
                    </h3>
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div>
                        <p className="font-bold text-gray-900">Browser Notifications</p>
                        <p className="text-sm text-gray-600">Receive alerts even when ScholarSpace is closed.</p>
                      </div>
                      <button onClick={handleRequestPermission} className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-800 transition">
                        Enable Notifications
                      </button>
                    </div>
                  </div>

                  {/* Auto Generate */}
                  <div>
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-wand-magic-sparkles text-purple-500"></i> Auto-Generated Reminders
                    </h3>
                    <div className="space-y-3">
                       <label className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                         <div>
                           <p className="font-bold text-sm text-gray-800">From Exam Routine</p>
                           <p className="text-xs text-gray-500">Automatically creates reminders for tests.</p>
                         </div>
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" defaultChecked={settings.autoGenerate.exams} />
                       </label>
                       <label className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer">
                         <div>
                           <p className="font-bold text-sm text-gray-800">From Class Schedule</p>
                           <p className="text-xs text-gray-500">Automatically creates daily class alerts.</p>
                         </div>
                         <input type="checkbox" className="w-5 h-5 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" defaultChecked={settings.autoGenerate.classes} />
                       </label>
                    </div>
                  </div>

                  {/* Timing */}
                  <div>
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                      <i className="fa-regular fa-clock text-green-500"></i> Quiet Hours & Defaults
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-4 border border-gray-100 rounded-xl">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Alert Time</label>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" defaultValue={settings.defaultTime}>
                            <option value="15">15 minutes before</option>
                            <option value="30">30 minutes before</option>
                            <option value="60">1 hour before</option>
                            <option value="1440">1 day before</option>
                          </select>
                       </div>
                       <div className="p-4 border border-gray-100 rounded-xl flex gap-4 items-center">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quiet Time Start</label>
                            <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" defaultValue={settings.quietHoursStart} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quiet Time End</label>
                            <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" defaultValue={settings.quietHoursEnd} />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <button onClick={() => setSettings({...settings})} className="bg-gray-900 border border-transparent rounded-xl shadow-sm py-2 px-6 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                        Save Preferences
                     </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center text-sm">
                   <i className="fa-solid fa-plus"></i>
                 </div>
                 New Reminder
               </h2>
               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                 <i className="fa-solid fa-times text-xl"></i>
               </button>
            </div>
            
            <form onSubmit={handleAddReminder} className="p-6 space-y-5">
               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Title</label>
                 <input 
                   type="text" 
                   required
                   value={newTitle}
                   onChange={(e) => setNewTitle(e.target.value)}
                   placeholder="e.g., Read chapter 4"
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Date</label>
                   <input 
                     type="date" 
                     required
                     value={newDate}
                     onChange={(e) => setNewDate(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Time</label>
                   <input 
                     type="time" 
                     required
                     value={newTime}
                     onChange={(e) => setNewTime(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Type</label>
                   <select 
                     value={newType}
                     onChange={(e) => setNewType(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                   >
                     <option value="Assignment">Assignment</option>
                     <option value="Exam">Exam / Test</option>
                     <option value="Class">Class / Lecture</option>
                     <option value="Event">Event</option>
                     <option value="Custom">Custom</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Repeat</label>
                   <select 
                     value={newRepeat}
                     onChange={(e) => setNewRepeat(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                   >
                     <option value="Never">Once</option>
                     <option value="Daily">Daily</option>
                     <option value="Weekly">Weekly</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subject Link (Optional)</label>
                 <input 
                   type="text" 
                   value={newSubject}
                   onChange={(e) => setNewSubject(e.target.value)}
                   placeholder="e.g., Computer Science 101"
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Notes / Description (Optional)</label>
                 <textarea 
                   value={newDescription}
                   onChange={(e) => setNewDescription(e.target.value)}
                   placeholder="Details about the task..."
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition min-h-24 resize-none"
                 ></textarea>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                 <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">
                   Cancel
                 </button>
                 <button type="submit" className="px-8 py-2.5 bg-[#1e3a8a] text-white font-medium rounded-xl hover:bg-blue-800 shadow-md transition">
                   Save Reminder
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Basic Keyframe Injection for Modals */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out forwards;
        }
      `}} />
    </div>
  );
}