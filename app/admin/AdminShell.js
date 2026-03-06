'use client';

import { useAdmin } from './AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }) {
  const { user, loading } = useAdmin();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);

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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
