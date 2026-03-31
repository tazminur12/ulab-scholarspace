"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyGroupsPage() {
  const router = useRouter();
  const [view, setView] = useState('list'); // 'list', 'create', 'details'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // For details view
  
  // Mock Data
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Algorithms Mastery",
      subject: "Computer Science",
      currentMembers: 3,
      maxMembers: 5,
      schedule: "Mon/Wed 3 PM",
      type: "Hybrid",
      availability: "Afternoon",
      location: "Library Rm 204 / Zoom",
      description: "Preparing for the final exam. Focusing on graph algorithms and dynamic programming.",
      matchPercentage: 95,
      requirements: "Must have completed Intro to CS",
      members: ["Alice", "Bob", "Charlie"],
      sessions: [{ id: 1, date: "Oct 15, 3:00 PM", topic: "Dijkstra's Algorithm", location: "Zoom", rsvp: 3 }],
      messages: [{ sender: "Alice", text: "Hey! Let's focus on graphs tomorrow.", time: "10:00 AM" }]
    },
    {
      id: 2,
      name: "Calculus III Study Group",
      subject: "Mathematics",
      currentMembers: 4,
      maxMembers: 6,
      schedule: "Tue/Thu 5 PM",
      type: "In-person",
      availability: "Evening",
      location: "Math Building Rm 101",
      description: "Working through vector calculus and line integrals.",
      matchPercentage: 80,
      requirements: "None",
      members: ["David", "Eve", "Frank", "Grace"],
      sessions: [],
      messages: []
    },
    {
      id: 3,
      name: "Physics 101 Beginners",
      subject: "Physics",
      currentMembers: 2,
      maxMembers: 4,
      schedule: "Weekends 10 AM",
      type: "Online",
      availability: "Morning",
      location: "Discord",
      description: "Reviewing basic mechanics and kinematics.",
      matchPercentage: 60,
      requirements: "Beginner friendly",
      members: ["Heidi", "Ivan"],
      sessions: [],
      messages: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    type: '',
    availability: '',
    aiMatch: false
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGroup = {
      id: Date.now(),
      name: formData.get('name'),
      subject: formData.get('subject'),
      currentMembers: 1,
      maxMembers: parseInt(formData.get('maxMembers')),
      schedule: formData.get('schedule'),
      type: formData.get('type'),
      location: formData.get('location'),
      description: formData.get('description'),
      requirements: formData.get('requirements'),
      matchPercentage: 100,
      members: ["You"],
      sessions: [],
      messages: []
    };
    setGroups([...groups, newGroup]);
    setView('list');
  };

  const filteredGroups = groups.filter(g => {
    if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase()) && !g.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.subject && g.subject !== filters.subject) return false;
    if (filters.type && g.type !== filters.type) return false;
    if (filters.availability && g.availability !== filters.availability) return false;
    return true;
  }).sort((a, b) => filters.aiMatch ? b.matchPercentage - a.matchPercentage : 0);

  const renderContent = () => {
    if (view === 'create') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Study Group</h2>
            <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          <form onSubmit={handleCreateGroup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Advanced AI Study" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select name="subject" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select subject</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                <input type="number" name="maxMembers" required min="2" max="10" defaultValue="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Frequency/Schedule</label>
                <input name="schedule" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Wed/Fri 6 PM" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                <select name="type" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Platform Link</label>
                <input name="location" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Zoom link or Library Room" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description & Goals</label>
              <textarea name="description" required rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="What are the main goals of this group?"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <input name="requirements" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Must have completed Math 101" />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Create Group
            </button>
          </form>
        </div>
      );
    }

    if (view === 'details' && selectedGroup) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden min-h-150">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white">
            <div className="flex justify-between items-start mb-4">
              <button 
                onClick={() => setView('list')}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Groups
              </button>
              <button className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                Leave Group
              </button>
            </div>
            <h1 className="text-3xl font-bold mb-2">{selectedGroup.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium bg-blue-800/40 p-3 rounded-lg w-max">
              <span className="flex items-center gap-2"><i className="fa-solid fa-book text-blue-300"></i> {selectedGroup.subject}</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-clock text-blue-300"></i> {selectedGroup.schedule}</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-users text-blue-300"></i> {selectedGroup.currentMembers}/{selectedGroup.maxMembers} Members</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-location-dot text-blue-300"></i> {selectedGroup.type}</span>
            </div>
            <p className="mt-4 text-blue-100 max-w-2xl">{selectedGroup.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-gray-200">
            {['chat', 'sessions', 'members', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 bg-gray-50 flex-1 overflow-y-auto">
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 mb-4 min-h-75 overflow-y-auto space-y-4">
                  {selectedGroup.messages.length > 0 ? selectedGroup.messages.map((m, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">{m.sender} • {m.time}</span>
                      <div className="bg-gray-100 p-3 rounded-lg w-max max-w-[80%] text-sm text-gray-800">{m.text}</div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Type a message..." />
                  <button className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition">Send</button>
                </div>
              </div>
            )}
            
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Upcoming Study Sessions</h3>
                  <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100">Schedule Session</button>
                </div>
                {selectedGroup.sessions.map(s => (
                  <div key={s.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{s.topic}</h4>
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                        <span><i className="fa-regular fa-calendar mr-1"></i>{s.date}</span>
                        <span><i className="fa-solid fa-location-dot mr-1"></i>{s.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-green-600">{s.rsvp} Attending</span>
                      <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">RSVP</button>
                    </div>
                  </div>
                ))}
                {selectedGroup.sessions.length === 0 && <p className="text-gray-500 text-center">No upcoming sessions. Schedule one!</p>}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedGroup.members.map((m, i) => (
                  <div key={i} className="bg-white p-4 border border-gray-200 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                      {m.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{m}</div>
                      <div className="text-xs text-gray-500">Member</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-4">Group Performance Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-blue-500 font-medium text-sm mb-1">Total Sessions Meeting</div>
                    <div className="text-2xl font-bold text-blue-700">{selectedGroup.sessions.length + 3}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-green-500 font-medium text-sm mb-1">Average Attendance</div>
                    <div className="text-2xl font-bold text-green-700">85%</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="text-purple-500 font-medium text-sm mb-1">Goals Completed</div>
                    <div className="text-2xl font-bold text-purple-700">12</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default List View
    return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-fit">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-robot text-purple-500"></i> Smart Matching
            </h3>
            <button 
              onClick={() => setFilters({...filters, aiMatch: !filters.aiMatch})}
              className={`w-full py-2 px-4 rounded-lg transition-colors font-medium text-sm border ${filters.aiMatch ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {filters.aiMatch ? 'Clear AI Matches' : 'Find Best Matches'}
            </button>
            {filters.aiMatch && (
              <p className="text-xs text-purple-600 mt-2 text-center">Sorting by your major, study habits & schedule.</p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Subject</h3>
              <div className="space-y-2">
                {['Computer Science', 'Mathematics', 'Physics', 'Engineering'].map(sub => (
                  <label key={sub} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="radio" name="subject_filter" checked={filters.subject === sub} onChange={() => setFilters({...filters, subject: sub})} className="text-blue-600 focus:ring-blue-500" />
                    {sub}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="subject_filter" checked={filters.subject === ''} onChange={() => setFilters({...filters, subject: ''})} className="text-blue-600 focus:ring-blue-500" />
                  All Subjects
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Meeting Type</h3>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full border-gray-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Type</option>
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Availability</h3>
              <select 
                value={filters.availability} 
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="w-full border-gray-300 rounded-md text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search groups by name or subject..." 
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
            {filteredGroups.map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                  {filters.aiMatch && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <i className="fa-solid fa-bolt"></i> {group.matchPercentage}% Match
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-blue-600 mb-3">{group.subject}</div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                
                <div className="mt-auto space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><i className="fa-solid fa-users w-4"></i> {group.currentMembers}/{group.maxMembers} Members</div>
                  <div className="flex items-center gap-2"><i className="fa-regular fa-clock w-4"></i> {group.schedule}</div>
                  <div className="flex items-center gap-2"><i className="fa-solid fa-location-dot w-4"></i> {group.type} - {group.location}</div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => {
                      setSelectedGroup(group);
                      setView('details');
                    }}
                    className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium py-2 rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    disabled={group.currentMembers >= group.maxMembers}
                    className={`flex-1 font-medium py-2 rounded-lg transition-colors text-sm ${group.currentMembers >= group.maxMembers ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {group.currentMembers >= group.maxMembers ? 'Full' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredGroups.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <i className="fa-solid fa-users-slash text-4xl text-gray-300 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-900">No study groups found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new group.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-900 mr-2">
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-people-group"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Study Groups</h1>
              <p className="text-sm text-gray-500">Find partners & collaborate effectively</p>
            </div>
          </div>
          {view === 'list' && (
            <button 
              onClick={() => setView('create')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <i className="fa-solid fa-plus"></i> Create New Group
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}