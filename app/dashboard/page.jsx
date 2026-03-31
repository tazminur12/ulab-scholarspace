"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const quotes = useMemo(() => [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Your limitation—it's only your imagination. Push beyond it.",
    "Great things never come from comfort zones.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it."
  ], []);

  const [studentName, setStudentName] = useState('Student');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [completedReminders, setCompletedReminders] = useState(new Set());
  const router = useRouter();

  // Sample data
  const upcomingExams = useMemo(() => [
    { subject: 'Data Structures', date: 'April 5, 2026', time: '10:00 AM', daysLeft: 9, timestamp: new Date('2026-04-05T10:00:00') },
    { subject: 'Web Development', date: 'April 8, 2026', time: '2:00 PM', daysLeft: 12, timestamp: new Date('2026-04-08T14:00:00') },
    { subject: 'Database Management', date: 'April 12, 2026', time: '11:00 AM', daysLeft: 16, timestamp: new Date('2026-04-12T11:00:00') }
  ], []);

  const recentNotes = useMemo(() => [
    { id: 1, title: 'Data Structures - Arrays', date: '2026-03-26', subject: 'CSE' },
    { id: 2, title: 'OOP Concepts', date: '2026-03-25', subject: 'CSE' },
    { id: 3, title: 'Web Design Principles', date: '2026-03-24', subject: 'CSE' }
  ], []);

  const recentDiscussions = useMemo(() => [
    { id: 1, subject: 'Web Development', question: 'How to optimize CSS performance?', answers: 5 },
    { id: 2, subject: 'Database Management', question: 'Best practices for indexing', answers: 8 },
    { id: 3, subject: 'Data Structures', question: 'Understanding Binary Trees', answers: 12 }
  ], []);

  const [todayReminders, setTodayReminders] = useState([
    { id: 1, title: 'Web Dev Assignment Due', type: 'task', time: '5:00 PM' },
    { id: 2, title: 'Study Group Meeting', type: 'event', time: '7:00 PM' },
    { id: 3, title: 'Review DSA Chapter 3', type: 'study', time: '8:00 PM' }
  ]);

  const subjects = useMemo(() => [
    { name: 'Data Structures', progress: 75 },
    { name: 'Web Development', progress: 60 },
    { name: 'Database Management', progress: 80 },
    { name: 'Web Design', progress: 55 }
  ], []);

  const todayStudyPlan = useMemo(() => [
    { subject: 'Data Structures', time: '2 hours', topic: 'Binary Search Trees' },
    { subject: 'Web Development', time: '1.5 hours', topic: 'React Hooks' },
    { subject: 'Database Management', time: '1 hour', topic: 'SQL Optimization' }
  ], []);

  useEffect(() => {
    // Sync reminders
    const savedReminders = localStorage.getItem('ulab_reminders');
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayData = parsed.filter(r => r.date === todayStr && !r.completed).slice(0, 3);
      if (todayData.length > 0) {
        setTodayReminders(todayData.map(r => ({ id: r.id, title: r.title, type: r.type.toLowerCase(), time: r.time })));
      }
    }

    // Initialize state
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const loggedInUser = JSON.parse(storedUser);
        if (loggedInUser.fullName && loggedInUser.fullName !== studentName) {
          setStudentName(loggedInUser.fullName);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Set random quote
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    if (!motivationalQuote) {
      setMotivationalQuote(selectedQuote);
    }

    // Update date and time
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  const handleAddReminder = () => {
    router.push('/reminders');
  };

  const handleGenerateNewPlan = () => {
    router.push('/ai-study-plan');
  };

  const handleCreateNote = () => {
    router.push('/notes/create');
  };

  const handleUploadPDF = () => {
    router.push('/upload-pdf');
  };

  const handleAskAI = () => {
    router.push('/ai-helper');
  };

  const handleFindPartner = () => {
    router.push('/study-groups');
  };

  const handleCourseReviews = () => {
    router.push('/course-reviews');
  };

  const handleQuestionBank = () => {
    router.push('/question-bank');
  };

  const handleResourceFinder = () => {
    router.push('/resource-finder');
  };

  const handleEvents = () => {
    router.push('/events');
  };

  const handleAiQuiz = () => {
    router.push('/ai-quiz');
  };

  const handleAiDoubtSolver = () => {
    router.push('/ai-doubt-solver');
  };

  const handleCompleteReminder = (id) => {
    setCompletedReminders(prev => new Set(prev).add(id));
  };

  const handleEditNote = (noteId) => {
    router.push(`/notes/edit/${noteId}`);
  };

  const handleJoinDiscussion = (discussionId) => {
    router.push(`/discussions/${discussionId}`);
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-2">
                Welcome back, {studentName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">{currentDateTime}</p>
            </div>
            <div className="bg-linear-to-br from-[#1e3a8a] to-purple-600 text-white rounded-xl p-6 text-center">
              <p className="italic text-sm md:text-base leading-relaxed">
                {motivationalQuote ? `"${motivationalQuote}"` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-[#1e3a8a] mb-2">4</div>
            <p className="text-gray-600 font-medium">Total Subjects</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-orange-500 mb-2">3</div>
            <p className="text-gray-600 font-medium">Upcoming Exams</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-red-500 mb-2">5</div>
            <p className="text-gray-600 font-medium">Pending Tasks</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl font-bold text-green-500 mb-2">24</div>
            <p className="text-gray-600 font-medium">Notes Created</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Exams Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">📅 Upcoming Exams</h2>
                <Link href="/exam-routine" className="text-[#1e3a8a] hover:text-blue-700 font-semibold text-sm">
                  View Full Routine →
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="border-l-4 border-[#1e3a8a] bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 mb-3 md:mb-0">
                        <h3 className="font-bold text-gray-900 text-lg">{exam.subject}</h3>
                        <p className="text-gray-600 text-sm">{exam.date} at {exam.time}</p>
                      </div>
                      <div className="bg-[#1e3a8a] text-white rounded-lg px-4 py-2 text-center">
                        <p className="font-bold">{exam.daysLeft} days</p>
                        <p className="text-xs">remaining</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today&apos;s Study Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">🎯 Today&apos;s Study Plan</h2>
                <button onClick={handleGenerateNewPlan} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-semibold">
                  Generate New Plan
                </button>
              </div>
              <div className="space-y-4">
                {todayStudyPlan.map((plan, index) => (
                  <div key={index} className="bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{plan.subject}</h3>
                        <p className="text-gray-600 text-sm">{plan.topic}</p>
                      </div>
                      <div className="mt-2 md:mt-0 bg-[#1e3a8a] text-white rounded-lg px-4 py-2 text-center">
                        <p className="font-semibold text-sm">{plan.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">📝 Recent Notes</h2>
                <Link href="/notes" className="text-[#1e3a8a] hover:text-blue-700 font-semibold text-sm">
                  View All Notes →
                </Link>
              </div>
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <p className="text-xs text-gray-500">{note.date}</p>
                    </div>
                    <button onClick={() => handleEditNote(note.id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Reminders Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 font-poppins">🔔 Reminders</h2>
                <button onClick={handleAddReminder} className="text-[#1e3a8a] hover:text-blue-700 font-bold text-lg">
                  +
                </button>
              </div>
              <div className="space-y-3">
                {todayReminders.map((reminder) => (
                  <div key={reminder.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${completedReminders.has(reminder.id) ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-[#1e3a8a] rounded cursor-pointer"
                      checked={completedReminders.has(reminder.id)}
                      onChange={() => handleCompleteReminder(reminder.id)}
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${completedReminders.has(reminder.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>{reminder.title}</p>
                      <p className="text-xs text-gray-500">{reminder.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Menu */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4">⚡ Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleCreateNote} className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md text-sm">
                  📄 Add Note
                </button>
                <button onClick={handleResourceFinder} className="w-full bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md text-sm">
                  🔍 Resources
                </button>
                <button onClick={handleEvents} className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md text-sm">
                  📅 Events
                </button>
                <button onClick={handleAiQuiz} className="w-full bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md text-sm">
                  🧠 AI Quiz
                </button>
                <button onClick={handleAiDoubtSolver} className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md text-sm">
                  🎓 Doubt Solver
                </button>
                <button onClick={handleAskAI} className="w-full bg-linear-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md text-sm">
                  🤖 Ask AI
                </button>
                <button onClick={handleFindPartner} className="w-full bg-linear-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md text-sm">
                  👥 Partner
                </button>
                <button onClick={handleCourseReviews} className="w-full bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md text-sm">
                  ⭐ Reviews
                </button>
                <button onClick={handleQuestionBank} className="w-full bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md text-sm">
                  📦 Questions
                </button>
                <button onClick={handleUploadPDF} className="w-full bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md text-sm">
                  📤 PDF 
                </button>
              </div>
            </div>

            {/* Calendar Mini View */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 font-poppins mb-4">📆 Calendar</h2>
              <CalendarMiniView />
            </div>

          </div>

        </div>

        {/* Recent Discussions & Subject Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Discussions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-6">💬 Recent Discussions</h2>
            <div className="space-y-4">
              {recentDiscussions.map((discussion) => (
                <div key={discussion.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider">{discussion.subject}</p>
                      <h3 className="font-semibold text-gray-900 mt-1">{discussion.question}</h3>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold rounded-full px-3 py-1 whitespace-nowrap ml-2">
                      {discussion.answers} answers
                    </span>
                  </div>
                  <button onClick={() => handleJoinDiscussion(discussion.id)} className="text-[#1e3a8a] hover:text-blue-700 font-semibold text-sm">
                    Join Discussion →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress Bars */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-6">📊 Subject Progress</h2>
            <div className="space-y-6">
              {subjects.map((subject, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    <span className="text-[#1e3a8a] font-bold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-[#1e3a8a] to-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Mini Calendar Component
function CalendarMiniView() {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentDate(new Date()), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!currentDate) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg"></div>;
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const examDays = [5, 8, 12];
  const today = new Date().getDate();

  return (
    <div>
      <div className="text-center font-semibold text-gray-900 mb-4">
        {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          let className = 'text-xs text-center py-1 rounded-lg';
          if (day === null) {
            className += ' text-gray-300';
          } else if (day === today) {
            className += ' bg-[#1e3a8a] text-white font-bold';
          } else if (examDays.includes(day)) {
            className += ' bg-orange-200 text-orange-900 font-semibold';
          } else {
            className += ' text-gray-700 hover:bg-gray-100';
          }
          return (
            <div key={index} className={className}>
              {day}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-orange-200 rounded-full"></span> Exam days
      </p>
    </div>
  );
}
