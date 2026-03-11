'use client';

import { AdminAuthProvider, useAdmin } from './AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Link from 'next/link';

// Bottom nav items for mobile
const mobileNav = [
  {
    href: '/admin',
    label: 'Acasă',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/admin/comenzi',
    label: 'Comenzi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: '/admin/produse',
    label: 'Produse',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: '/admin/categorii',
    label: 'Categorii',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/setari',
    label: 'Mai mult',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
    isMore: true,
  },
];

function MobileBottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const moreItems = [
    { href: '/admin/noutati', label: 'Noutăți', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )},
    { href: '/admin/setari', label: 'Setări Site', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { href: '/admin/securitate', label: 'Securitate', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )},
  ];

  return (
    <>
      {/* "More" popup menu */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
          <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[180px] animate-in slide-in-from-bottom-2">
            {moreItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    active ? 'text-black font-medium bg-gray-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Vezi site-ul
              </a>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {mobileNav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            if (item.isMore) {
              return (
                <button
                  key="more"
                  onClick={() => setShowMore((p) => !p)}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors cursor-pointer ${
                    showMore ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  active ? 'text-black' : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-black" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function MobileHeader({ onMenuClick }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-black text-white px-4 py-3 flex items-center justify-between shadow-md">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer"
        aria-label="Deschide meniul"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="text-base font-serif tracking-wider">SIMONA</span>
      <div className="w-9" />
    </header>
  );
}

function AdminLayoutInner({ children }) {
  const { user, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header with hamburger */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar (always visible on desktop, slide-over on mobile) */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content - add bottom padding on mobile for the bottom nav */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen overflow-x-hidden pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation bar */}
      <MobileBottomNav />
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
