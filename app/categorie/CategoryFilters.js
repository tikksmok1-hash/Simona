'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { useTranslation } from '@/app/context/LanguageContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
const PAGE_SIZE = 12;

export default function CategoryFilters({ categoryProducts, category, activeSubslug }) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [appliedMin, setAppliedMin] = useState(null);
  const [appliedMax, setAppliedMax] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = [...categoryProducts];

    // Size filter — check stock across all variants
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) =>
          v.sizes?.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
        )
      );
    }

    // Price filter
    if (appliedMin !== null) result = result.filter((p) => p.price >= appliedMin);
    if (appliedMax !== null) result = result.filter((p) => p.price <= appliedMax);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [categoryProducts, selectedSizes, appliedMin, appliedMax, sortBy]);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [selectedSizes, appliedMin, appliedMax, sortBy]);

  const toggleSize = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const applyPrice = () => {
    setAppliedMin(minInput !== '' ? Number(minInput) : null);
    setAppliedMax(maxInput !== '' ? Number(maxInput) : null);
    // On mobile, close the filters panel so products are visible
    if (window.innerWidth < 1024) setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setMinInput('');
    setMaxInput('');
    setAppliedMin(null);
    setAppliedMax(null);
    setSortBy('newest');
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    appliedMin !== null ||
    appliedMax !== null ||
    sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm tracking-wide text-neutral-600 hover:text-black transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            {showFilters ? t('filter.hideFilters') : t('filter.showFilters')}
          </button>

          <span className="text-sm text-neutral-400">{filtered.length} {t('cart.products')}</span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-neutral-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              {t('filter.reset')}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">{t('filter.sort')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="newest">{t('filter.newest')}</option>
            <option value="price-asc">{t('filter.sortPriceAsc')}</option>
            <option value="price-desc">{t('filter.sortPriceDesc')}</option>
            <option value="name-asc">{t('filter.alphabetic')}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div
          className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}
        >
          <div className="space-y-8">
            {/* Subcategories */}
            {category.subcategories?.length > 0 && (
              <div>
                <h3 className="text-xs tracking-widest uppercase text-black font-medium mb-4">
                  {t('filter.subcategories')}
                </h3>
                <div className="space-y-2">
                  <Link
                    href={`/categorie/${category.slug}`}
                    className={`block text-sm transition-colors py-1 ${
                      activeSubslug === null
                        ? 'text-black font-medium'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {t('filter.all')} {category.name}
                  </Link>
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/categorie/${category.slug}/${sub.slug}`}
                      className={`block text-sm transition-colors py-1 ${
                        sub.slug === activeSubslug
                          ? 'text-black font-medium'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            <div>
              <h3 className="text-xs tracking-widest uppercase text-black font-medium mb-4">
                {t('filter.size')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-10 h-10 text-sm border transition-colors ${
                      selectedSizes.includes(size)
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs tracking-widest uppercase text-black font-medium mb-4">
                {t('filter.price')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder={t('filter.min')}
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-black"
                  />
                  <span className="text-neutral-400">–</span>
                  <input
                    type="number"
                    placeholder={t('filter.max')}
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  onClick={applyPrice}
                  className="w-full py-2 border border-black text-sm tracking-wide hover:bg-black hover:text-white active:scale-95 transition-[color,background-color,border-color,transform] duration-200"
                >
                  {t('filter.apply')}
                </button>
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-neutral-500 hover:text-black underline underline-offset-2"
              >
                {t('filter.reset')}
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More / Progress */}
              {filtered.length > PAGE_SIZE && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  {/* Progress bar */}
                  <div className="w-48 h-px bg-neutral-200 relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-black transition-[width] duration-500"
                      style={{ width: `${Math.min(100, (visibleCount / filtered.length) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-400 tracking-wide">
                    {t('filter.showing')} {Math.min(visibleCount, filtered.length)} {t('filter.of')} {filtered.length}
                  </p>
                  {visibleCount < filtered.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="border border-black text-black px-10 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-[color,background-color,border-color,transform] duration-200 cursor-pointer active:scale-95"
                    >
                      {t('filter.loadMore')}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="w-12 h-12 text-neutral-300 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-light text-black mb-2">
                {t('filter.noProductsFound')}
              </h3>
              <p className="text-neutral-500 mb-6">
                {hasActiveFilters
                  ? t('filter.tryChangeFilters')
                  : t('filter.noProductsInCategory')}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="inline-block border border-black text-black px-8 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                >
                  {t('filter.reset')}
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-block bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  {t('common.home')}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
