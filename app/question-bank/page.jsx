"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionBankPage() {
  const router = useRouter();
  const [view, setView] = useState('list'); // 'list', 'upload', 'practice'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    subject: '',
    examType: '',
    year: ''
  });

  const mockPapers = [
    {
      id: 1,
      subject: 'Data Structures',
      code: 'CSE202',
      examType: 'Midterm',
      year: 2023,
      semester: 'Spring',
      teacher: 'Dr. Alan Turing',
      downloads: 412,
      hasSolution: true,
      duration: 90 // minutes
    },
    {
      id: 2,
      subject: 'Algorithms',
      code: 'CSE203',
      examType: 'Final',
      year: 2022,
      semester: 'Fall',
      teacher: 'Prof. Ada Lovelace',
      downloads: 350,
      hasSolution: true,
      duration: 120
    },
    {
      id: 3,
      subject: 'Database Systems',
      code: 'CSE301',
      examType: 'Midterm',
      year: 2023,
      semester: 'Summer',
      teacher: 'Dr. Codd',
      downloads: 289,
      hasSolution: false,
      duration: 90
    }
  ];

  // Practice state
  const [practiceTimeLeft, setPracticeTimeLeft] = useState(0);

  const startPractice = (paper) => {
    setSelectedPaper(paper);
    setPracticeTimeLeft(paper.duration * 60);
    setShowPreviewModal(false);
    setView('practice');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert("Upload sent for moderation!");
    setView('list');
  };

  const renderUploadForm = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upload Question Paper</h2>
        <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-800">Cancel</button>
      </div>
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
        ℹ️ All uploads are reviewed by moderators before being published. Please ensure high-quality scans or PDFs.
      </div>
      <form onSubmit={handleUploadSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name or Code</label>
            <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. CSE202" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Type</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input required type="number" min="2000" max="2026" defaultValue="2023" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Semester</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Fall</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (PDF or Img)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
            <p className="text-gray-600 font-medium">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
            <input type="file" className="hidden" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name (Optional)</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Dr. John Doe" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Submit for Moderation
        </button>
      </form>
    </div>
  );

  const renderPracticeMode = () => (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 mt-6 min-h-[calc(100vh-150px)]">
      {/* Test Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center shrink-0">
          <div className="font-bold flex items-center gap-2">
            <i className="fa-solid fa-file-signature text-blue-400"></i>
            {selectedPaper?.subject} - {selectedPaper?.examType} ({selectedPaper?.year})
          </div>
          <div className="bg-gray-900 border border-gray-700 px-4 py-1.5 rounded-lg flex items-center gap-2 font-mono text-lg text-red-400">
            <i className="fa-solid fa-stopwatch"></i> {Math.floor(practiceTimeLeft / 60)}:{String(practiceTimeLeft % 60).padStart(2, '0')}
          </div>
        </div>
        
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto w-full relative flex items-center justify-center">
          {/* Mock PDF Viewer */}
          <div className="bg-white shadow-lg w-full max-w-3xl min-h-200 p-12 mx-auto disabled-selection relative">
             <div className="absolute top-4 right-4 text-xs text-gray-300 font-mono rotate-45 pointer-events-none opacity-50">SAMPLE PAPER</div>
             <div className="text-center border-b-2 border-black pb-4 mb-8">
               <h1 className="text-xl font-bold uppercase">{selectedPaper?.subject} ({selectedPaper?.code})</h1>
               <h2 className="text-lg">{selectedPaper?.examType} Examination - {selectedPaper?.semester} {selectedPaper?.year}</h2>
               <div className="flex justify-between mt-4 text-sm font-bold">
                 <span>Time: {selectedPaper?.duration} Minutes</span>
                 <span>Full Marks: 100</span>
               </div>
             </div>
             
             <div className="space-y-6">
                <div>
                   <p className="font-bold">Q1. Answer any strictly TWO of the following (2x10=20)</p>
                   <p className="ml-4 mt-2">a) Explain the time complexity of Quick Sort with recurrence relations.</p>
                   <p className="ml-4 mt-2">b) Contrast and compare BFS and DFS graph traversals.</p>
                   <p className="ml-4 mt-2">c) Write an algorithm to reverse a singly linked list in O(n) time and O(1) space.</p>
                </div>
                <div>
                   <p className="font-bold">Q2. Compulsory Problem (30)</p>
                   <p className="ml-4 mt-2">Given an undirected graph, implement Dijkstra&apos;s shortest path starting from vertex A.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Answer Sheet / Controls */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col flex-1">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-pen-clip"></i> Digital Scratchpad</h3>
          <textarea className="w-full flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-50" placeholder="Type your rough notes or final answers here..."></textarea>
          
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition">
            Finish & Submit Exam
          </button>
          
          {selectedPaper?.hasSolution && (
            <button className="w-full mt-2 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <i className="fa-solid fa-eye"></i> View Solution Key
            </button>
          )}

          <button onClick={() => setView('list')} className="w-full mt-2 text-center text-gray-500 hover:text-gray-800 text-sm font-medium py-2">
            Cancel Practice
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-900 mr-2">
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-box-archive"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Previous Question Bank</h1>
              <p className="text-sm text-gray-500">Ace your exams with past papers</p>
            </div>
          </div>
          {view === 'list' && (
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm flex items-center justify-center gap-2">
                <i className="fa-solid fa-clipboard-question"></i> Request
              </button>
              <button 
                onClick={() => setView('upload')} 
                className="flex-2 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-sm flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i> Upload Paper
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {view === 'upload' && renderUploadForm()}
        {view === 'practice' && renderPracticeMode()}

        {view === 'list' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                 <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-filter text-blue-500"></i> Filters
                 </h3>
                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Department</label>
                     <select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})} className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 p-2">
                       <option>All Departments</option>
                       <option>Computer Science</option>
                       <option>Business</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Exam Type</label>
                     <select value={filters.examType} onChange={(e) => setFilters({...filters, examType: e.target.value})} className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 p-2">
                       <option>All Types</option>
                       <option>Midterm</option>
                       <option>Final</option>
                       <option>Quiz</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Year</label>
                     <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})} className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 p-2">
                       <option>Any Year</option>
                       <option>2023</option>
                       <option>2022</option>
                       <option>2021</option>
                     </select>
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                 <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-fire text-orange-500"></i> Trending This Week
                 </h3>
                 <div className="space-y-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex gap-3 items-center group cursor-pointer">
                       <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">#{i}</div>
                       <div>
                         <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">CSE{200+i} Final</div>
                         <div className="text-xs text-gray-500">2023 • Fall</div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search by subject, code, year, or keyword..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Grouping Header */}
              <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                 <h2 className="text-lg font-bold text-gray-800">2023 Papers</h2>
                 <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">14 Found</span>
                 <div className="flex-1 h-px bg-gray-200"></div>
                 <button className="text-xs text-blue-600 font-medium">Collapse</button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {mockPapers.map(paper => (
                  <div key={paper.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
                      {paper.semester} {paper.year}
                    </div>
                    
                    <div className="mb-1 flex items-center gap-2 mt-2">
                       <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{paper.examType}</span>
                       {paper.hasSolution && (
                         <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                           <i className="fa-solid fa-check"></i> Solution
                         </span>
                       )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{paper.subject}</h3>
                    <div className="text-sm font-medium text-gray-500 mb-3">{paper.code} • {paper.teacher}</div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                      <span title="Downloads"><i className="fa-solid fa-download mr-1"></i> {paper.downloads}</span>
                      <span title="Duration"><i className="fa-solid fa-clock mr-1"></i> {paper.duration} min</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => { setSelectedPaper(paper); setShowPreviewModal(true); }}
                        className="flex-1 bg-gray-100 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-eye"></i> Preview
                      </button>
                      <button className="flex-1 border border-blue-600 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition text-sm flex items-center justify-center gap-2">
                        <i className="fa-solid fa-download"></i> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal Overlay */}
        {showPreviewModal && selectedPaper && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col h-[90vh] animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{selectedPaper.subject} - {selectedPaper.examType}</h3>
                  <p className="text-xs text-gray-500">{selectedPaper.semester} {selectedPaper.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition"><i className="fa-solid fa-print"></i></button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition"><i className="fa-solid fa-download"></i></button>
                  <button onClick={() => setShowPreviewModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white rounded-full transition ml-2"><i className="fa-solid fa-xmark"></i></button>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-200 p-8 overflow-y-auto w-full relative flex items-center justify-center">
                 <div className="bg-white shadow-md w-full max-w-2xl min-h-150 p-10 flex items-center justify-center text-gray-400 font-medium bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                    [PDF Viewer Placeholder for {selectedPaper.code}]
                 </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl flex justify-between items-center gap-4">
                <button className="text-gray-600 font-medium text-sm flex items-center gap-2 hover:text-blue-600 transition">
                  <i className="fa-solid fa-comments"></i> Discuss Question
                </button>
                <div className="flex gap-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm">
                    <i className="fa-solid fa-bookmark mr-1"></i> Add to Study Plan
                  </button>
                  <button onClick={() => startPractice(selectedPaper)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition text-sm whitespace-nowrap shadow-sm shadow-blue-500/30">
                    <i className="fa-solid fa-stopwatch mr-1"></i> Take This Exam
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}