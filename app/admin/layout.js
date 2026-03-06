'use client';

import { AdminAuthProvider, useAdmin } from './AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';

function AdminLayoutInner({ children }) {
  const { user, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Login page doesn't need auth check
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    
    if (!loading) {
      if (!user || user.pending) {
        router.push('/admin/login');
      } else {
        setReady(true);
      }
    }
  }, [loading, user, router, isLoginPage]);

  // Login page - just render children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading only on initial auth check
  if (!ready && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!ready || !user || user.pending) {
    return null;
  }

  // Authenticated - show sidebar + content
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
