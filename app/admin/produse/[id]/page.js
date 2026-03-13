'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { useAdmin } from '../../AdminAuthContext';
import ImageUploader from '../../components/ImageUploader';
import TranslatableField from '../../components/TranslatableField';
import TemplatePicker from '../../components/TemplatePicker';
import { useRouter, useParams } from 'next/navigation';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58'];

/* ── Memoised variant card — only re-renders when its own variant data changes ── */
const VariantCard = memo(function VariantCard({
  variant, vIdx, canRemove,
  updateVariant, removeVariant,
  updateVariantImage, addVariantImage, removeVariantImage,
  updateSize, addSize, removeSize,
  apiFetch,
}) {
  const handleColorFieldChange = useCallback((field, val) => {
    if (field === 'colorName') updateVariant(vIdx, 'colorName', val);
    else if (field === 'colorNameRu') updateVariant(vIdx, 'colorNameRu', val);
    else if (field === 'colorNameEn') updateVariant(vIdx, 'colorNameEn', val);
  }, [vIdx, updateVariant]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Culoare #{vIdx + 1}: {variant.colorName || '—'}</h3>
        {canRemove && (
          <button type="button" onClick={() => removeVariant(vIdx)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Șterge Culoare</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <TranslatableField
            label="Nume Culoare"
            value={variant.colorName}
            valueRu={variant.colorNameRu}
            valueEn={variant.colorNameEn}
            onChange={handleColorFieldChange}
            fieldKey="colorName"
            apiFetch={apiFetch}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Cod Culoare</label>
          <div className="flex items-center gap-2">
            <input type="color" value={variant.colorCode} onChange={(e) => updateVariant(vIdx, 'colorCode', e.target.value)} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
            <input value={variant.colorCode} onChange={(e) => updateVariant(vIdx, 'colorCode', e.target.value)} className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Imagini</label>
          <button type="button" onClick={() => addVariantImage(vIdx)} className="text-xs text-gray-500 hover:text-black cursor-pointer">+ Imagine</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {variant.images.map((img, imgIdx) => (
            <div key={imgIdx} className="relative">
              <ImageUploader value={img.url} onChange={(url) => updateVariantImage(vIdx, imgIdx, url)} label={img.type === 'FRONT' ? 'Față' : img.type === 'BACK' ? 'Spate' : `Imagine ${imgIdx + 1}`} />
              {variant.images.length > 1 && (
                <button type="button" onClick={() => removeVariantImage(vIdx, imgIdx)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs cursor-pointer">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Mărimi & Stoc</label>
          <button type="button" onClick={() => addSize(vIdx)} className="text-xs text-gray-500 hover:text-black cursor-pointer">+ Mărime</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {variant.sizes.map((s, sIdx) => (
            <div key={sIdx} className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1.5">
              <select value={s.size} onChange={(e) => updateSize(vIdx, sIdx, 'size', e.target.value)} className="bg-transparent text-xs font-medium w-12 focus:outline-none cursor-pointer">
                {SIZES.map((sz) => (<option key={sz} value={sz}>{sz}</option>))}
              </select>
              <input type="number" value={s.stock} onChange={(e) => updateSize(vIdx, sIdx, 'stock', e.target.value)} className="w-12 text-xs text-center bg-white border border-gray-200 rounded px-1 py-1 focus:outline-none focus:border-black" min="0" />
              <button type="button" onClick={() => removeSize(vIdx, sIdx)} className="text-red-400 hover:text-red-600 text-xs cursor-pointer ml-1">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

function EditProductForm() {
  const { apiFetch } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: '', nameRu: '', nameEn: '',
    slug: '',
    description: '', descriptionRu: '', descriptionEn: '',
    shortDescription: '', shortDescriptionRu: '', shortDescriptionEn: '',
    materialsInfo: '', materialsInfoRu: '', materialsInfoEn: '',
    shippingInfo: '', shippingInfoRu: '', shippingInfoEn: '',
    price: '', compareAtPrice: '', categoryId: '', subcategoryId: '',
    isActive: true, isFeatured: false, isNew: false, isBestseller: false,
  });

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/admin/categories').then((r) => r.json()),
      apiFetch(`/api/admin/products/${productId}`).then((r) => r.json()),
    ]).then(([cats, product]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      if (product && !product.error) {
        setForm({
          name: product.name || '',
          nameRu: product.nameRu || '',
          nameEn: product.nameEn || '',
          slug: product.slug || '',
          description: product.description || '',
          descriptionRu: product.descriptionRu || '',
          descriptionEn: product.descriptionEn || '',
          shortDescription: product.shortDescription || '',
          shortDescriptionRu: product.shortDescriptionRu || '',
          shortDescriptionEn: product.shortDescriptionEn || '',
          materialsInfo: product.materialsInfo || '',
          materialsInfoRu: product.materialsInfoRu || '',
          materialsInfoEn: product.materialsInfoEn || '',
          shippingInfo: product.shippingInfo || '',
          shippingInfoRu: product.shippingInfoRu || '',
          shippingInfoEn: product.shippingInfoEn || '',
          price: product.price?.toString() || '',
          compareAtPrice: product.compareAtPrice?.toString() || '',
          categoryId: product.categoryId || '',
          subcategoryId: product.subcategoryId || '',
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          isNew: product.isNew ?? false,
          isBestseller: product.isBestseller ?? false,
        });
        setVariants(
          (product.variants || []).map((v) => ({
            colorName: v.colorName,
            colorNameRu: v.colorNameRu || '',
            colorNameEn: v.colorNameEn || '',
            colorCode: v.colorCode,
            images: (v.images || []).map((img) => ({ url: img.url, type: img.type || 'FRONT' })),
            sizes: (v.sizes || []).map((s) => ({ size: s.size, stock: s.stock || 0 })),
          }))
        );
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const updateField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const applyTemplate = (tpl) => {
    const keys = ['shortDescription', 'description', 'materialsInfo', 'shippingInfo'];
    setForm((prev) => {
      const next = { ...prev };
      for (const k of keys) {
        if (tpl[k]) next[k] = tpl[k];
        if (tpl[k + 'Ru']) next[k + 'Ru'] = tpl[k + 'Ru'];
        if (tpl[k + 'En']) next[k + 'En'] = tpl[k + 'En'];
      }
      return next;
    });
  };

  const updateVariant = useCallback((idx, field, value) => setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))), []);
  const addVariant = useCallback(() => setVariants((prev) => [...prev, { colorName: '', colorNameRu: '', colorNameEn: '', colorCode: '#000000', images: [{ url: '', type: 'FRONT' }, { url: '', type: 'BACK' }], sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }] }]), []);
  const removeVariant = useCallback((idx) => setVariants((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev), []);

  const updateVariantImage = useCallback((vIdx, imgIdx, url) => {
    setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, images: v.images.map((img, j) => j === imgIdx ? { ...img, url } : img) } : v));
  }, []);
  const addVariantImage = useCallback((vIdx) => setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, images: [...v.images, { url: '', type: 'DETAIL' }] } : v)), []);
  const removeVariantImage = useCallback((vIdx, imgIdx) => setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, images: v.images.filter((_, j) => j !== imgIdx) } : v)), []);

  const updateSize = useCallback((vIdx, sIdx, field, value) => {
    setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, sizes: v.sizes.map((s, j) => j === sIdx ? { ...s, [field]: field === 'stock' ? (value === '' ? '' : Math.max(0, parseInt(value, 10) || 0)) : value } : s) } : v));
  }, []);
  const addSize = useCallback((vIdx) => setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, sizes: [...v.sizes, { size: 'M', stock: 0 }] } : v)), []);
  const removeSize = useCallback((vIdx, sIdx) => setVariants((prev) => prev.map((v, i) => i === vIdx ? { ...v, sizes: v.sizes.filter((_, j) => j !== sIdx) } : v)), []);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
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
    } catch {
      alert('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Editează Produs</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">{form.name}</p>
        </div>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black cursor-pointer">← Înapoi</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Informații Generale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatableField
              label="Nume Produs" fieldKey="name" required
              value={form.name} valueRu={form.nameRu} valueEn={form.nameEn}
              onChange={updateField} apiFetch={apiFetch}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Preț (MDL) *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Preț Vechi (MDL) — reducere</label>
              <input name="compareAtPrice" type="number" step="0.01" value={form.compareAtPrice} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Categorie *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer" required>
                <option value="">Selectează...</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            {selectedCategory?.subcategories?.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Subcategorie</label>
                <select name="subcategoryId" value={form.subcategoryId} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer">
                  <option value="">Niciuna</option>
                  {selectedCategory.subcategories.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-5 mb-1">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Descrieri</h3>
            <TemplatePicker apiFetch={apiFetch} onApply={applyTemplate} />
          </div>

          <TranslatableField
            label="Descriere scurtă" fieldKey="shortDescription"
            value={form.shortDescription} valueRu={form.shortDescriptionRu} valueEn={form.shortDescriptionEn}
            onChange={updateField} apiFetch={apiFetch} className="mt-4"
          />
          <TranslatableField
            label="Descriere completă" fieldKey="description" multiline rows={4}
            value={form.description} valueRu={form.descriptionRu} valueEn={form.descriptionEn}
            onChange={updateField} apiFetch={apiFetch} className="mt-4"
          />
          <TranslatableField
            label="Detalii & Materiale" fieldKey="materialsInfo" multiline rows={3}
            value={form.materialsInfo} valueRu={form.materialsInfoRu} valueEn={form.materialsInfoEn}
            onChange={updateField} apiFetch={apiFetch} className="mt-4"
            placeholder="Material de înaltă calitate, produs în România..."
          />
          <TranslatableField
            label="Livrare & Returnare" fieldKey="shippingInfo" multiline rows={3}
            value={form.shippingInfo} valueRu={form.shippingInfoRu} valueEn={form.shippingInfoEn}
            onChange={updateField} apiFetch={apiFetch} className="mt-4"
            placeholder="Livrare standard: 70 MDL (3–5 zile lucrătoare)..."
          />
        </div>

        {/* Flags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Setări Produs</h2>
          <div className="flex flex-wrap gap-6">
            {[{ name: 'isActive', label: 'Activ' }, { name: 'isNew', label: 'Nou' }, { name: 'isBestseller', label: 'Bestseller' }, { name: 'isFeatured', label: 'Recomandat' }].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={flag.name} checked={form[flag.name]} onChange={handleChange} className="w-4 h-4 accent-black cursor-pointer" />
                <span className="text-sm text-gray-700">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-black">Variante de Culoare</h2>
            <button type="button" onClick={addVariant} className="text-xs text-black border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">+ Adaugă Culoare</button>
          </div>

          {variants.map((variant, vIdx) => (
            <VariantCard
              key={vIdx}
              variant={variant}
              vIdx={vIdx}
              canRemove={variants.length > 1}
              updateVariant={updateVariant}
              removeVariant={removeVariant}
              updateVariantImage={updateVariantImage}
              addVariantImage={addVariantImage}
              removeVariantImage={removeVariantImage}
              updateSize={updateSize}
              addSize={addSize}
              removeSize={removeSize}
              apiFetch={apiFetch}
            />
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer">
            {saving ? 'Se salvează...' : 'Actualizează Produs'}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black cursor-pointer">Anulează</button>
        </div>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  return <EditProductForm />;
}
