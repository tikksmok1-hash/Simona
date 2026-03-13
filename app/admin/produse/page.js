'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useAdmin } from '../AdminAuthContext';
import Link from 'next/link';
import Image from 'next/image';

const PAGE_SIZE = 20;

/* ── Toggle switch — memoised so only the toggled row re-renders ── */
const Toggle = memo(function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${on ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
    </button>
  );
});

function ProductsContent() {
  const { apiFetch } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await apiFetch('/api/admin/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = useCallback(async (id) => {
    if (!confirm('Sigur vrei să ștergi acest produs?')) return;
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  }, [apiFetch]);

  const toggleField = useCallback(async (id, field, current) => {
    // Optimistic update — instant UI toggle
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !current } : p))
    );
    try {
      const res = await apiFetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: current } : p))
      );
    }
  }, [apiFetch]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchCategory = !categoryFilter || p.category?.id === categoryFilter;
      const matchSubcategory = !subcategoryFilter || p.subcategory?.id === subcategoryFilter;
      return matchSearch && matchCategory && matchSubcategory;
    });
  }, [products, search, categoryFilter, subcategoryFilter]);

  // Derive unique categories from loaded products
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.category?.id) map.set(p.category.id, p.category);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Derive subcategories filtered by selected category
  const subcategories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (!p.subcategory?.id) return;
      if (categoryFilter && p.category?.id !== categoryFilter) return;
      map.set(p.subcategory.id, p.subcategory);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [products, categoryFilter]);

  // Reset subcategory filter when category changes
  useEffect(() => { setSubcategoryFilter(''); }, [categoryFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [search, categoryFilter, subcategoryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Produse</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} produse în total{filtered.length !== products.length && ` · ${filtered.length} filtrate`}</p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="bg-black text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors text-center"
        >
          + Produs Nou
        </Link>
      </div>

      {/* Search + Category + Subcategory filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută produse..."
          className="w-full sm:w-56 border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
        >
          <option value="">Toate categoriile</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {categoryFilter && subcategories.length > 0 && (
          <select
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            className="w-full sm:w-48 border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="">Toate subcategoriile</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        )}
        {(search || categoryFilter || subcategoryFilter) && (
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); setSubcategoryFilter(''); }}
            className="text-xs text-gray-400 hover:text-black underline underline-offset-2 transition-colors cursor-pointer whitespace-nowrap self-center"
          >
            Resetează filtrele
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Se încarcă...</div>
      ) : (
        <>
          {/* Desktop Table - hidden on mobile */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produs</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Preț</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categorie</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Nou</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Bestseller</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Activ</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((product) => {
                  const firstImage = product.variants?.[0]?.images?.[0]?.url;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {firstImage ? (
                            <div className="relative w-10 h-12 flex-shrink-0 rounded overflow-hidden">
                              <Image src={firstImage} alt="" fill className="object-cover" sizes="40px" />
                            </div>
                          ) : (
                            <div className="w-10 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">?</div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.variants?.length || 0} culori</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{product.price} MDL</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-red-500 ml-1 line-through">{product.compareAtPrice} MDL</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{product.category?.name || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleField(product.id, 'isNew', product.isNew)}
                          className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isNew ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isNew ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleField(product.id, 'isBestseller', product.isBestseller)}
                          className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isBestseller ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isBestseller ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleField(product.id, 'isActive', product.isActive)}
                          className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produse/${product.id}`}
                            className="text-xs text-gray-500 hover:text-black px-2 py-1 border border-gray-200 rounded hover:border-black transition-colors"
                          >
                            Editează
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-200 rounded hover:border-red-400 transition-colors cursor-pointer"
                          >
                            Șterge
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">
                {search || categoryFilter ? 'Niciun produs găsit.' : 'Nu există produse. Adaugă primul produs!'}
              </div>
            )}
          </div>

          {/* Mobile Cards - visible only on mobile/tablet */}
          <div className="lg:hidden space-y-3">
            {paginated.map((product) => {
              const firstImage = product.variants?.[0]?.images?.[0]?.url;
              return (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex gap-3">
                    {firstImage ? (
                      <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                        <Image src={firstImage} alt="" fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">?</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{product.category?.name || '—'}</p>
                      <div className="mt-1">
                        <span className="font-medium">{product.price} MDL</span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-red-500 ml-1 line-through">{product.compareAtPrice} MDL</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{product.variants?.length || 0} culori</p>
                    </div>
                  </div>
                  
                  {/* Toggles */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      <button
                        onClick={() => toggleField(product.id, 'isNew', product.isNew)}
                        className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isNew ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isNew ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </button>
                      Nou
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      <button
                        onClick={() => toggleField(product.id, 'isBestseller', product.isBestseller)}
                        className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isBestseller ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isBestseller ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </button>
                      Best
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      <button
                        onClick={() => toggleField(product.id, 'isActive', product.isActive)}
                        className={`w-8 h-5 rounded-full transition-colors cursor-pointer ${product.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </button>
                      Activ
                    </label>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/admin/produse/${product.id}`}
                      className="flex-1 text-center text-xs text-gray-600 py-2 border border-gray-200 rounded hover:border-black hover:text-black transition-colors"
                    >
                      Editează
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 text-xs text-red-500 py-2 border border-red-200 rounded hover:border-red-400 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-12 text-center text-gray-400 text-sm">
                {search || categoryFilter ? 'Niciun produs găsit.' : 'Nu există produse. Adaugă primul produs!'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} din {filtered.length} produse
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  ← Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs border rounded transition-colors cursor-pointer ${
                      p === page
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Următor →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}
