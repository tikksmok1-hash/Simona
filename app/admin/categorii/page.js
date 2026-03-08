'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminAuthContext';
import ImageUploader from '../components/ImageUploader';

function CategoriesContent() {
  const { apiFetch } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const [showNewSub, setShowNewSub] = useState(null); // categoryId
  const [editSubId, setEditSubId] = useState(null);

  // New Category form
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', image: '', order: 0 });
  // Edit Category form
  const [editCatForm, setEditCatForm] = useState({ name: '', slug: '', description: '', image: '', order: 0 });
  // New Subcategory form
  const [subForm, setSubForm] = useState({ name: '', slug: '', description: '', image: '', order: 0 });
  // Edit Subcategory form
  const [editSubForm, setEditSubForm] = useState({ name: '', slug: '', description: '', image: '', order: 0 });

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/api/admin/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const autoSlug = (name) => name.toLowerCase().replace(/[ăâ]/g, 'a').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[î]/g, 'i').replace(/&/g, 'si').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Create Category
  const createCategory = async () => {
    if (!catForm.name) return;
    try {
      const res = await apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ ...catForm, slug: catForm.slug || autoSlug(catForm.name) }),
      });
      if (res.ok) {
        setCatForm({ name: '', slug: '', description: '', image: '', order: 0 });
        setShowNewCat(false);
        fetchCategories();
      }
    } catch {}
  };

  // Edit Category
  const startEditCat = (cat) => {
    setEditId(cat.id);
    setEditCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '', order: cat.order || 0 });
  };

  const saveEditCat = async () => {
    try {
      await apiFetch(`/api/admin/categories/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify(editCatForm),
      });
      setEditId(null);
      fetchCategories();
    } catch {}
  };

  // Delete Category
  const deleteCat = async (id) => {
    if (!confirm('Sigur vrei să ștergi această categorie? Se vor șterge și subcategoriile.')) return;
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch {}
  };

  // Create Subcategory
  const createSubcategory = async (categoryId) => {
    if (!subForm.name) return;
    try {
      const res = await apiFetch('/api/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify({ ...subForm, slug: subForm.slug || autoSlug(subForm.name), categoryId }),
      });
      if (res.ok) {
        setSubForm({ name: '', slug: '', description: '', image: '', order: 0 });
        setShowNewSub(null);
        fetchCategories();
      }
    } catch {}
  };

  // Edit Subcategory
  const startEditSub = (sub) => {
    setEditSubId(sub.id);
    setEditSubForm({ name: sub.name, slug: sub.slug, description: sub.description || '', image: sub.image || '', order: sub.order || 0 });
  };

  const saveEditSub = async () => {
    try {
      await apiFetch(`/api/admin/subcategories/${editSubId}`, {
        method: 'PATCH',
        body: JSON.stringify(editSubForm),
      });
      setEditSubId(null);
      fetchCategories();
    } catch {}
  };

  // Delete Subcategory
  const deleteSub = async (id) => {
    if (!confirm('Sigur vrei să ștergi această subcategorie?')) return;
    try {
      await apiFetch(`/api/admin/subcategories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch {}
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Categorii & Subcategorii</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categorii</p>
        </div>
        <button
          onClick={() => setShowNewCat(!showNewCat)}
          className="bg-black text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer text-center"
        >
          + Categorie Nouă
        </button>
      </div>

      {/* New Category Form */}
      {showNewCat && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-black mb-4">Categorie Nouă</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nume *</label>
              <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: autoSlug(e.target.value) })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
              <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Descriere</label>
              <input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Ordine</label>
              <input type="number" value={catForm.order} onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>
          <ImageUploader value={catForm.image} onChange={(url) => setCatForm({ ...catForm, image: url })} label="Imagine Categorie" />
          <div className="flex gap-3 mt-4">
            <button onClick={createCategory} className="bg-black text-white px-6 py-2 text-xs tracking-widest uppercase hover:bg-neutral-800 cursor-pointer">Salvează</button>
            <button onClick={() => setShowNewCat(false)} className="text-sm text-gray-500 hover:text-black cursor-pointer">Anulează</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Se încarcă...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Category header */}
              {editId === cat.id ? (
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-black mb-4">Editează Categorie</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Nume</label>
                      <input value={editCatForm.name} onChange={(e) => setEditCatForm({ ...editCatForm, name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
                      <input value={editCatForm.slug} onChange={(e) => setEditCatForm({ ...editCatForm, slug: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Descriere</label>
                      <input value={editCatForm.description} onChange={(e) => setEditCatForm({ ...editCatForm, description: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Ordine</label>
                      <input type="number" value={editCatForm.order} onChange={(e) => setEditCatForm({ ...editCatForm, order: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                  </div>
                  <ImageUploader value={editCatForm.image} onChange={(url) => setEditCatForm({ ...editCatForm, image: url })} label="Imagine Categorie" />
                  <div className="flex gap-3 mt-4">
                    <button onClick={saveEditCat} className="bg-black text-white px-6 py-2 text-xs tracking-widest uppercase hover:bg-neutral-800 cursor-pointer">Salvează</button>
                    <button onClick={() => setEditId(null)} className="text-sm text-gray-500 hover:text-black cursor-pointer">Anulează</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {cat.image ? (
                      <img src={cat.image} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-black">{cat.name}</h3>
                      <p className="text-xs text-gray-400">/{cat.slug} · {cat.subcategories?.length || 0} subcategorii</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setShowNewSub(showNewSub === cat.id ? null : cat.id)} className="text-xs text-gray-500 hover:text-black px-2 py-1.5 border border-gray-200 rounded hover:border-black cursor-pointer">+ Subcategorie</button>
                    <button onClick={() => startEditCat(cat)} className="text-xs text-gray-500 hover:text-black px-2 py-1.5 border border-gray-200 rounded hover:border-black cursor-pointer">Editează</button>
                    <button onClick={() => deleteCat(cat.id)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 border border-red-200 rounded hover:border-red-400 cursor-pointer">Șterge</button>
                  </div>
                </div>
              )}

              {/* New Subcategory Form */}
              {showNewSub === cat.id && (
                <div className="p-6 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-700 mb-3">Subcategorie Nouă în {cat.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nume *</label>
                      <input value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value, slug: autoSlug(e.target.value) })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Slug</label>
                      <input value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Descriere</label>
                      <input value={subForm.description} onChange={(e) => setSubForm({ ...subForm, description: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                    </div>
                  </div>
                  <ImageUploader value={subForm.image} onChange={(url) => setSubForm({ ...subForm, image: url })} label="Imagine Subcategorie" />
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => createSubcategory(cat.id)} className="bg-black text-white px-5 py-1.5 text-xs tracking-widest uppercase hover:bg-neutral-800 cursor-pointer">Salvează</button>
                    <button onClick={() => setShowNewSub(null)} className="text-xs text-gray-500 hover:text-black cursor-pointer">Anulează</button>
                  </div>
                </div>
              )}

              {/* Subcategories list */}
              {cat.subcategories?.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id}>
                      {editSubId === sub.id ? (
                        <div className="p-4 pl-14 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nume</label>
                              <input value={editSubForm.name} onChange={(e) => setEditSubForm({ ...editSubForm, name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Slug</label>
                              <input value={editSubForm.slug} onChange={(e) => setEditSubForm({ ...editSubForm, slug: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Descriere</label>
                              <input value={editSubForm.description} onChange={(e) => setEditSubForm({ ...editSubForm, description: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                            </div>
                          </div>
                          <ImageUploader value={editSubForm.image} onChange={(url) => setEditSubForm({ ...editSubForm, image: url })} label="Imagine" />
                          <div className="flex gap-3 mt-3">
                            <button onClick={saveEditSub} className="bg-black text-white px-5 py-1.5 text-xs tracking-widest uppercase hover:bg-neutral-800 cursor-pointer">Salvează</button>
                            <button onClick={() => setEditSubId(null)} className="text-xs text-gray-500 hover:text-black cursor-pointer">Anulează</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between px-6 py-3 pl-14 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            {sub.image ? (
                              <img src={sub.image} alt="" className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-700">{sub.name}</p>
                              <p className="text-xs text-gray-400">/{sub.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditSub(sub)} className="text-xs text-gray-400 hover:text-black cursor-pointer">Editează</button>
                            <button onClick={() => deleteSub(sub.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Șterge</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400 text-sm">
              Nu există categorii. Creează prima categorie!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return <CategoriesContent />;
}
