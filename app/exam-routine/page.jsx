"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function ExamRoutine() {
  const [mounted, setMounted] = useState(false);
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState({ isAdmin: false, department: 'CSE', semester: 'Spring 2026' });

  // Filters
  const [filterDept, setFilterDept] = useState('All');
  const [filterSem, setFilterSem] = useState('All');
  const [filterType, setFilterType] = useState('All');
  
  // View toggle
  const [view, setView] = useState('table'); // 'table' or 'calendar'
  
  // Admin form
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    id: '', date: '', time: '', subjectCode: '', subjectName: '', type: 'Midterm', room: '', department: 'CSE', semester: 'Spring 2026'
  });
  
  // Reminders
  const [reminders, setReminders] = useState({});

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUser = { isAdmin: false, department: 'CSE', semester: 'Spring 2026' };
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        currentUser = { ...currentUser, ...parsed };
        // If it's admin role, or we force it by a checkbox in UI later
        if (parsed.role === 'admin') currentUser.isAdmin = true;
      } catch (e) { console.error(e) }
    }
    setTimeout(() => {
      setUser(currentUser);
      setFilterDept(currentUser.department || 'All');
      setFilterSem(currentUser.semester || 'All');

      // Load exams
      const storedExams = localStorage.getItem('ulab_exams');
      if (storedExams) {
        setExams(JSON.parse(storedExams));
      } else {
        const defaultExams = [
          { id: '1', date: '2026-04-05', time: '10:00 AM', subjectCode: 'CSE301', subjectName: 'Data Structures', type: 'Midterm', room: 'PC-401', department: 'CSE', semester: 'Spring 2026' },
          { id: '2', date: '2026-04-08', time: '02:00 PM', subjectCode: 'CSE305', subjectName: 'Web Development', type: 'Final', room: 'PC-402', department: 'CSE', semester: 'Spring 2026' },
          { id: '3', date: '2026-04-12', time: '11:00 AM', subjectCode: 'CSE401', subjectName: 'Database Management', type: 'Midterm', room: 'PC-305', department: 'CSE', semester: 'Spring 2026' }
        ];
        setExams(defaultExams);
        localStorage.setItem('ulab_exams', JSON.stringify(defaultExams));
      }

      const storedReminders = localStorage.getItem('ulab_exam_reminders');
      if (storedReminders) setReminders(JSON.parse(storedReminders));
    }, 0);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ulab_exams', JSON.stringify(exams));
    }
  }, [exams, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ulab_exam_reminders', JSON.stringify(reminders));
    }
  }, [reminders, mounted]);

  const filteredExams = useMemo(() => {
    return exams.filter(ex => {
      if (filterDept !== 'All' && ex.department !== filterDept) return false;
      if (filterSem !== 'All' && ex.semester !== filterSem) return false;
      if (filterType !== 'All' && ex.type !== filterType) return false;
      return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [exams, filterDept, filterSem, filterType]);

  const nextExam = useMemo(() => {
    const now = new Date();
    const futureExams = filteredExams.filter(ex => new Date(`${ex.date} ${ex.time}`) > now);
    return futureExams.length > 0 ? futureExams[0] : null;
  }, [filteredExams]);

  const countdown = useMemo(() => {
    if (!nextExam) return null;
    const now = new Date();
    const examDate = new Date(`${nextExam.date} ${nextExam.time}`);
    const diff = examDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days} days ${hours} hours`;
  }, [nextExam]);

  const handleAdminToggle = () => {
    setUser(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
  };

  const saveExam = (e) => {
    e.preventDefault();
    if (editId) {
      setExams(exams.map(ex => ex.id === editId ? { ...formData } : ex));
    } else {
      setExams([...exams, { ...formData, id: Date.now().toString() }]);
    }
    setShowAddForm(false);
    setEditId(null);
  };

  const editExam = (ex) => {
    setFormData(ex);
    setEditId(ex.id);
    setShowAddForm(true);
  };

  const deleteExam = (id) => {
    if (window.confirm("Are you sure?")) {
      setExams(exams.filter(ex => ex.id !== id));
    }
  };

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Link href="/dashboard" className="text-[#1e3a8a] text-sm hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">ULAB Exam Routine</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            {nextExam && (
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold shadow-sm text-sm border border-orange-200">
                ⏳ Next Exam: {nextExam.subjectName} in {countdown}
              </div>
            )}
            <button onClick={handleAdminToggle} className="text-xs bg-gray-200 px-2 py-1 rounded">
              Toggle Admin ({user.isAdmin ? 'ON' : 'OFF'})
            </button>
          </div>
        </div>

        {/* Toolbar: Filters & Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col lg:flex-row justify-between gap-4 border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="BBA">BBA</option>
              <option value="ENG">English</option>
              <option value="MSJ">MSJ</option>
            </select>
            
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
              <option value="All">All Semesters</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2026">Fall 2026</option>
            </select>

            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
            </select>
            
            <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors">
              Apply Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex mr-2">
              <button 
                onClick={() => setView('table')} 
                className={`px-3 py-1 text-sm rounded ${view === 'table' ? 'bg-white shadow font-semibold text-[#1e3a8a]' : 'text-gray-600'}`}
              >
                Table View
              </button>
              <button 
                onClick={() => setView('calendar')} 
                className={`px-3 py-1 text-sm rounded ${view === 'calendar' ? 'bg-white shadow font-semibold text-[#1e3a8a]' : 'text-gray-600'}`}
              >
                Calendar View
              </button>
            </div>
            
            <button onClick={handlePrint} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors border border-gray-300">
              <i className="fa-solid fa-file-pdf mr-1"></i> Download / Print
            </button>
            <button onClick={handleShare} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors border border-gray-300">
              <i className="fa-solid fa-share-nodes mr-1"></i> Share
            </button>
            
            {user.isAdmin && (
              <>
                <button onClick={() => { setFormData({ id: '', date: '', time: '', subjectCode: '', subjectName: '', type: 'Midterm', room: '', department: 'CSE', semester: 'Spring 2026' }); setEditId(null); setShowAddForm(true); }} className="bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  <i className="fa-solid fa-plus mr-1"></i> Add Exam
                </button>
                <button className="bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-purple-700 transition-colors">
                  <i className="fa-solid fa-upload mr-1"></i> Bulk Upload
                </button>
              </>
            )}
          </div>
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Admin Form Modal */}
            {showAddForm && user.isAdmin && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
                  <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Exam' : 'Add New Exam'}</h2>
                  <form onSubmit={saveExam} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject Code</label>
                        <input required type="text" className="w-full border rounded px-3 py-2" value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} placeholder="e.g. CSE301"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject Name</label>
                        <input required type="text" className="w-full border rounded px-3 py-2" value={formData.subjectName} onChange={e => setFormData({...formData, subjectName: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input required type="date" className="w-full border rounded px-3 py-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input required type="time" className="w-full border rounded px-3 py-2" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Exam Type</label>
                        <select className="w-full border rounded px-3 py-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="Midterm">Midterm</option>
                          <option value="Final">Final</option>
                          <option value="Quiz">Quiz</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Room (Optional)</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Semester</label>
                        <input type="text" className="w-full border rounded px-3 py-2" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-[#1e3a8a] text-white rounded hover:bg-blue-800">Save Exam</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Table View */}
            {view === 'table' && (
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#1e3a8a] text-white uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Date & Day</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredExams.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500">No exams found for the selected filters.</td>
                        </tr>
                      ) : filteredExams.map((exam, i) => {
                        const dateObj = new Date(exam.date);
                        const isToday = dateObj.toDateString() === new Date().toDateString();
                        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        
                        return (
                          <tr key={exam.id} className={`${isToday ? 'bg-orange-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`font-semibold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>{dateStr}</div>
                              <div className="text-xs text-gray-500">{dayStr}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-[#1e3a8a]">{exam.subjectCode}</div>
                              <div className="text-gray-600">{exam.subjectName}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{exam.time}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs font-semibold
                                ${exam.type === 'Final' ? 'bg-red-100 text-red-800' : 
                                  exam.type === 'Midterm' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {exam.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-600">{exam.room || 'TBA'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="text-gray-500 hover:text-blue-600" title="Add to Calendar">
                                  <i className="fa-regular fa-calendar-plus"></i>
                                </button>
                                <button 
                                  onClick={() => toggleReminder(exam.id)} 
                                  className={`${reminders[exam.id] ? 'text-orange-500' : 'text-gray-400'} hover:text-orange-600 mx-1`}
                                  title={reminders[exam.id] ? "Reminder Set" : "Set Reminder"}
                                >
                                  <i className={reminders[exam.id] ? "fa-solid fa-bell" : "fa-regular fa-bell"}></i>
                                </button>
                                
                                {user.isAdmin && (
                                  <>
                                    <button onClick={() => editExam(exam)} className="text-blue-500 hover:text-blue-700" title="Edit">
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button onClick={() => deleteExam(exam.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Calendar View */}
            {view === 'calendar' && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center justify-center min-h-100">
                {/* Simplifying calendar view using a rough visual grid */}
                <h3 className="text-xl font-bold mb-6 text-gray-800">Exam Calendar</h3>
                <div className="grid grid-cols-7 gap-2 w-full max-w-3xl">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-500 text-sm py-2">{day}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const d = new Date(2026, 3, i + 1); // April 2026 mock
                    const dateStr = d.toISOString().split('T')[0];
                    const dayExams = filteredExams.filter(e => e.date === dateStr);
                    const isToday = d.toDateString() === new Date().toDateString();

                    return (
                      <div key={i} className={`min-h-20 border rounded-lg p-1 flex flex-col ${isToday ? 'border-orange-400 bg-orange-50' : 'border-gray-200'} ${dayExams.length > 0 ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : ''}`}>
                        <div className={`text-xs font-semibold mb-1 ${isToday ? 'bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500'}`}>
                          {i + 1}
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden">
                          {dayExams.map((ex, j) => (
                            <div key={j} className="text-[10px] bg-[#1e3a8a] text-white px-1 py-0.5 rounded leading-tight truncate" title={ex.subjectName}>
                              {ex.time} {ex.subjectCode}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-6">* Visual Calendar represents April 2026 for demonstration.</p>
              </div>
            )}
          </div>

          {/* Exam Tips Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                Study Tips
              </h3>
              
              {nextExam ? (
                <>
                  <div className="mb-4 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">UPCOMING EXAM</p>
                    <p className="font-bold text-gray-900 border-b pb-2 mb-2">{nextExam.subjectName} ({nextExam.subjectCode})</p>
                    <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4 marker:text-[#1e3a8a]">
                      <li>Review chapter sumaries.</li>
                      <li>Practice past question papers.</li>
                      <li>Focus on main algorithms and structures.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Related Resources</h4>
                    <div className="space-y-2">
                      <Link href="/notes" className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 p-2 rounded border border-gray-200 transition-colors">
                        <i className="fa-regular fa-file-lines text-blue-500"></i>
                        <span>{nextExam.subjectCode} Class Notes</span>
                      </Link>
                      <Link href="/discussions" className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 p-2 rounded border border-gray-200 transition-colors">
                        <i className="fa-regular fa-comments text-purple-500"></i>
                        <span>{nextExam.subjectCode} Q&A Board</span>
                      </Link>
                      <button className="flex items-center gap-2 text-sm w-full bg-white hover:bg-gray-50 p-2 rounded border border-gray-200 transition-colors text-left">
                        <i className="fa-solid fa-user-group text-green-500"></i>
                        <span>Find Study Partner</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-blue-100">
                  <p>You have no upcoming exams scheduled. Great time to relax or get ahead on assignments!</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}