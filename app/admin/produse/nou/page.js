'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../../AdminAuthContext';
import ImageUploader from '../../components/ImageUploader';
import { useRouter } from 'next/navigation';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58'];

function ProductForm() {
  const { apiFetch } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    materialsInfo: '',
    shippingInfo: '',
    price: '',
    compareAtPrice: '',
    categoryId: '',
    subcategoryId: '',
    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestseller: false,
  });

  const [variants, setVariants] = useState([
    { colorName: '', colorCode: '#000000', images: [{ url: '', type: 'FRONT' }, { url: '', type: 'BACK' }], sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }] },
  ]);

  useEffect(() => {
    apiFetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Auto-generate slug
    if (name === 'name') {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[ăâ]/g, 'a').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[î]/g, 'i').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    }
  };

  // Variant handlers
  const updateVariant = (idx, field, value) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { colorName: '', colorCode: '#000000', images: [{ url: '', type: 'FRONT' }, { url: '', type: 'BACK' }], sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }] },
    ]);
  };

  const removeVariant = (idx) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariantImage = (vIdx, imgIdx, url) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIdx ? { ...v, images: v.images.map((img, j) => (j === imgIdx ? { ...img, url } : img)) } : v
      )
    );
  };

  const addVariantImage = (vIdx) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIdx ? { ...v, images: [...v.images, { url: '', type: 'DETAIL' }] } : v
      )
    );
  };

  const removeVariantImage = (vIdx, imgIdx) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIdx ? { ...v, images: v.images.filter((_, j) => j !== imgIdx) } : v
      )
    );
  };

  const updateSize = (vIdx, sIdx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIdx
          ? { ...v, sizes: v.sizes.map((s, j) => (j === sIdx ? { ...s, [field]: field === 'stock' ? parseInt(value) || 0 : value } : s)) }
          : v
      )
    );
  };

  const addSize = (vIdx) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === vIdx ? { ...v, sizes: [...v.sizes, { size: 'M', stock: 0 }] } : v))
    );
  };

  const removeSize = (vIdx, sIdx) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === vIdx ? { ...v, sizes: v.sizes.filter((_, j) => j !== sIdx) } : v))
    );
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      alert('Completează numele, prețul și categoria.');
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
          variants: variants.filter((v) => v.colorName),
        }),
      });

      if (res.ok) {
        router.push('/admin/produse');
      } else {
        const data = await res.json();
        alert(data.error || 'Eroare la salvare');
      }
    } catch (err) {
      alert('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Produs Nou</h1>
          <p className="text-sm text-gray-500 mt-1">Completează datele pentru noul produs.</p>
        </div>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black cursor-pointer">
          ← Înapoi
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Informații Generale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nume Produs *</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Preț (MDL) *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Preț Vechi (MDL) — pentru reducere</label>
              <input name="compareAtPrice" type="number" step="0.01" value={form.compareAtPrice} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="Lasă gol dacă nu e reducere" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Categorie *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer" required>
                <option value="">Selectează...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {selectedCategory?.subcategories?.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Subcategorie</label>
                <select name="subcategoryId" value={form.subcategoryId} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer">
                  <option value="">Niciuna</option>
                  {selectedCategory.subcategories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Descriere scurtă</label>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Descriere completă</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Detalii & Materiale</label>
            <textarea name="materialsInfo" value={form.materialsInfo} onChange={handleChange} rows={3} placeholder="Material de înaltă calitate, produs în România..." className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Livrare & Returnare</label>
            <textarea name="shippingInfo" value={form.shippingInfo} onChange={handleChange} rows={3} placeholder="Livrare standard: 70 MDL (3–5 zile lucrătoare)..." className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Setări Produs</h2>
          <div className="flex flex-wrap gap-6">
            {[
              { name: 'isActive', label: 'Activ' },
              { name: 'isNew', label: 'Nou' },
              { name: 'isBestseller', label: 'Bestseller' },
              { name: 'isFeatured', label: 'Recomandat' },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={flag.name}
                  checked={form[flag.name]}
                  onChange={handleChange}
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <span className="text-sm text-gray-700">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-black">Variante de Culoare</h2>
            <button type="button" onClick={addVariant} className="text-xs text-black border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">
              + Adaugă Culoare
            </button>
          </div>

          {variants.map((variant, vIdx) => (
            <div key={vIdx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Culoare #{vIdx + 1}</h3>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(vIdx)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">
                    Șterge Culoare
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Nume Culoare</label>
                  <input
                    value={variant.colorName}
                    onChange={(e) => updateVariant(vIdx, 'colorName', e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="ex. Negru, Roșu..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Cod Culoare</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={variant.colorCode}
                      onChange={(e) => updateVariant(vIdx, 'colorCode', e.target.value)}
                      className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      value={variant.colorCode}
                      onChange={(e) => updateVariant(vIdx, 'colorCode', e.target.value)}
                      className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-600">Imagini</label>
                  <button type="button" onClick={() => addVariantImage(vIdx)} className="text-xs text-gray-500 hover:text-black cursor-pointer">
                    + Imagine
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {variant.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="relative">
                      <ImageUploader
                        value={img.url}
                        onChange={(url) => updateVariantImage(vIdx, imgIdx, url)}
                        label={img.type === 'FRONT' ? 'Față' : img.type === 'BACK' ? 'Spate' : `Imagine ${imgIdx + 1}`}
                      />
                      {variant.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantImage(vIdx, imgIdx)}
                          className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-600">Mărimi & Stoc</label>
                  <button type="button" onClick={() => addSize(vIdx)} className="text-xs text-gray-500 hover:text-black cursor-pointer">
                    + Mărime
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {variant.sizes.map((s, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1.5">
                      <select
                        value={s.size}
                        onChange={(e) => updateSize(vIdx, sIdx, 'size', e.target.value)}
                        className="bg-transparent text-xs font-medium w-12 focus:outline-none cursor-pointer"
                      >
                        {SIZES.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={s.stock}
                        onChange={(e) => updateSize(vIdx, sIdx, 'stock', e.target.value)}
                        className="w-12 text-xs text-center bg-white border border-gray-200 rounded px-1 py-1 focus:outline-none focus:border-black"
                        min="0"
                      />
                      <button type="button" onClick={() => removeSize(vIdx, sIdx)} className="text-red-400 hover:text-red-600 text-xs cursor-pointer ml-1">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Se salvează...' : 'Salvează Produs'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-black cursor-pointer"
          >
            Anulează
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewProductPage() {
  return <ProductForm />;
}
