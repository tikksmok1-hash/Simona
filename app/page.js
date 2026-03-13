import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './components/ProductCard';
import HomeClient from './HomeClient';
import {
  getFeaturedProducts,
  getSaleProducts,
  getBestsellerProducts,
  getLatestBlogPosts,
  getSiteSettings,
  getAllCategories,
} from '@/lib/db/queries';

// ISR — cache for 5 min; admin triggers /api/revalidate for instant updates
export const revalidate = 300;

export default async function Home() {
  // Fetch data from DB in parallel
  const [featuredProducts, saleProducts, bestsellerProducts, latestPosts, siteSettings, categories] = await Promise.all([
    getFeaturedProducts(8),
    getSaleProducts(4),
    getBestsellerProducts(4),
    getLatestBlogPosts(3),
    getSiteSettings(),
    getAllCategories(),
  ]);

  // Hero settings with defaults
  const heroImage = siteSettings.heroImage || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90';
  const heroTitle = siteSettings.heroTitle || 'Descoperă';
  const heroSubtitle = siteSettings.heroSubtitle || 'Stilul Tău';
  const heroLabel = siteSettings.heroLabel || 'Colecția Primăvară 2026';

  // Contact settings with defaults
  const phone1 = siteSettings.phone1 || '062 000 160';
  const siteEmail = siteSettings.email || 'simona.md_info@mail.ru';
  const siteAddress = siteSettings.address || 'str. Ion Creangă 58, Chișinău';
  const phone1Digits = phone1.replace(/[^\d]/g, '');
  const phone1Intl = phone1Digits.startsWith('373') ? phone1Digits : '373' + (phone1Digits.startsWith('0') ? phone1Digits.slice(1) : phone1Digits);

  // Calculate maximum discount percentage from sale products
  const maxDiscount = saleProducts.reduce((max, p) => {
    const discount = Math.round((1 - p.price / p.compareAtPrice) * 100);
    return discount > max ? discount : max;
  }, 0);

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      saleProducts={saleProducts}
      bestsellerProducts={bestsellerProducts}
      latestPosts={latestPosts}
      categories={categories}
      siteSettings={siteSettings}
      heroImage={heroImage}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      heroLabel={heroLabel}
      phone1={phone1}
      siteEmail={siteEmail}
      siteAddress={siteAddress}
      phone1Intl={phone1Intl}
      maxDiscount={maxDiscount}
    />
  );
}
