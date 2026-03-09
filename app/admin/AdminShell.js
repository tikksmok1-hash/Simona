'use client';

import { useAdmin } from './AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar, { MobileHeader } from './AdminSidebar';

export default function AdminShell({ children }) {
  const { user, loading } = useAdmin();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setInitialLoad(false);
      if (!user) {
        router.push('/admin/login');
      }
    }
  }, [loading, user, router]);

  // Only show loading on initial load, not on navigation
  if (initialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user || user.pending) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Floating menu button for mobile - always visible */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all"
        aria-label="Deschide meniul"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
