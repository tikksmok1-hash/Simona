'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminAuthContext';
import Image from 'next/image';

export default function SetariPage() {
  const { apiFetch } = useAdmin();
  const [settings, setSettings] = useState({
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
    heroTitle: 'Descoperă',
    heroSubtitle: 'Stilul Tău',
    heroLabel: 'Colecția Primăvară 2026',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        // Revalidate home page
        await fetch('/api/revalidate?path=/');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setSettings(prev => ({ ...prev, heroImage: url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-black">Setări Site</h1>
        <p className="text-sm text-gray-500 mt-1">Personalizează pagina principală</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          ✓ Setările au fost salvate cu succes!
        </div>
      )}

      {/* Hero Section Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-black mb-6">Secțiunea Hero (Prima Pagină)</h2>
        
        {/* Hero Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagine de Fundal
          </label>
          <div className="flex gap-4 items-start">
            <div className="relative w-64 h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {settings.heroImage ? (
                <Image
                  src={settings.heroImage}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer">
                <div className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${uploading ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}>
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Se încarcă...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Încarcă imagine nouă
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recomandat: 1920x1080px sau mai mare. Format: JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Hero URL input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            sau URL Imagine Externă
          </label>
          <input
            type="text"
            value={settings.heroImage}
            onChange={(e) => setSettings(prev => ({ ...prev, heroImage: e.target.value }))}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Hero Label */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label (Text Mic de Sus)
          </label>
          <input
            type="text"
            value={settings.heroLabel}
            onChange={(e) => setSettings(prev => ({ ...prev, heroLabel: e.target.value }))}
            placeholder="Colecția Primăvară 2026"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        {/* Hero Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titlu Principal
            </label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
              placeholder="Descoperă"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitlu (Italic)
            </label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
              placeholder="Stilul Tău"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvează Setările
            </>
          )}
        </button>
      </div>
    </div>
  );
}
