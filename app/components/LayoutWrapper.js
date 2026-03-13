'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';

// Lazy-load below-fold / off-screen components to improve FCP
const Footer = dynamic(() => import('./Footer'), { ssr: true });
const CartSidebar = dynamic(() => import('./CartSidebar'), { ssr: false });

// In-memory cache so we don't refetch on every client-side navigation
let settingsCache = { data: null, ts: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [siteSettings, setSiteSettings] = useState(settingsCache.data || {});
  const fetched = useRef(false);

  // Scroll to top on every client-side navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isAdmin || fetched.current) return;
    fetched.current = true;

    // Use cached data if still fresh
    if (settingsCache.data && Date.now() - settingsCache.ts < CACHE_TTL) {
      setSiteSettings(settingsCache.data);
      return;
    }

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          settingsCache = { data, ts: Date.now() };
          setSiteSettings(data);
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <SiteSettingsProvider value={siteSettings}>
        <CartProvider>
          <Navbar siteSettings={siteSettings} />
          <CartSidebar />
          <main>{children}</main>
          <Footer siteSettings={siteSettings} />
        </CartProvider>
      </SiteSettingsProvider>
    </LanguageProvider>
  );
}
