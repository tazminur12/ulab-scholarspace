"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'fa-solid fa-house' },
    { name: 'My Notes', href: '/notebook', icon: 'fa-solid fa-book' },
    { name: 'Exam Routine', href: '/exam-routine', icon: 'fa-solid fa-clock' },
    { name: 'Study Plan', href: '/study-plan', icon: 'fa-solid fa-calendar-check' },
    { name: 'Discussions', href: '/discussions', icon: 'fa-solid fa-comments' },
    { name: 'AI Helper', href: '/ai-helper', icon: 'fa-solid fa-robot' },
    { name: 'Settings', href: '/settings', icon: 'fa-solid fa-gear' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  return (
    <div className="flex h-full w-full bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:block flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap"></i>
            ScholarSpace
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#1e3a8a] text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} w-5 text-center`}></i>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content (Topbar + Children) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10">
          <button 
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>

          <div className="flex-1 flex justify-end items-center gap-4 lg:gap-6">
            <button className="text-gray-500 hover:text-[#1e3a8a] relative">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer">
              S
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
