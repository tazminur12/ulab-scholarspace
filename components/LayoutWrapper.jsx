"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin-dashboard') || pathname?.startsWith('/notebook') || pathname?.startsWith('/exam-routine') || pathname?.startsWith('/study-plan') || pathname?.startsWith('/slides-library') || pathname?.startsWith('/pdf-tools') || pathname?.startsWith('/youtube-learning') || pathname?.startsWith('/discussions') || pathname?.startsWith('/reminders') || pathname?.startsWith('/gpa-calculator') || pathname?.startsWith('/events') || pathname?.startsWith('/resource-finder');

  return (
    <>
      {!isDashboard && <Navbar />}
      
      {/* Main Content Area */}
      <main className={isDashboard ? "h-screen w-full flex flex-col" : "grow"}>
        {children}
      </main>

      {!isDashboard && <Footer />}
    </>
  );
}
