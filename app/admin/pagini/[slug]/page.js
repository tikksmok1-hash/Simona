'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdmin } from '../../AdminAuthContext';
import RichTextEditor from '../../components/RichTextEditor';
import LivrareEditor from '../LivrareEditor';
import { defaultPages } from '@/lib/data/defaultPages';
import Link from 'next/link';

const pageTitles = {
  confidentialitate: 'Politica de Confidențialitate',
  termeni: 'Termeni și Condiții',
  livrare: 'Livrare & Retur',
};

export default function EditPagePage() {
  const { slug } = useParams();

  // For livrare, use the dedicated structured editor
  if (slug === 'livrare') {
    return <LivrareEditor />;
  }

  return <RichTextPageEditor slug={slug} />;
}

function RichTextPageEditor({ slug }) {
  const { apiFetch } = useAdmin();
  const editorRef = useRef(null);

  const [title, setTitle] = useState(pageTitles[slug] || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const res = await apiFetch(`/api/admin/pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          // Page exists in DB
          setTitle(data.title);
          setInitialContent(data.content);
        } else {
          // Page not in DB, use defaults
          const defaults = defaultPages[slug];
          if (defaults) {
            setTitle(defaults.title);
            setInitialContent(defaults.content);
          }
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
      // Fall back to defaults
      const defaults = defaultPages[slug];
      if (defaults) {
        setTitle(defaults.title);
        setInitialContent(defaults.content);
      }
    } finally {
      setLoading(false);
      setContentReady(true);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    setSaving(true);
    setSuccess(false);

    try {
      const content = editorRef.current.getContent();

      const res = await apiFetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Eroare la salvare');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Eroare la salvarea paginii');
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pagini"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Pagini
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-light text-black">Editare Pagină</h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              Salvează
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Pagina a fost salvată cu succes! Modificările vor apărea pe site imediat.
        </div>
      )}

      {/* Title Input */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titlul Paginii
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          placeholder="Titlul paginii..."
        />
      </div>

      {/* Editor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conținut
        </label>
        {contentReady && (
          <RichTextEditor
            ref={editorRef}
            initialContent={initialContent}
          />
        )}
      </div>

      {/* Preview link */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <p>
          Previzualizare:{' '}
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline underline-offset-2 hover:no-underline"
          >
            /{slug}
          </a>
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              Salvează
            </>
          )}
        </button>
      </div>
    </div>
  );
}
