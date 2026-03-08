'use client';

import { useState } from 'react';
import { useAdmin } from '../../AdminAuthContext';
import ImageUploader from '../../components/ImageUploader';
import { useRouter } from 'next/navigation';

function NewBlogForm() {
  const { apiFetch } = useAdmin();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    image: '',
    category: 'Tendințe',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min',
    author: 'Simona',
    isFeatured: false,
    videoUrl: '',
  });

  const [sections, setSections] = useState([
    { heading: '', body: '', image: '' },
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

  const updateSection = (idx, field, value) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addSection = () => setSections((prev) => [...prev, { heading: '', body: '', image: '' }]);
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
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Titlu *</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Categorie</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="ex. Tendințe, Sfaturi de Stil..." />
            </div>
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
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Rezumat (excerpt)</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>
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
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Titlu Secțiune</label>
                  <input value={section.heading} onChange={(e) => updateSection(idx, 'heading', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Conținut</label>
                  <textarea value={section.body} onChange={(e) => updateSection(idx, 'body', e.target.value)} rows={5} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
                </div>
                <ImageUploader value={section.image} onChange={(url) => updateSection(idx, 'image', url)} label="Imagine Secțiune (opțional)" />
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
