"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

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
