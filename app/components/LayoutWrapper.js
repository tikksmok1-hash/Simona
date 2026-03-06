'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { CartProvider } from '../context/CartContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <CartSidebar />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
