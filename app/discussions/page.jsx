"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AcademicDiscussions() {
  const [mounted, setMounted] = useState(false);
  
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [activeSubject, setActiveSubject] = useState('All');
  
  const [activeTab, setActiveTab] = useState('All Posts'); // All Posts, Questions, Discussions, Polls
  const [sortBy, setSortBy] = useState('Recent'); // Recent, Popular, Unanswered

  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'post'
  const [activePostId, setActivePostId] = useState(null);

  // States for new post/answer
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('Discussion');
  const [newPostSubject, setNewPostSubject] = useState('');
  
  const [newAnswerContent, setNewAnswerContent] = useState('');

  // Notifications simulate
  const [hasNewPosts, setHasNewPosts] = useState(false);

  // Mock taxonomy
  const departments = [
    {
      name: 'Computer Science',
      subjects: ['Data Structures', 'Operating Systems', 'Algorithms', 'Database Management', 'Software Engineering']
    },
    {
      name: 'Business',
      subjects: ['Accounting', 'Marketing Management', 'Business Ethics', 'Finance']
    },
    {
      name: 'Engineering',
      subjects: ['Physics', 'Calculus II', 'Electrical Circuits', 'Mechanics']
    }
  ];

  // Mock User
  const currentUser = {
    name: 'Sarah Student',
    avatar: 'S',
    level: 5,
    points: 1240,
    role: 'student'
  };

  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'Alex Johnson', points: 3450, badge: 'Scholar' },
    { id: 2, name: 'David Lee', points: 2800, badge: 'Expert' },
    { id: 3, name: 'Maria Garcia', points: 2100, badge: 'Contributor' },
    { id: 4, name: 'Sarah Student', points: 1240, badge: 'Learner' },
  ]);

  useEffect(() => {
    let t = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem('ulab_discussions');
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        const initial = [
          {
            id: 101,
            author: { name: 'Alex Johnson', avatar: 'A' },
            type: 'Question',
            subject: 'Data Structures',
            title: 'Help visualizing a Red-Black Tree rotation',
            content: 'I am struggling to understand the left rotation cases when inserting a new node into a Red-Black Tree. Can someone explain it or provide a good diagram?',
            likes: 14,
            views: 128,
            time: '2 hours ago',
            tags: ['Trees', 'Algorithms', 'Help'],
            answers: [
              { id: 1, author: { name: 'Dr. Smith', avatar: 'DS', role: 'teacher' }, content: 'Think of the rotation locally. If node X is the right child of Y, a left rotation on Y makes X the new parent...', likes: 25, isBest: true, time: '1 hour ago' }
            ],
            pinned: true
          },
          {
            id: 102,
            author: { name: 'David Lee', avatar: 'D' },
            type: 'Discussion',
            subject: 'Software Engineering',
            title: 'Agile vs Waterfall for our final year project?',
            content: 'Our group is trying to decide on the SDLC for our project. Half of us want Agile for flexibility, the other half want Waterfall to lock in requirements. Thoughts?',
            likes: 32,
            views: 450,
            time: '1 day ago',
            tags: ['SDLC', 'Project'],
            answers: [
              { id: 2, author: { name: 'Maria Garcia', avatar: 'M' }, content: 'Definitely Agile. Requirements ALWAYS change when you actually start coding.', likes: 12, isBest: false, time: '20 hours ago' }
            ],
            pinned: false
          },
          {
            id: 103,
            author: { name: 'Sam K.', avatar: 'SK' },
            type: 'Poll',
            subject: 'General',
            title: 'When do you prefer to study?',
            content: 'Just curious about everyone\'s study habits here!',
            pollOptions: [
              { id: 1, text: 'Morning (6 AM - 12 PM)', votes: 45 },
              { id: 2, text: 'Afternoon (12 PM - 6 PM)', votes: 20 },
              { id: 3, text: 'Night (6 PM - 12 AM)', votes: 85 },
              { id: 4, text: 'Midnight Owl (12 AM+)', votes: 110 }
            ],
            likes: 56,
            views: 890,
            time: '2 days ago',
            tags: ['Poll', 'Habits'],
            answers: [],
            pinned: false
          }
        ];
        setPosts(initial);
        localStorage.setItem('ulab_discussions', JSON.stringify(initial));
      }

      // Simulate a new post arriving after 10s
      setTimeout(() => setHasNewPosts(true), 15000);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('ulab_discussions', JSON.stringify(newPosts));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: { name: currentUser.name, avatar: currentUser.avatar },
      type: newPostType,
      subject: newPostSubject || 'General',
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      views: 0,
      time: 'Just now',
      tags: [],
      answers: [],
      pinned: false
    };

    savePosts([newPost, ...posts]);
    setShowCreateModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostSubject('');
  };

  const handleLikePost = (postId) => {
    const updated = posts.map(p => {
      if (p.id === postId) return { ...p, likes: p.likes + 1 };
      return p;
    });
    savePosts(updated);
  };

  const handleAddAnswer = (e) => {
    e.preventDefault();
    if (!newAnswerContent.trim() || !activePostId) return;

    const updated = posts.map(p => {
      if (p.id === activePostId) {
        return {
          ...p,
          answers: [...p.answers, {
            id: Date.now(),
            author: { name: currentUser.name, avatar: currentUser.avatar },
            content: newAnswerContent,
            likes: 0,
            isBest: false,
            time: 'Just now'
          }]
        };
      }
      return p;
    });

    savePosts(updated);
    setNewAnswerContent('');
  };

  const handleMarkBestAnswer = (postId, answerId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          answers: p.answers.map(a => ({
             ...a,
             isBest: a.id === answerId ? !a.isBest : a.isBest // toggle or set
          }))
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const likeAnswer = (postId, answerId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          answers: p.answers.map(a => a.id === answerId ? { ...a, likes: a.likes + 1 } : a)
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleDeletePost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
      if (activeView === 'post') {
        setActiveView('feed');
        setActivePostId(null);
      }
    }
  };

  const loadNewPosts = () => {
    setHasNewPosts(false);
    // In a real app we'd fetch. Here we just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering
  let displayedPosts = posts;
  if (activeSubject !== 'All') {
    displayedPosts = displayedPosts.filter(p => p.subject === activeSubject);
  }
  if (activeTab !== 'All Posts') {
    if (activeTab === 'Questions') displayedPosts = displayedPosts.filter(p => p.type === 'Question');
    if (activeTab === 'Discussions') displayedPosts = displayedPosts.filter(p => p.type === 'Discussion');
    if (activeTab === 'Polls') displayedPosts = displayedPosts.filter(p => p.type === 'Poll');
  }
  if (sortBy === 'Popular') {
    displayedPosts = [...displayedPosts].sort((a,b) => b.likes - a.likes);
  } else if (sortBy === 'Unanswered') {
    displayedPosts = displayedPosts.filter(p => p.answers.length === 0);
  } else {
    // Recent / ID based (mock time)
    displayedPosts = [...displayedPosts].sort((a,b) => b.id - a.id);
  }

  const activePostData = posts.find(p => p.id === activePostId);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2 mr-4">
            <i className="fa-solid fa-graduation-cap"></i>
            ScholarSpace
          </Link>
          <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
          <h1 className="font-semibold text-gray-800 ml-2 flex items-center gap-2">
            <i className="fa-solid fa-comments text-blue-500 text-xl"></i>
            Community Discussions
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {activeView === 'post' && (
            <button 
              onClick={() => { setActiveView('feed'); setActivePostId(null); }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Feed
            </button>
          )}
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center hover:bg-blue-200 transition">
             <i className="fa-solid fa-house text-sm"></i>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Departments) */}
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-gray-100">
             <button 
               onClick={() => setShowCreateModal(true)}
               className="w-full bg-[#1e3a8a] text-white font-medium py-3 rounded-xl hover:bg-blue-800 transition shadow-sm flex justify-center items-center gap-2"
             >
               <i className="fa-solid fa-pen-to-square"></i> Create Post
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <button 
                onClick={() => setActiveSubject('All')}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-3 transition ${activeSubject === 'All' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-earth-americas w-4 text-center"></i> All Subjects
              </button>
            </div>

            {departments.map((dept, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">{dept.name}</h3>
                <div className="space-y-1">
                  {dept.subjects.map(sub => (
                    <button 
                      key={sub}
                      onClick={() => { setActiveSubject(sub); setActiveView('feed'); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${activeSubject === sub ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Central Content */}
        <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden relative">
          
          {hasNewPosts && activeView === 'feed' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
               <button onClick={loadNewPosts} className="bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 animate-bounce">
                  <i className="fa-solid fa-arrow-up"></i> New Posts Available
               </button>
            </div>
          )}

          {activeView === 'feed' ? (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full flex justify-center">
              <div className="w-full max-w-3xl space-y-6">
                
                {/* Subject Banner if activeSubject != All */}
                {activeSubject !== 'All' && (
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                     <i className="fa-solid fa-book-open absolute right-4 -bottom-6 text-8xl opacity-10"></i>
                     <h2 className="text-2xl font-bold mb-2 relative z-10">{activeSubject} Hub</h2>
                     <p className="text-blue-100 text-sm mb-4 relative z-10">Discuss theorems, share notes, and collaborate with your peers.</p>
                     <div className="flex gap-3 relative z-10">
                       <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition">
                         <i className="fa-solid fa-thumbtack mr-1"></i> Pinned Resources
                       </button>
                       <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition">
                         <i className="fa-solid fa-circle-question mr-1"></i> FAQ
                       </button>
                     </div>
                  </div>
                )}

                {/* Quick Composer */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 cursor-text" onClick={() => setShowCreateModal(true)}>
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                    {currentUser.avatar}
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Ask a question or start a discussion${activeSubject !== 'All' ? ` in ${activeSubject}` : ''}...`}
                    className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-200 transition pointer-events-none"
                    readOnly
                  />
                  <button className="text-gray-400 hover:text-blue-600 transition p-2">
                    <i className="fa-regular fa-image text-xl"></i>
                  </button>
                </div>

                {/* Feed Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100 gap-2">
                   <div className="flex gap-1 overflow-x-auto w-full sm:w-auto p-1">
                     {['All Posts', 'Questions', 'Discussions', 'Polls'].map(tab => (
                       <button 
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                         {tab}
                       </button>
                     ))}
                   </div>
                   <div className="w-full sm:w-auto px-2">
                     <select 
                       value={sortBy} 
                       onChange={(e) => setSortBy(e.target.value)}
                       className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                     >
                       <option>Recent</option>
                       <option>Popular</option>
                       <option>Unanswered</option>
                     </select>
                   </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4 pb-10">
                  {displayedPosts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-ghost text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-gray-800 font-bold mb-1">No posts found</h3>
                      <p className="text-gray-500 text-sm">Be the first to start a discussion in this view!</p>
                    </div>
                  ) : (
                    displayedPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:border-blue-300 transition group cursor-pointer" onClick={() => { setActivePostId(post.id); setActiveView('post'); }}>
                        
                        {post.pinned && (
                          <div className="text-xs font-bold text-red-600 mb-3 flex items-center gap-1 uppercase tracking-wider">
                            <i className="fa-solid fa-thumbtack"></i> Pinned by Moderator
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold overflow-hidden shrink-0">
                               {post.author.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900 text-sm">{post.author.name}</h4>
                                {post.author.role === 'teacher' && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Instructor</span>}
                              </div>
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{post.time}</span>
                                <span>•</span>
                                <span className="hover:underline">{post.subject}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${post.type === 'Question' ? 'bg-red-50 text-red-600' : post.type === 'Poll' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                              {post.type}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{post.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{post.content}</p>

                        {/* Poll Preview */}
                        {post.type === 'Poll' && post.pollOptions && (
                          <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 border border-gray-100">
                             {post.pollOptions.slice(0,2).map((opt, i) => (
                               <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 text-sm">
                                 <span>{opt.text}</span>
                                 <span className="text-gray-400 text-xs font-medium">{opt.votes} votes</span>
                               </div>
                             ))}
                             {post.pollOptions.length > 2 && <div className="text-center text-xs text-blue-600 font-medium">+{post.pollOptions.length - 2} more options... View post to vote</div>}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          <div className="flex gap-2">
                            {post.tags.map((tag, i) => (
                              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">#{tag}</span>
                            ))}
                          </div>
                          
                          <div className="flex gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-1 hover:text-red-500 transition tooltip" title="Likes">
                              <i className="fa-regular fa-heart"></i> {post.likes}
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue-500 transition tooltip" title="Answers">
                              <i className="fa-regular fa-comment"></i> {post.answers?.length || 0}
                            </div>
                            <div className="flex items-center gap-1 tooltip" title="Views">
                              <i className="fa-regular fa-eye"></i> {post.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          ) : (
            /* SINGLE POST VIEW */
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-white">
              {activePostData && (
                <div className="w-full max-w-3xl">
                   {/* Main Post Content */}
                   <div className="mb-8">
                     <div className="flex items-center gap-2 mb-4">
                       <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">{activePostData.subject}</span>
                       <span className="text-gray-400 text-sm">•</span>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${activePostData.type === 'Question' ? 'bg-red-50 text-red-600' : activePostData.type === 'Poll' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                         {activePostData.type}
                       </span>
                     </div>
                     
                     <h1 className="text-3xl font-bold text-gray-900 mb-4">{activePostData.title}</h1>
                     
                     <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg">
                            {activePostData.author.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{activePostData.author.name}</h4>
                            <p className="text-xs text-gray-500">{activePostData.time} • {activePostData.views} views</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                           <button onClick={() => handleDeletePost(activePostData.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition tooltip" title="Delete Post (Admin/Owner)">
                             <i className="fa-solid fa-trash"></i>
                           </button>
                           <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition tooltip" title="Share">
                             <i className="fa-solid fa-share-nodes"></i>
                           </button>
                        </div>
                     </div>

                     <div className="prose prose-blue max-w-none text-gray-700 text-lg leading-relaxed mb-8">
                       <p>{activePostData.content}</p>
                     </div>

                     {/* Poll Interactions if Poll */}
                     {activePostData.type === 'Poll' && activePostData.pollOptions && (
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <i className="fa-solid fa-square-poll-horizontal text-purple-500"></i> Cast your vote
                          </h4>
                          <div className="space-y-3">
                            {activePostData.pollOptions.map((opt, i) => {
                              const totalVotes = activePostData.pollOptions.reduce((acc, curr) => acc + curr.votes, 0);
                              const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                              return (
                                <button key={i} className="w-full text-left relative bg-white border border-gray-300 hover:border-purple-400 rounded-xl overflow-hidden transition group">
                                  <div className="absolute top-0 bottom-0 left-0 bg-purple-100 transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                  <div className="relative z-10 p-4 flex justify-between items-center">
                                    <span className="font-medium text-gray-800">{opt.text}</span>
                                    <span className="text-sm font-bold text-purple-700">{percent}%</span>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                          <p className="text-xs text-gray-500 mt-4 text-center">Total votes: {activePostData.pollOptions.reduce((acc, curr) => acc + curr.votes, 0)}</p>
                        </div>
                     )}

                     {/* Post Actions Footer */}
                     <div className="flex items-center gap-4">
                       <button onClick={() => handleLikePost(activePostData.id)} className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full font-medium transition flex items-center gap-2">
                         <i className="fa-regular fa-heart"></i> Like ({activePostData.likes})
                       </button>
                       <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition flex items-center gap-2">
                         <i className="fa-regular fa-bookmark"></i> Save to profile
                       </button>
                     </div>
                   </div>

                   {/* Answers Section */}
                   <div className="mt-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                     <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                       <i className="fa-regular fa-comments text-blue-500"></i> {activePostData.answers.length} Answers
                     </h3>
                     
                     <div className="space-y-6">
                       {activePostData.answers.map(ans => (
                         <div key={ans.id} className={`bg-white rounded-2xl p-5 border relative shadow-sm ${ans.isBest ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-200'}`}>
                           {ans.isBest && (
                             <div className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                               <i className="fa-solid fa-medal"></i> Best Answer
                             </div>
                           )}
                           
                           <div className="flex gap-4">
                             <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-700 shrink-0 border border-indigo-200">
                               {ans.author.avatar}
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-gray-900 text-sm">{ans.author.name}</span>
                                 {ans.author.role === 'teacher' && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Instructor</span>}
                                 <span className="text-xs text-gray-400">• {ans.time}</span>
                               </div>
                               <p className="text-gray-700 leading-relaxed text-sm mb-4">{ans.content}</p>
                               
                               <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                                 <button onClick={() => likeAnswer(activePostData.id, ans.id)} className="text-gray-500 hover:text-green-600 text-xs font-bold transition flex items-center gap-1 bg-gray-100 hover:bg-green-50 px-2 py-1 rounded">
                                   <i className="fa-solid fa-arrow-up"></i> {ans.likes} Upvotes
                                 </button>
                                 
                                 {/* Only post author or admin can mark best realistically, simulated here */}
                                 {activePostData.type === 'Question' && (
                                   <button 
                                     onClick={() => handleMarkBestAnswer(activePostData.id, ans.id)}
                                     className={`text-xs font-bold transition flex items-center gap-1 ${ans.isBest ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                                   >
                                     <i className="fa-solid fa-check"></i> {ans.isBest ? 'Unmark Best' : 'Mark as Best'}
                                   </button>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Add Answer Form */}
                     <div className="mt-8 bg-white p-5 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                       <h4 className="font-bold text-gray-800 mb-3 text-sm">Contribute to the discussion</h4>
                       <form onSubmit={handleAddAnswer}>
                         <textarea 
                           required
                           value={newAnswerContent}
                           onChange={(e) => setNewAnswerContent(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 text-sm text-gray-700"
                           placeholder="Type your answer, explanation, or ideas here..."
                         ></textarea>
                         <div className="flex justify-end mt-3">
                           <button type="submit" className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-800 transition flex items-center gap-2">
                             <i className="fa-solid fa-paper-plane"></i> Post Answer
                           </button>
                         </div>
                       </form>
                     </div>

                   </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar (Reputation / Info) */}
        <div className="w-72 bg-white border-l border-gray-200 h-full flex flex-col shrink-0 hidden lg:flex">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-14 h-14 rounded-full bg-linear-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-orange-50">
                 {currentUser.avatar}
               </div>
               <div>
                  <h3 className="font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-xs text-orange-600 font-bold tracking-wide uppercase mt-0.5">Lvl {currentUser.level} {leaderboard.find(l=>l.name===currentUser.name)?.badge || 'Learner'}</p>
               </div>
             </div>
             
             <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Reputation</p>
                  <p className="text-xl font-bold text-gray-800">{currentUser.points} <span className="text-xs text-gray-500 font-normal">RP</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <i className="fa-solid fa-arrow-trend-up text-green-500 text-lg"></i>
                </div>
             </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
             <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
               <i className="fa-solid fa-trophy text-amber-500"></i> Top Contributors
             </h3>
             <div className="space-y-4">
               {leaderboard.map((user, idx) => (
                 <div key={user.id} className="flex items-center gap-3 relative">
                   {idx === 0 && <i className="fa-solid fa-crown absolute -left-2 -top-2 text-yellow-400 -rotate-12 text-lg"></i>}
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : idx === 1 ? 'bg-gray-200 text-gray-700 border border-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-600'}`}>
                     {idx + 1}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-bold text-gray-800 leading-tight">{user.name}</p>
                     <p className="text-[10px] text-gray-500 font-medium">{user.badge} • {user.points} RP</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-10">
               <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                 <i className="fa-solid fa-shield-halved text-blue-500"></i> Code of Conduct
               </h3>
               <ul className="text-xs text-gray-600 space-y-2 mt-3 list-disc pl-4">
                 <li>Be respectful and constructive.</li>
                 <li>Check for existing answers before asking.</li>
                 <li>Cite sources if quoting papers or books.</li>
                 <li>No direct plagiarism of assignments.</li>
               </ul>
             </div>
          </div>
        </div>

      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <i className="fa-solid fa-pen text-blue-600"></i> New Post
               </h2>
               <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                 <i className="fa-solid fa-times text-xl"></i>
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
               <form id="createPostForm" onSubmit={handleCreatePost} className="space-y-5">
                 
                 <div className="flex gap-4">
                   <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Post Type</label>
                     <select 
                       value={newPostType}
                       onChange={(e) => setNewPostType(e.target.value)}
                       className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                     >
                       <option value="Discussion">Discussion</option>
                       <option value="Question">Question</option>
                       <option value="Poll">Poll</option>
                     </select>
                   </div>
                   <div className="flex-1">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                     <select 
                       value={newPostSubject}
                       onChange={(e) => setNewPostSubject(e.target.value)}
                       className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                     >
                       <option value="">General / All Subjects</option>
                       {departments.map(d => d.subjects.map(s => (
                         <option key={s} value={s}>{s}</option>
                       )))}
                     </select>
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                   <input 
                     type="text" 
                     required
                     value={newPostTitle}
                     onChange={(e) => setNewPostTitle(e.target.value)}
                     placeholder="What's on your mind?"
                     className="w-full bg-white border border-gray-300 rounded-xl p-3 font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Content details</label>
                   {/* Rich Text Editor Mock Toolbar */}
                   <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                     <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1">
                       {['bold', 'italic', 'underline', 'link', 'list-ul', 'list-ol', 'code'].map(icon => (
                         <button type="button" key={icon} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">
                           <i className={`fa-solid fa-${icon}`}></i>
                         </button>
                       ))}
                     </div>
                     <textarea 
                       required
                       value={newPostContent}
                       onChange={(e) => setNewPostContent(e.target.value)}
                       placeholder="Provide more context, format your code, or insert images..."
                       className="w-full min-h-48 p-4 border-none focus:ring-0 text-sm text-gray-700 resize-none"
                     ></textarea>
                   </div>
                 </div>

                 {newPostType === 'Poll' && (
                   <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                     <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-2"><i className="fa-solid fa-list-check"></i> Poll Options (Simulated)</label>
                     <p className="text-xs text-purple-600 mb-2">Options configuration mock block.</p>
                     <div className="space-y-2">
                       <input type="text" placeholder="Option 1" className="w-full bg-white border border-purple-200 rounded p-2 text-sm" />
                       <input type="text" placeholder="Option 2" className="w-full bg-white border border-purple-200 rounded p-2 text-sm" />
                       <button type="button" className="text-xs text-purple-700 font-bold mt-1">+ Add another option</button>
                     </div>
                   </div>
                 )}

               </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
               <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition">
                 Cancel
               </button>
               <button type="submit" form="createPostForm" className="px-8 py-2.5 bg-[#1e3a8a] text-white font-medium rounded-xl hover:bg-blue-800 transition shadow-md flex items-center gap-2">
                 Post <i className="fa-solid fa-paper-plane"></i>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Inline Setup */}
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