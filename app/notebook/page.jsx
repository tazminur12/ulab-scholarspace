"use client";

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function DigitalNotebook() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Favorites', 'Trash', or specific subject
  const [viewMode, setViewMode] = useState('grid');
  const [isSaving, setIsSaving] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // active note state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isMarkdown, setIsMarkdown] = useState(true); // Default to markdown for simpler implementation
  const [subject, setSubject] = useState('General');
  const [privacy, setPrivacy] = useState('Private');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const subjects = ['General', 'CSE', 'BBA', 'EEE', 'English'];

  // Load from localStorage
  useEffect(() => {
    let mTimer = setTimeout(() => {
      setMounted(true);
      const savedNotes = localStorage.getItem('ulab_notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }, 0);
    return () => clearTimeout(mTimer);
  }, []);

  const saveNote = (manual = false) => {
    if (!activeNoteId) return;
    setIsSaving(true);
    
    setNotes(prev => {
      const updatedNotes = prev.map(note => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            title,
            content,
            isMarkdown,
            subject,
            privacy,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            updatedAt: new Date().toISOString(),
            isFavorite
          };
        }
        return note;
      });
      localStorage.setItem('ulab_notes', JSON.stringify(updatedNotes));
      return updatedNotes;
    });

    setTimeout(() => setIsSaving(false), 1000);
    if (manual) alert('Note saved manually!');
  };

  // Auto-save logic
  useEffect(() => {
    if (!mounted || !activeNoteId) return;

    const timer = setTimeout(() => {
      saveNote();
    }, 2000); // 2 second debounce for auto-save

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, subject, privacy, tags, isFavorite, isMarkdown, activeNoteId, mounted]);

  const createNote = () => {
    const newNote = {
      id: window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      title: 'Untitled Note',
      content: '',
      isMarkdown: true,
      subject: 'General',
      privacy: 'Private',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      inTrash: false
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('ulab_notes', JSON.stringify(updatedNotes));
    openNote(newNote);
  };

  const openNote = (note) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsMarkdown(note.isMarkdown !== false);
    setSubject(note.subject || 'General');
    setPrivacy(note.privacy || 'Private');
    setTags((note.tags || []).join(', '));
    setIsFavorite(note.isFavorite || false);
  };

  const closeNote = () => {
    setActiveNoteId(null);
  };

  const deleteNote = (id) => {
    const confirmDelete = confirm('Move to trash?');
    if (!confirmDelete) return;

    const updatedNotes = notes.map(n => n.id === id ? { ...n, inTrash: true } : n);
    setNotes(updatedNotes);
    localStorage.setItem('ulab_notes', JSON.stringify(updatedNotes));
    if (activeNoteId === id) closeNote();
  };

  const permanentDelete = (id) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('ulab_notes', JSON.stringify(updatedNotes));
  };

  const duplicateNote = () => {
    if (!activeNoteId) return;
    const currentNote = notes.find(n => n.id === activeNoteId);
    if (!currentNote) return;

    const newNote = {
      ...currentNote,
      id: window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      title: `${currentNote.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('ulab_notes', JSON.stringify(updatedNotes));
    openNote(newNote);
  };

  const exportNote = () => {
    const blob = new Blob([`# ${title}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('note-editor-txt');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);
    
    const newText = before + prefix + selected + suffix + after;
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleYoutubeEmbed = () => {
    if (!youtubeUrl) return;
    // Extract video ID
    let videoId = '';
    try {
      if (youtubeUrl.includes('youtu.be/')) videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
      else if (youtubeUrl.includes('v=')) videoId = youtubeUrl.split('v=')[1].split('&')[0];
    } catch { console.error('Invalid URL'); }

    if (videoId) {
      const embedCode = `\n\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\n`;
      insertMarkdown(embedCode);
    }
    setShowYoutubeModal(false);
    setYoutubeUrl('');
  };

  // Filter logic
  const filteredNotes = notes
    .filter(n => {
      if (activeFilter === 'Trash') return n.inTrash;
      if (n.inTrash) return false;
      if (activeFilter === 'Favorites') return n.isFavorite;
      if (activeFilter !== 'All' && n.subject !== activeFilter) return false;
      return true;
    })
    .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()));

  const recentNotes = [...notes].filter(n => !n.inTrash).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (!mounted) return null;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 border-t border-gray-200 overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 flex-col h-full overflow-y-auto hidden md:flex">
        <div className="p-4">
          <button 
            onClick={createNote}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> New Note
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
            <input 
              type="text"
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Menu Items */}
          <div className="px-2 space-y-1">
            <button onClick={() => { setActiveFilter('All'); closeNote(); }} className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 ${activeFilter === 'All' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <i className="fa-solid fa-book w-4 text-center"></i> All Notes
            </button>
            <button onClick={() => { setActiveFilter('Favorites'); closeNote(); }} className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 ${activeFilter === 'Favorites' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <i className="fa-solid fa-star w-4 text-center"></i> Favorites
            </button>
          </div>

          {/* Subjects */}
          <div className="mt-6 px-4 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subjects</h3>
            <div className="space-y-1 ml-2">
              {subjects.map(sub => (
                <button 
                  key={sub}
                  onClick={() => { setActiveFilter(sub); closeNote(); }}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center gap-2 ${activeFilter === sub ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <i className="fa-regular fa-folder w-4 text-center"></i> {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="mt-6 px-4 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent</h3>
            <div className="space-y-1 ml-2">
              {recentNotes.map(rn => (
                <button 
                  key={rn.id}
                  onClick={() => openNote(rn)}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs text-gray-600 hover:bg-gray-100 truncate flex items-center gap-2"
                >
                  <i className="fa-regular fa-file-lines w-3 text-center"></i> {rn.title || 'Untitled'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button onClick={() => { setActiveFilter('Trash'); closeNote(); }} className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 ${activeFilter === 'Trash' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <i className="fa-solid fa-trash w-4 text-center"></i> Trash
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        
        {!activeNoteId ? (
          /* LIST VIEW */
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{activeFilter} Notes</h1>
              <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <i className="fa-solid fa-grid-2"></i>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-300 mb-4"><i className="fa-solid fa-book-open text-6xl"></i></div>
                <h3 className="text-lg font-medium text-gray-600">No notes found</h3>
                <p className="text-gray-400 mt-1">Create a new note to get started.</p>
                <button onClick={createNote} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Create Note</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
                {filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => !note.inTrash ? openNote(note) : null}
                    className={`bg-white border text-left p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col ${note.inTrash ? 'opacity-70 border-red-200' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 line-clamp-1">{note.title || 'Untitled Note'}</h3>
                      {note.isFavorite && <i className="fa-solid fa-star text-yellow-400 text-xs"></i>}
                      {note.privacy === 'Shared' && <i className="fa-solid fa-users text-blue-400 text-xs"></i>}
                    </div>
                    <p className={`text-sm text-gray-500 line-clamp-3 mb-4 flex-1 ${viewMode === 'list' && 'line-clamp-1'}`}>
                      {note.content ? note.content.replace(/[#*`_]/g, '').substring(0, 100) : 'No content'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-500">{note.subject}</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {note.inTrash && activeFilter === 'Trash' && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setNotes(notes.map(n => n.id === note.id ? {...n, inTrash: false} : n)); }} className="flex-1 bg-green-50 text-green-600 py-1.5 rounded text-xs font-medium hover:bg-green-100">Restore</button>
                        <button onClick={(e) => { e.stopPropagation(); permanentDelete(note.id); }} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-medium hover:bg-red-100">Delete Permanently</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* EDITOR VIEW */
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Text Area */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Toolbar */}
              <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-1 overflow-x-auto bg-gray-50 shrink-0">
                <button onClick={closeNote} className="mr-4 text-gray-500 hover:text-gray-800 p-1"><i className="fa-solid fa-arrow-left"></i></button>
                
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => insertMarkdown('**', '**')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Bold"><i className="fa-solid fa-bold"></i></button>
                  <button onClick={() => insertMarkdown('*', '*')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Italic"><i className="fa-solid fa-italic"></i></button>
                  <button onClick={() => insertMarkdown('# ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Heading 1"><i className="fa-solid fa-h1"></i></button>
                  <button onClick={() => insertMarkdown('## ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Heading 2"><i className="fa-solid fa-h2"></i></button>
                </div>
                
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => insertMarkdown('- ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Bullet List"><i className="fa-solid fa-list-ul"></i></button>
                  <button onClick={() => insertMarkdown('1. ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Numbered List"><i className="fa-solid fa-list-ol"></i></button>
                  <button onClick={() => insertMarkdown('- [ ] ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Task List"><i className="fa-solid fa-check-square"></i></button>
                </div>

                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => insertMarkdown('```\n', '\n```')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Code Block"><i className="fa-solid fa-code"></i></button>
                  <button onClick={() => insertMarkdown('> ', '')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Quote"><i className="fa-solid fa-quote-right"></i></button>
                  <button onClick={() => insertMarkdown('[', '](url)')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700" title="Link"><i className="fa-solid fa-link"></i></button>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => setShowYoutubeModal(true)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-100 text-red-600" title="Embed YouTube Video"><i className="fa-brands fa-youtube"></i></button>
                </div>
                
                <div className="ml-auto flex items-center gap-3">
                  {isSaving && <span className="text-xs text-gray-400 flex items-center gap-1"><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</span>}
                  
                  <div className="bg-gray-200 p-0.5 rounded-lg flex text-xs font-medium">
                    <button onClick={() => setIsMarkdown(true)} className={`px-3 py-1 rounded-md ${isMarkdown ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>Edit</button>
                    <button onClick={() => setIsMarkdown(false)} className={`px-3 py-1 rounded-md ${!isMarkdown ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>Preview</button>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="px-8 pt-6 pb-2">
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full text-4xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 p-0 m-0 bg-transparent"
                />
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 relative">
                {isMarkdown ? (
                  <textarea 
                    id="note-editor-txt"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your note here... (Markdown supported)"
                    className="w-full h-full min-h-125 resize-none border-none focus:ring-0 p-0 m-0 text-gray-700 leading-relaxed bg-transparent font-mono text-sm mt-4"
                  ></textarea>
                ) : (
                  <div className="prose prose-blue max-w-none mt-4 min-h-125">
                    {/* Very basic raw preview implementation. In prod, use react-markdown or similar */}
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/# (.*)/g, '<h1>$1</h1>').replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')) }} />
                    ) : (
                      <p className="text-gray-400 italic">Nothing to preview.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="h-8 border-t border-gray-200 bg-gray-50 flex justify-between items-center px-4 text-xs text-gray-500 shrink-0">
                <div className="flex gap-4">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                </div>
                <div>Last saved: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Right Properties Panel */}
            <div className="w-72 bg-gray-50 border-l border-gray-200 p-5 overflow-y-auto flex-col shrink-0 hidden lg:flex">
              <h3 className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wider">Properties</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject Folder</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Privacy</label>
                  <select 
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Private">Private</option>
                    <option value="Shared">Shared with Classmates</option>
                    <option value="Public">Public (Anyone with link)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. exams, urgent, react"
                    className="w-full bg-white border border-gray-300 rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.split(',').map((t, i) => t.trim() ? (
                      <span key={i} className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{t.trim()}</span>
                    ) : null)}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                    <span className="font-semibold text-xs">Favorite</span>
                    <button onClick={() => setIsFavorite(!isFavorite)} className={`text-lg ${isFavorite ? 'text-yellow-400' : 'text-gray-300'}`}>
                      <i className={`fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <button onClick={() => saveNote(true)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <i className="fa-solid fa-save"></i> Save Note
                </button>
                <div className="flex gap-2">
                  <button onClick={duplicateNote} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <i className="fa-solid fa-copy"></i> Duplicate
                  </button>
                  <button onClick={exportNote} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <i className="fa-solid fa-download"></i> Export
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
                  }} 
                  className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-share-nodes"></i> Share Note
                </button>
                <button onClick={() => deleteNote(activeNoteId)} className="w-full py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition mt-4 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-trash"></i> Move to Trash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* YouTube Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-brands fa-youtube text-red-600"></i> Embed YouTube Video
              </h3>
              <button onClick={() => setShowYoutubeModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
              <input 
                type="text" 
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowYoutubeModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleYoutubeEmbed} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Embed Video</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}