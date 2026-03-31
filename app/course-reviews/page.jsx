"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CourseReviewsPage() {
  const router = useRouter();
  const [view, setView] = useState('list'); // 'list' (search), 'course' (details), 'write'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState('helpful');

  // Mocks
  const departments = ['Computer Science', 'Business', 'Liberal Arts'];
  const subjects = ['CSE101', 'CSE202', 'BUS301', 'LIB101'];
  
  const mockCourseData = {
    id: 'CSE202',
    name: 'Data Structures and Algorithms',
    department: 'Computer Science',
    avgRating: 4.2,
    totalReviews: 124,
    difficulty: { Easy: 10, Medium: 40, Hard: 50 }, // percentages
    passRate: '85%',
    recommendRate: '78%',
    avgHours: '8-10',
    keywords: ['Challenging', 'Essential', 'Programming', 'Graphs', 'Must take'],
    ratingBreakdown: { 5: 50, 4: 40, 3: 20, 2: 10, 1: 4 },
    reviews: [
      {
        id: 1,
        author: 'Anonymous',
        verified: true,
        date: 'Oct 12, 2023',
        rating: 5,
        comment: 'Highly essential course. The instructor was amazing at explaining complex tree algorithms. Be prepared to spend a lot of time on assignments.',
        tips: 'Start programming assignments the day they are released!',
        workload: 'Heavy',
        examDifficulty: 'Hard',
        recommend: true,
        instructorRating: { teaching: 5, helpfulness: 4, fairness: 5 },
        upvotes: 42,
        downvotes: 2
      },
      {
        id: 2,
        author: 'John Doe',
        verified: false,
        date: 'Sep 28, 2023',
        rating: 3,
        comment: 'Good material but the grading is extremely harsh. Exams are very theoretical compared to the practical homework.',
        tips: 'Focus heavily on the textbook proofs.',
        workload: 'Very Heavy',
        examDifficulty: 'Hard',
        recommend: false,
        instructorRating: { teaching: 3, helpfulness: 2, fairness: 2 },
        upvotes: 15,
        downvotes: 8
      }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, we'd fetch data for the searched course. Here we just mock it:
    setSelectedCourse(mockCourseData);
    setView('course');
  };

  const maxRatings = 124; // sum of ratingBreakdown

  const renderSearch = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Course Reviews</h2>
      <form onSubmit={handleSearch} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Code / Subject</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Course</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor (Optional)</label>
            <input type="text" placeholder="e.g. Dr. Smith" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Find Reviews
        </button>
      </form>
    </div>
  );

  const renderCourseView = () => {
    if (!selectedCourse) return null;
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Back and Write buttons */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
          <button onClick={() => setView('list')} className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Back to Search
          </button>
          <button onClick={() => setView('write')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition">
            <i className="fa-solid fa-pen-to-square mr-2"></i> Write a Review
          </button>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-1">{selectedCourse.department}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.id}: {selectedCourse.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">
                  <i className="fa-solid fa-star"></i> {selectedCourse.avgRating}
                </span>
                <span>{selectedCourse.totalReviews} Reviews</span>
                <span>Pass Rate: {selectedCourse.passRate}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-6">
              <div>
                <div className="text-xs text-gray-500 uppercase">Would Recommend</div>
                <div className="text-xl font-bold text-green-600">{selectedCourse.recommendRate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Avg Hours/Week</div>
                <div className="text-xl font-bold text-gray-800">{selectedCourse.avgHours}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500 uppercase mb-2">Common Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {selectedCourse.keywords.map(kw => (
                    <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ratings Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-center">
            <h3 className="font-bold text-gray-800 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = selectedCourse.ratingBreakdown[star];
                const pct = Math.round((count / maxRatings) * 100);
                return (
                  <div key={star} className="flex items-center text-sm">
                    <span className="w-12 flex items-center font-medium text-gray-700">{star} <i className="fa-solid fa-star text-yellow-400 ml-1 text-xs"></i></span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3 overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-gray-500">{pct}%</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Perceived Difficulty</h4>
              <div className="flex w-full h-3 rounded-full overflow-hidden">
                <div className="bg-green-400 hover:opacity-90 transition-opacity" style={{ width: `${selectedCourse.difficulty.Easy}%` }} title={`Easy ${selectedCourse.difficulty.Easy}%`}></div>
                <div className="bg-yellow-400 hover:opacity-90 transition-opacity" style={{ width: `${selectedCourse.difficulty.Medium}%` }} title={`Medium ${selectedCourse.difficulty.Medium}%`}></div>
                <div className="bg-red-400 hover:opacity-90 transition-opacity" style={{ width: `${selectedCourse.difficulty.Hard}%` }} title={`Hard ${selectedCourse.difficulty.Hard}%`}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Easy</span><span>Med</span><span>Hard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Student Reviews</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Sort by:</label>
              <select className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="helpful">Most Helpful</option>
                <option value="recent">Most Recent</option>
                <option value="high">Highest Rating</option>
                <option value="low">Lowest Rating</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {selectedCourse.reviews.map(review => (
              <div key={review.id} className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{review.author}</span>
                      {review.verified && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"><i className="fa-solid fa-check-circle mr-1"></i>Verified Student</span>}
                    </div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-gray-200'}`}></i>)}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.comment}</p>
                
                {review.tips && (
                  <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg mb-4 border border-blue-100 italic">
                    <span className="font-bold not-italic">💡 Tip:</span> {review.tips}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-xs mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-gray-500 block">Workload</span>
                    <span className="font-semibold text-gray-800">{review.workload}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Exam Diff</span>
                    <span className="font-semibold text-gray-800">{review.examDifficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Recommend?</span>
                    <span className={`font-semibold ${review.recommend ? 'text-green-600' : 'text-red-600'}`}>
                      {review.recommend ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Instructor</span>
                    <span className="font-semibold text-gray-800">
                      T: {review.instructorRating.teaching}/5 • H: {review.instructorRating.helpfulness}/5
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <div className="flex gap-4">
                    <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition">
                      <i className="fa-solid fa-thumbs-up"></i> Helpful ({review.upvotes})
                    </button>
                    <button className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition">
                      <i className="fa-solid fa-thumbs-down"></i> Not Helpful ({review.downvotes})
                    </button>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-red-500 transition">
                    <i className="fa-solid fa-flag mr-1"></i> Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWriteReview = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => setView('course')} className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-gray-200 w-max">
        <i className="fa-solid fa-arrow-left"></i> Cancel Review
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Write a Review for {selectedCourse?.id}</h2>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setView('course'); }}>
            
            {/* Overall */}
            <div>
              <label className="block font-bold text-gray-800 mb-2">Overall Course Rating</label>
              <div className="flex gap-2 text-2xl text-gray-300">
                <i className="fa-solid fa-star hover:text-yellow-400 cursor-pointer"></i>
                <i className="fa-solid fa-star hover:text-yellow-400 cursor-pointer"></i>
                <i className="fa-solid fa-star hover:text-yellow-400 cursor-pointer"></i>
                <i className="fa-solid fa-star hover:text-yellow-400 cursor-pointer"></i>
                <i className="fa-solid fa-star hover:text-yellow-400 cursor-pointer"></i>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workload</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Very Light</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Heavy</option>
                  <option>Very Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Difficulty</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Grade (Optional)</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. A, B+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend?</label>
                <div className="flex gap-4 p-2 border border-gray-300 rounded-lg bg-gray-50">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rec" className="text-blue-600 focus:ring-blue-500" /> Yes</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rec" className="text-blue-600 focus:ring-blue-500" /> No</label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
               <h3 className="font-bold text-gray-800 mb-4">Instructor Ratings</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Teaching Quality (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Helpfulness (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Grading Fairness (1-5)</label>
                    <input type="number" min="1" max="5" className="w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
               </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Written Review *</label>
              <textarea required rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="What did you like or dislike about this course?"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tips for future students (Optional)</label>
              <textarea rows="2" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Focus on the weekly quizzes over the readings."></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="anon" className="text-blue-600 rounded focus:ring-blue-500" />
              <label htmlFor="anon" className="text-sm text-gray-700">Post anonymously</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
              Submit Review
            </button>
          </form>
        </div>

        {/* Guidelines Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i> Review Guidelines
            </h3>
            <ul className="space-y-3 text-sm text-yellow-900 list-disc pl-4">
              <li><strong>Be respectful:</strong> No personal attacks against instructors or students.</li>
              <li><strong>Be objective:</strong> Focus on academic aspects, workload, and teaching methods.</li>
              <li><strong>Be specific:</strong> Give examples to support your ratings.</li>
              <li>No sharing of direct exam questions or answers.</li>
            </ul>
          </div>
          
          {/* Admin Demo Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-gray-300 shadow-sm">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i> Admin Features
            </h3>
            <p className="text-xs mb-4">You have moderator privileges. You can verify enrollments and remove reviews.</p>
            <div className="space-y-2">
              <button className="w-full text-left text-sm py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-white transition"><i className="fa-solid fa-user-check mr-2"></i> Verify Enrollment Queue</button>
              <button className="w-full text-left text-sm py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded text-white transition"><i className="fa-solid fa-triangle-exclamation mr-2"></i> Moderation Queue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-900 mr-2 transition">
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-star-half-stroke"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Course Reviews</h1>
              <p className="text-xs text-gray-500 font-medium">Make informed course selections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && renderSearch()}
        {view === 'course' && renderCourseView()}
        {view === 'write' && renderWriteReview()}
      </div>
    </div>
  );
}