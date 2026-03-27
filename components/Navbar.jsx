import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#1e3a8a] font-poppins">
              ULAB <span className="text-[#fbbf24]">Scholar Space</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-[#1e3a8a] text-sm font-medium">Home</Link>
            <a href="/dashboard" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Dashboard</a>
            <a href="/resources" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Resources</a>
            <a href="/community" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Community</a>
            <a href="/ai-tools" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">AI Tools</a>
          </nav>

          {/* Login/Signup & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
              <a href="/login" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-blue-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a8a]">
                Login / Signup
              </a>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]">
                <span className="sr-only">Open main menu</span>
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
