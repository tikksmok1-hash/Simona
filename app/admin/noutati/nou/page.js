'use client';

import { useState } from 'react';
import { useAdmin } from '../../AdminAuthContext';
import ImageUploader from '../../components/ImageUploader';
import TranslatableField from '../../components/TranslatableField';
import { useRouter } from 'next/navigation';

function NewBlogForm() {
  const { apiFetch } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    titleRu: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    excerptRu: '',
    excerptEn: '',
    image: '',
    category: 'Tendințe',
    categoryRu: '',
    categoryEn: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min',
    author: 'Simona',
    isFeatured: false,
    videoUrl: '',
  });

  const [sections, setSections] = useState([
    { heading: '', headingRu: '', headingEn: '', body: '', bodyRu: '', bodyEn: '', image: '', videoUrl: '' },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'title') {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[ăâ]/g, 'a').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[î]/g, 'i').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    }
  };

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === 'title') {
      setForm((prev) => ({
        ...prev,
        slug: val.toLowerCase().replace(/[ăâ]/g, 'a').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[î]/g, 'i').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    }
  };

  const updateSection = (idx, field, value) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addSection = () => setSections((prev) => [...prev, { heading: '', headingRu: '', headingEn: '', body: '', bodyRu: '', bodyEn: '', image: '', videoUrl: '' }]);
  const removeSection = (idx) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { alert('Titlul este obligatoriu.'); return; }

    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/blog', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          sections: sections.filter((s) => s.heading || s.body),
        }),
      });
      if (res.ok) {
        router.push('/admin/noutati');
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Articol Nou</h1>
          <p className="text-sm text-gray-500 mt-1">Creează un articol blog / noutate.</p>
        </div>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black cursor-pointer">← Înapoi</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Informații Articol</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslatableField
              label="Titlu" fieldKey="title" required
              value={form.title} valueRu={form.titleRu} valueEn={form.titleEn}
              onChange={updateField} apiFetch={apiFetch}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
            </div>
            <TranslatableField
              label="Categorie" fieldKey="category"
              value={form.category} valueRu={form.categoryRu} valueEn={form.categoryEn}
              onChange={updateField} apiFetch={apiFetch}
              placeholder="ex. Tendințe, Sfaturi de Stil..."
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Data</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Timp Citire</label>
              <input name="readTime" value={form.readTime} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="5 min" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Autor</label>
              <input name="author" value={form.author} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>
          <TranslatableField
            label="Rezumat (excerpt)" fieldKey="excerpt" multiline rows={3}
            value={form.excerpt} valueRu={form.excerptRu} valueEn={form.excerptEn}
            onChange={updateField} apiFetch={apiFetch} className="mt-4"
          />
          <div className="mt-4">
            <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Imagine Hero" />
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-black cursor-pointer" />
            <span className="text-sm text-gray-700">Featured (afișat mare pe pagina de Noutăți)</span>
          </label>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Link Video YouTube (opțional)</label>
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-black">Secțiuni Articol</h2>
            <button type="button" onClick={addSection} className="text-xs text-black border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer">
              + Adaugă Secțiune
            </button>
          </div>

          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Secțiunea #{idx + 1}</h3>
                {sections.length > 1 && (
                  <button type="button" onClick={() => removeSection(idx)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Șterge Secțiune</button>
                )}
              </div>
              <div className="space-y-3">
                <TranslatableField
                  label="Titlu Secțiune" fieldKey="heading"
                  value={section.heading} valueRu={section.headingRu || ''} valueEn={section.headingEn || ''}
                  onChange={(key, val) => updateSection(idx, key, val)}
                  apiFetch={apiFetch}
                />
                <TranslatableField
                  label="Conținut" fieldKey="body" multiline rows={5}
                  value={section.body} valueRu={section.bodyRu || ''} valueEn={section.bodyEn || ''}
                  onChange={(key, val) => updateSection(idx, key, val)}
                  apiFetch={apiFetch}
                />
                <ImageUploader value={section.image} onChange={(url) => updateSection(idx, 'image', url)} label="Imagine Secțiune (opțional)" />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Link Video YouTube (opțional)</label>
                  <input value={section.videoUrl || ''} onChange={(e) => updateSection(idx, 'videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer">
            {saving ? 'Se salvează...' : 'Publică Articol'}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black cursor-pointer">Anulează</button>
        </div>
      </form>
    </div>
  );
}

export default function NewBlogPage() {
  return <NewBlogForm />;
}
