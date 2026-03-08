'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

const PAGE_SIZE = 8;

const CATEGORY_LABELS = {
  'rochii': 'Rochii',
  'bluze-topuri': 'Bluze & Topuri',
  'pantaloni': 'Pantaloni',
  'jachete-paltoane': 'Jachete & Paltoane',
  'fuste': 'Fuste',
  'accesorii': 'Accesorii',
};

export default function BestsellersFilters({ products: productsList, totalSavings = 0, availableCategories, categories = [], mode = 'sale' }) {
  const isSaleMode = mode === 'sale';
  const defaultSort = isSaleMode ? 'discount-desc' : 'name-asc';

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSubcategory, setFilterSubcategory] = useState('all');
  const [filterDiscount, setFilterDiscount] = useState(0);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [page, setPage] = useState(1);

  // Subcategories for the active category
  const activeSubcategories = useMemo(() => {
    if (filterCategory === 'all') return [];
    const cat = categories.find((c) => c.slug === filterCategory);
    return cat?.subcategories ?? [];
  }, [filterCategory]);

  const filtered = useMemo(() => {
    let result = [...productsList];
    if (filterCategory !== 'all') result = result.filter((p) => p.categorySlug === filterCategory);
    if (filterSubcategory !== 'all') result = result.filter((p) => p.subcategorySlug === filterSubcategory);
    if (filterDiscount > 0)
      result = result.filter(
        (p) => p.compareAtPrice && Math.round((1 - p.price / p.compareAtPrice) * 100) >= filterDiscount
      );
    result.sort((a, b) => {
      const da = a.compareAtPrice ? Math.round((1 - a.price / a.compareAtPrice) * 100) : 0;
      const db = b.compareAtPrice ? Math.round((1 - b.price / b.compareAtPrice) * 100) : 0;
      if (sortBy === 'discount-desc') return db - da;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [productsList, filterCategory, filterSubcategory, filterDiscount, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters =
    filterCategory !== 'all' || filterSubcategory !== 'all' || filterDiscount > 0 || sortBy !== defaultSort;

  const resetFilters = () => {
    setFilterCategory('all');
    setFilterSubcategory('all');
    setFilterDiscount(0);
    setSortBy(defaultSort);
    setPage(1);
  };

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sticky filters bar */}
      <div className="bg-neutral-50 border-b border-gray-100 sticky top-[112px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">

            {/* Category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] tracking-widest uppercase text-gray-400 shrink-0">Categorie:</span>
              <button
                onClick={() => { setFilterCategory('all'); setFilterSubcategory('all'); setPage(1); }}
                className={`text-[10px] tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 cursor-pointer active:scale-95 ${
                  filterCategory === 'all'
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
                }`}
              >
                Toate ({productsList.length})
              </button>
              {availableCategories.map((cat) => {
                const count = productsList.filter((p) => p.categorySlug === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setFilterSubcategory('all'); setPage(1); }}
                    className={`text-[10px] tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 cursor-pointer active:scale-95 ${
                      filterCategory === cat
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
                    }`}
                  >
                    {CATEGORY_LABELS[cat] || cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Subcategory row — visible only when a category is selected and has subcategories */}
            {activeSubcategories.length > 0 && (
              <div className="w-full flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[9px] tracking-widest uppercase text-gray-300 shrink-0">↳</span>
                <button
                  onClick={() => { setFilterSubcategory('all'); setPage(1); }}
                  className={`text-[10px] tracking-widest uppercase px-3 py-1 border transition-all duration-200 cursor-pointer active:scale-95 ${
                    filterSubcategory === 'all'
                      ? 'bg-neutral-800 text-white border-neutral-800'
                      : 'border-gray-200 text-gray-400 hover:bg-neutral-800 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  Toate
                </button>
                {activeSubcategories.map((sub) => {
                  const count = productsList.filter(
                    (p) => p.categorySlug === filterCategory && p.subcategorySlug === sub.slug
                  ).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={sub.slug}
                      onClick={() => { setFilterSubcategory(sub.slug); setPage(1); }}
                      className={`text-[10px] tracking-widest uppercase px-3 py-1 border transition-all duration-200 cursor-pointer active:scale-95 ${
                        filterSubcategory === sub.slug
                          ? 'bg-neutral-800 text-white border-neutral-800'
                          : 'border-gray-200 text-gray-400 hover:bg-neutral-800 hover:text-white hover:border-neutral-800'
                      }`}
                    >
                      {sub.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            <div className="hidden md:block w-px h-5 bg-gray-200" />

            {/* Discount tier — only in sale mode */}
            {isSaleMode && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] tracking-widest uppercase text-gray-400 shrink-0">Reducere:</span>
              {[0, 10, 20, 30].map((tier) => (
                <button
                  key={tier}
                  onClick={() => { setFilterDiscount(tier); setPage(1); }}
                  className={`text-[10px] tracking-widest uppercase px-4 py-1.5 border transition-all duration-200 cursor-pointer active:scale-95 ${
                    filterDiscount === tier
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
                  }`}
                >
                  {tier === 0 ? 'Toate' : `-${tier}%+`}
                </button>
              ))}
            </div>
            )}

            <div className="hidden md:block w-px h-5 bg-gray-200" />

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest uppercase text-gray-400 shrink-0">Sortează:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="text-[10px] tracking-widest uppercase border border-gray-200 bg-white text-gray-600 px-3 py-1.5 focus:outline-none focus:border-black transition-colors cursor-pointer"
              >
                {isSaleMode && <option value="discount-desc">Reducere ↓</option>}
                <option value="price-asc">Preț ↑</option>
                <option value="price-desc">Preț ↓</option>
                <option value="name-asc">Nume A–Z</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-[9px] tracking-widest uppercase text-gray-400 hover:text-black underline underline-offset-2 transition-colors cursor-pointer active:scale-95"
              >
                Resetează filtrele
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-2 text-[9px] tracking-widest uppercase text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'produs' : 'produse'} găsite
            {totalPages > 1 && ` · Pagina ${page} din ${totalPages}`}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-px bg-black mx-auto mb-8" />
            <p className="font-serif text-2xl text-gray-300 mb-4">Niciun produs găsit</p>
            <p className="text-sm text-gray-400 mb-8">Încearcă să schimbi filtrele</p>
            <button
              onClick={resetFilters}
              className="border border-black text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
            >
              Resetează filtrele
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const nearCurrent = Math.abs(p - page) <= 2;
                  const isEdge = p === 1 || p === totalPages;
                  const show = nearCurrent || isEdge;
                  const showLeftEllipsis = p === 2 && page > 4 && totalPages > 7;
                  const showRightEllipsis = p === totalPages - 1 && page < totalPages - 3 && totalPages > 7;

                  if (!show && !showLeftEllipsis && !showRightEllipsis) return null;
                  if (showLeftEllipsis || showRightEllipsis) {
                    return (
                      <span key={p} className="w-10 h-10 flex items-center justify-center text-gray-300 text-sm select-none">
                        …
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 border text-xs tracking-widest transition-all duration-200 cursor-pointer active:scale-95 ${
                        p === page
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 text-gray-500 hover:bg-black hover:text-white hover:border-black'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Savings banner — only in sale mode */}
            {isSaleMode && totalSavings > 0 && (
            <div className="mt-16 bg-black text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase mb-2">Economisești în total</p>
                <p className="font-serif text-4xl font-light">
                  până la {totalSavings.toLocaleString()} MDL
                </p>
              </div>
              <Link
                href="/cos"
                className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 text-xs tracking-widest uppercase hover:bg-neutral-100 transition-colors shrink-0"
              >
                Vezi Coșul
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
