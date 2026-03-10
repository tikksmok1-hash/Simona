'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { CartProvider } from '../context/CartContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    if (isAdmin) return;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => { if (data && typeof data === 'object') setSiteSettings(data); })
      .catch(() => {});
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar siteSettings={siteSettings} />
      <CartSidebar />
      <main>{children}</main>
      <Footer siteSettings={siteSettings} />
    </CartProvider>
  );
}
