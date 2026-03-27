export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-4">Why Choose Scholar Space?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to succeed in your academic journey at ULAB, all in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-[#1e3a8a]">
              <i className="fa-solid fa-book-open text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-poppins mb-3">Resource Hub</h3>
            <p className="text-gray-600">Access course materials, previous papers, and study guides shared by peers and faculty.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-6 text-[#fbbf24]">
              <i className="fa-solid fa-users text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-poppins mb-3">Community</h3>
            <p className="text-gray-600">Join study groups, ask questions, and collaborate with classmates on projects.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
              <i className="fa-solid fa-robot text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-poppins mb-3">AI Tools</h3>
            <p className="text-gray-600">Leverage smart tools to summarize notes, create flashcards, and organize your study schedule.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
