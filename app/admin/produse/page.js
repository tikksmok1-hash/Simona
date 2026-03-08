'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminAuthContext';
import Link from 'next/link';

function ProductsContent() {
  const { apiFetch } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const deleteProduct = async (id) => {
    if (!confirm('Sigur vrei să ștergi acest produs?')) return;
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const toggleField = async (id, field, current) => {
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
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-black">Produse</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} produse în total</p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="bg-black text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
        >
          + Produs Nou
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută produse..."
          className="w-full max-w-md border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Se încarcă...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              {filtered.map((product) => {
                const firstImage = product.variants?.[0]?.images?.[0]?.url;
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {firstImage ? (
                          <img src={firstImage} alt="" className="w-10 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">?</div>
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
              {search ? 'Niciun produs găsit.' : 'Nu există produse. Adaugă primul produs!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}
