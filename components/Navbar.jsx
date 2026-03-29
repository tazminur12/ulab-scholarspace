"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Dashboard</Link>
            <Link href="/resource-finder" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Resource Finder</Link>
            <Link href="/events" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Events</Link>
            <Link href="/discussions" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Community</Link>
          </nav>

          {/* Login/Signup & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
              <Link href="/login" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-blue-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a8a]">
                Login / Signup
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                type="button" 
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
            <Link href="/" onClick={() => setIsOpen(false)} className="bg-blue-50 border-[#1e3a8a] text-[#1e3a8a] block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Dashboard</Link>
            <Link href="/resource-finder" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Resource Finder</Link>
            <Link href="/events" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Events</Link>
            <Link href="/discussions" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Community</Link>
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Workspace</p>
              <Link href="/notebook" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Notebook</Link>
              <Link href="/exam-routine" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Exam Routine</Link>
              <Link href="/study-plan" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Study Plan AI</Link>
              <Link href="/reminders" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Reminders</Link>
              <Link href="/gpa-calculator" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">GPA Calculator</Link>
            </div>

            <div className="pt-2 pb-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools & Media</p>
              <Link href="/slides-library" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Slides Library</Link>
              <Link href="/pdf-tools" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">PDF Tools</Link>
              <Link href="/youtube-learning" onClick={() => setIsOpen(false)} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">YouTube Learning</Link>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4 pb-6">
              <Link href="/login" onClick={() => setIsOpen(false)} className="mx-4 flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#1e3a8a] hover:bg-blue-800">
                Login / Signup
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
