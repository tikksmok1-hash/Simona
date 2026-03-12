'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/context/LanguageContext';
import { localize } from '@/lib/localize';
import CategoryFilters from './CategoryFilters';

export default function CategoryPageClient({ category, categoryProducts, activeSubcategories }) {
  const { lang, t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-black transition-colors">
            {t('common.home')}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-black">{localize(category, 'name', lang)}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black mb-4">
            {localize(category, 'name', lang)}
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">{localize(category, 'description', lang)}</p>
        </div>
      </div>

      {/* Subcategory Tabs */}
      {activeSubcategories.length > 0 && (
        <div className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/categorie/${category.slug}`}
                className="px-5 py-2 text-sm tracking-wide border border-black bg-black text-white"
              >
                {t('filter.all')}
              </Link>
              {activeSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categorie/${category.slug}/${sub.slug}`}
                  className="px-5 py-2 text-sm tracking-wide border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
                >
                  {localize(sub, 'name', lang)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters + Grid (Client Component) */}
      <CategoryFilters
        categoryProducts={categoryProducts}
        category={{ ...category, subcategories: activeSubcategories }}
        activeSubslug={null}
      />
    </div>
  );
}
