export default function Hero() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins leading-tight mb-6">
            Unlock Your Potential with <br />
            <span className="text-[#1e3a8a]">ULAB <span className="text-[#fbbf24]">Scholar Space</span></span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            The smartest study and collaboration platform designed exclusively for ULAB students. Connect, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/signup" className="px-8 py-3 rounded-md bg-[#1e3a8a] text-white font-medium hover:bg-blue-800 transition-colors shadow-md text-center">
              Get Started
            </a>
            <a href="/about" className="px-8 py-3 rounded-md bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center">
              Learn More
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* Illustration Placeholder */}
          <div className="w-full max-w-md aspect-square bg-gray-100 rounded-2xl flex items-center justify-center p-8 border border-gray-200 shadow-inner">
            <i className="fa-solid fa-graduation-cap text-[#1e3a8a] text-9xl opacity-20"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
