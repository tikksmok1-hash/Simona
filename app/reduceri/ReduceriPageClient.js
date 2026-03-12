'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/context/LanguageContext';
import BestsellersFilters from '../bestsellers/BestsellersFilters';

export default function ReduceriPageClient({ saleProducts, categories, availableCategories, maxDiscount, totalSavings }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[160px]">

      {/* Hero */}
      <div className="relative bg-black overflow-hidden py-24">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-serif text-[18vw] font-light text-white/[0.03] leading-none tracking-tighter whitespace-nowrap">
            SALE
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.6em] uppercase mb-5 font-light">
              {t('sale.heroLabel')}
            </p>
            <h1 className="font-serif text-6xl md:text-8xl text-white font-light leading-none tracking-tight mb-6">
              {t('sale.title')}
              <span className="block italic text-white/50">{t('sale.upTo')} -{maxDiscount}%</span>
            </h1>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              {t('sale.desc')}
            </p>
          </div>
          <div className="flex gap-10 md:gap-16 text-center shrink-0">
            <div>
              <p className="font-serif text-5xl md:text-6xl text-white font-light leading-none mb-2">
                -{maxDiscount}%
              </p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">{t('sale.maxDiscount')}</p>
            </div>
            <div className="w-px bg-white/10 hidden md:block" />
            <div>
              <p className="font-serif text-5xl md:text-6xl text-white font-light leading-none mb-2">
                {saleProducts.length}
              </p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">{t('sale.productsInSale')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">{t('common.home')}</Link>
            <span>/</span>
            <span className="text-black">{t('sale.title')}</span>
          </nav>
        </div>
      </div>

      {/* Interactive filters + grid + pagination */}
      <BestsellersFilters
        products={saleProducts}
        totalSavings={totalSavings}
        availableCategories={availableCategories}
        categories={categories}
        mode="sale"
      />

    </div>
  );
}
