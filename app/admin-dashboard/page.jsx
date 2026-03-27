"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only allow admin? We'll just set mounted for now
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  const tabs = [
    { name: 'Home', icon: 'fa-house', id: 'Home' },
    { name: 'User Management', icon: 'fa-users', id: 'Users' },
    { name: 'Exam Routine', icon: 'fa-calendar-days', id: 'Exams' },
    { name: 'Subject Management', icon: 'fa-book', id: 'Subjects' },
    { name: 'Content Moderation', icon: 'fa-shield-halved', id: 'Moderation' },
    { name: 'Resources Approval', icon: 'fa-file-circle-check', id: 'Resources' },
    { name: 'Event Management', icon: 'fa-calendar-star', id: 'Events' },
    { name: 'System Settings', icon: 'fa-gear', id: 'Settings' },
    { name: 'Reports', icon: 'fa-chart-pie', id: 'Reports' },
    { name: 'Activity Log', icon: 'fa-list-ul', id: 'Activity' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] text-white hidden md:flex flex-col shrink-0 shadow-xl z-20">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold font-poppins tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-bolt text-yellow-400"></i> AdminPanel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Platform Management</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white font-medium shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
            Exit Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-gray-700">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h2 className="text-lg font-bold text-gray-800">{tabs.find(t => t.id === activeTab)?.name || 'Admin Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <i className="fa-solid fa-bell text-gray-400 text-xl hover:text-blue-600 cursor-pointer transition"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeTab === 'Home' && <HomeTab />}
          {activeTab === 'Users' && <UsersTab />}
          {activeTab === 'Exams' && <ExamRoutineTab />}
          {activeTab === 'Subjects' && <SubjectTab />}
          {activeTab === 'Moderation' && <ModerationTab />}
          {activeTab === 'Resources' && <ResourcesTab />}
          {activeTab === 'Events' && <EventsTab />}
          {activeTab === 'Settings' && <SettingsTab />}
          {activeTab === 'Reports' && <ReportsTab />}
          {activeTab === 'Activity' && <ActivityTab />}
        </main>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// TAB COMPONENTS
// ------------------------------------------------------------------

function HomeTab() {
  const lineData = [
    { name: 'Jan', signups: 120 }, { name: 'Feb', signups: 210 },
    { name: 'Mar', signups: 180 }, { name: 'Apr', signups: 290 },
    { name: 'May', signups: 350 }, { name: 'Jun', signups: 420 },
  ];
  
  const barData = [
    { name: 'CSE', active: 450 }, { name: 'BBA', active: 320 },
    { name: 'EEE', active: 280 }, { name: 'English', active: 150 },
    { name: 'MSJ', active: 200 }
  ];

  const pieData = [
    { name: 'Notes', value: 400 },
    { name: 'PDFs', value: 300 },
    { name: 'Posts', value: 300 },
    { name: 'Events', value: 100 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { title: 'Total Users', value: '2,845', icon: 'fa-users', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Today', value: '432', icon: 'fa-user-check', color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Subjects', value: '145', icon: 'fa-book', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Notes Created', value: '8,210', icon: 'fa-file-lines', color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'PDFs Uploaded', value: '3,420', icon: 'fa-file-pdf', color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Discussions', value: '1,245', icon: 'fa-comments', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} text-xl shrink-0`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">User Signups Over Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Most Active Subjects</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="active" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Content Uploads by Type</h3>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const users = [
    { id: 1, name: 'Alice Rahman', email: 'alice@ulab.edu.bd', dept: 'CSE', role: 'Student', status: 'Active', joined: '2025-01-12' },
    { id: 2, name: 'Dr. Hasan Tariq', email: 'hasan.tariq@ulab.edu.bd', dept: 'CSE', role: 'Teacher', status: 'Active', joined: '2024-08-22' },
    { id: 3, name: 'Bob Smith', email: 'bob@ulab.edu.bd', dept: 'BBA', role: 'Student', status: 'Suspended', joined: '2025-02-05' },
    { id: 4, name: 'Carol Islam', email: 'carol@ulab.edu.bd', dept: 'English', role: 'Student', status: 'Active', joined: '2025-03-10' },
    { id: 5, name: 'David Admin', email: 'admin@ulab.edu.bd', dept: 'Admin', role: 'Admin', status: 'Active', joined: '2023-01-01' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-120px)]">
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <i className="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
          <input type="text" placeholder="Search users by name or email..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <i className="fa-solid fa-file-import"></i> Bulk Import
          </button>
          <button className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <i className="fa-solid fa-user-plus"></i> Add User
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 border-b border-gray-200 font-semibold">User</th>
              <th className="p-4 border-b border-gray-200 font-semibold">Department</th>
              <th className="p-4 border-b border-gray-200 font-semibold">Role</th>
              <th className="p-4 border-b border-gray-200 font-semibold">Status</th>
              <th className="p-4 border-b border-gray-200 font-semibold">Joined</th>
              <th className="p-4 border-b border-gray-200 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-800">{u.name}</div>
                  <div className="text-gray-500 text-xs">{u.email}</div>
                </td>
                <td className="p-4 text-gray-600">{u.dept}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'Teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1.5 ${u.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{u.joined}</td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 p-1.5 mx-1" title="Edit"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button className="text-amber-600 hover:text-amber-800 p-1.5 mx-1" title="Reset Password"><i className="fa-solid fa-key"></i></button>
                  <button className="text-red-600 hover:text-red-800 p-1.5 mx-1" title="Delete"><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <div>Showing 1 to 5 of 2,845 entries</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-gray-300 rounded bg-blue-50 text-blue-600">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}

function ExamRoutineTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Exam Routines</h3>
          <p className="text-sm text-gray-500">Manage midterm and final schedules globally.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <i className="fa-solid fa-upload"></i> Upload CSV/Excel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> Add Entry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center py-16">
        <div className="text-gray-300 mb-4"><i className="fa-solid fa-calendar-days text-6xl"></i></div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Central Routine Database</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">You can upload the official university exam schedule spreadsheet here to automatically sync it with all student dashboards.</p>
        <button className="bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-100 transition">
          <i className="fa-solid fa-download mr-2"></i> Download Template Format
        </button>
      </div>
    </div>
  );
}

function SubjectTab() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-125">
       <h3 className="font-bold text-gray-800 text-lg mb-4">Subject Management</h3>
       <p className="text-sm text-gray-500 mb-6">Add, edit or delete courses, assign teachers, and link them to respective departments and semesters.</p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="border border-gray-200 rounded-lg p-5">
           <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Add New Subject</h4>
           <div className="space-y-3 text-sm">
             <div>
               <label className="block text-gray-600 mb-1">Subject Code</label>
               <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. CSE101" />
             </div>
             <div>
               <label className="block text-gray-600 mb-1">Subject Name</label>
               <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Intro to Computer Science" />
             </div>
             <div>
               <label className="block text-gray-600 mb-1">Department</label>
               <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500">
                 <option>Computer Science</option>
                 <option>BBA</option>
               </select>
             </div>
             <button className="w-full bg-blue-600 text-white rounded p-2 mt-2 font-medium hover:bg-blue-700 transition">Save Subject</button>
           </div>
         </div>
         <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <i className="fa-solid fa-list-check text-4xl mb-3"></i>
              <p>Select a subject from list to edit assignments</p>
            </div>
         </div>
       </div>
    </div>
  );
}

function ModerationTab() {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-gray-800 text-lg">Content Moderation Queue</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
          <div className="text-red-500 text-sm font-bold uppercase tracking-wider mb-1">Reported Posts</div>
          <div className="text-3xl font-bold text-red-700">12</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <div className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-1">Flagged Comments</div>
          <div className="text-3xl font-bold text-amber-700">28</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <div className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">Pending Approval</div>
          <div className="text-3xl font-bold text-blue-700">5</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h4 className="font-semibold text-gray-700">Needs Review</h4>
        </div>
        <div className="p-4 divide-y divide-gray-100">
          {[1,2,3].map(i => (
            <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-4 justify-between">
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Hate Speech</span>
                  <span className="text-sm font-semibold text-gray-800">Post #{8000+i} by user@ulab.edu.bd</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mt-2">&quot;This course is completely useless and the teacher is a total absolute...&quot;</p>
              </div>
              <div className="flex gap-2 items-start shrink-0">
                <button className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded text-sm hover:bg-red-100 transition"><i className="fa-solid fa-trash mr-1"></i> Delete</button>
                <button className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition"><i className="fa-solid fa-eye-slash mr-1"></i> Hide</button>
                <button className="bg-white text-green-600 border border-green-200 px-3 py-1.5 rounded text-sm hover:bg-green-50 transition"><i className="fa-solid fa-check mr-1"></i> Ignore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-125">
       <h3 className="font-bold text-gray-800 text-lg mb-4">Resources Approval</h3>
       <p className="text-sm text-gray-500 mb-6">Verify authenticity of shared PDFs, question papers, and public notes before making them available globally.</p>
       
       <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <i className="fa-solid fa-circle-check text-5xl text-gray-300 mb-4"></i>
          <h4 className="text-lg font-medium text-gray-600">All caught up!</h4>
          <p className="text-sm text-gray-400 mt-1">There are no pending resources waiting for approval.</p>
       </div>
    </div>
  );
}

function EventsTab() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-125">
       <div className="flex justify-between items-center mb-6">
         <div>
          <h3 className="font-bold text-gray-800 text-lg">Event Management</h3>
          <p className="text-sm text-gray-500">Create, feature or approve campus events.</p>
         </div>
         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Create Event</button>
       </div>

       <div className="border border-gray-100 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer mb-3">
         <div className="flex gap-4 items-center">
           <div className="bg-blue-100 text-blue-800 rounded-lg p-2 text-center w-16">
             <div className="text-xs font-bold uppercase">APR</div>
             <div className="text-xl font-bold leading-none">15</div>
           </div>
           <div>
             <h4 className="font-bold text-gray-800">Tech Fest 2026</h4>
             <p className="text-sm text-gray-500">Computer Science Dept • 09:00 AM</p>
           </div>
         </div>
         <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">Featured</span>
       </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-3xl space-y-6">
      <h3 className="font-bold text-gray-800 text-xl">System Settings</h3>
      
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-700 border-b pb-2">General</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Site Name</label>
            <input type="text" className="w-full border border-gray-300 rounded p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500" defaultValue="ULAB ScholarSpace" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Support Email</label>
            <input type="email" className="w-full border border-gray-300 rounded p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500" defaultValue="support@ulab.edu.bd" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-700 border-b pb-2">Feature Toggles</h4>
        <div className="space-y-3">
          {[
            { label: 'Public Registration', desc: 'Allow new users to sign up automatically', active: true },
            { label: 'AI Study Scheduler', desc: 'Enable the experimental AI generator', active: true },
            { label: 'Community Forums', desc: 'Enable global discussion boards', active: true },
            { label: 'Maintenance Mode', desc: 'Lock the platform for users', active: false },
          ].map((toggle, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <div className="font-medium text-gray-800 text-sm">{toggle.label}</div>
                <div className="text-xs text-gray-500">{toggle.desc}</div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${toggle.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${toggle.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-700 border-b pb-2">Data Management</h4>
        <p className="text-sm text-gray-500 mb-2">Export all system configuration and user states (localStorage backup).</p>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition flex items-center gap-2">
          <i className="fa-solid fa-download"></i> Generate Backup File
        </button>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-125 flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-chart-line text-5xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-bold text-gray-600 mb-2">Advanced Analytics</h3>
        <p className="text-gray-400 max-w-sm mx-auto">Full reporting capabilities, exam performance analytics, and exportable PDF reports will be available soon.</p>
      </div>
    </div>
  )
}

function ActivityTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-800">System Activity Log</h3>
        <p className="text-xs text-gray-500 mt-1">Tracking all major administrative actions.</p>
      </div>
      <div className="p-0">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { time: 'Today, 10:45 AM', user: 'admin@ulab.edu.bd', action: 'Approved Resource', target: 'CSE301 Final question Bank.pdf' },
              { time: 'Today, 09:12 AM', user: 'admin@ulab.edu.bd', action: 'Modified Setting', target: 'Feature Toggles -> Enabled AI' },
              { time: 'Yesterday, 04:30 PM', user: 'admin@ulab.edu.bd', action: 'Deleted User', target: 'ID: 4920' },
              { time: 'Yesterday, 11:20 AM', user: 'admin@ulab.edu.bd', action: 'Uploaded Exam Routine', target: 'Spring 2026 Finals.csv' },
              { time: 'Mar 24, 02:15 PM', user: 'admin@ulab.edu.bd', action: 'System Backup', target: 'Manual Export Triggered' },
            ].map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500 font-mono text-xs">{log.time}</td>
                <td className="p-4 font-medium text-gray-700">{log.user}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{log.action}</span></td>
                <td className="p-4 text-gray-600">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
