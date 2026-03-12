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

const LANGS = [
  { key: 'ro', label: 'RO', flag: '🇷🇴' },
  { key: 'ru', label: 'RU', flag: '🇷🇺' },
  { key: 'en', label: 'EN', flag: '🇬🇧' },
];

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
  const editorRefRo = useRef(null);
  const editorRefRu = useRef(null);
  const editorRefEn = useRef(null);

  const [title, setTitle] = useState(pageTitles[slug] || '');
  const [titleRu, setTitleRu] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [activeLang, setActiveLang] = useState('ro');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const [initialContentRu, setInitialContentRu] = useState('');
  const [initialContentEn, setInitialContentEn] = useState('');
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
          setTitle(data.title);
          setTitleRu(data.titleRu || '');
          setTitleEn(data.titleEn || '');
          setInitialContent(data.content);
          setInitialContentRu(data.contentRu || '');
          setInitialContentEn(data.contentEn || '');
        } else {
          const defaults = defaultPages[slug];
          if (defaults) {
            setTitle(defaults.title);
            setInitialContent(defaults.content);
          }
        }
      } else {
        // API returned an error — fall back to defaults
        const defaults = defaultPages[slug];
        if (defaults) {
          setTitle(defaults.title);
          setInitialContent(defaults.content);
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
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

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      // Translate title
      const targets = [
        { from: 'ro', to: 'ru', text: title },
        { from: 'ro', to: 'en', text: title },
      ];
      const titleResults = await Promise.all(
        targets.map(async ({ from, to, text }) => {
          if (!text) return null;
          const res = await apiFetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, from, to }),
          });
          if (res.ok) return (await res.json()).translated;
          return null;
        })
      );
      if (titleResults[0]) setTitleRu(titleResults[0]);
      if (titleResults[1]) setTitleEn(titleResults[1]);

      // Translate content
      const contentRo = editorRefRo.current?.getContent() || '';
      if (contentRo) {
        const contentResults = await Promise.all([
          apiFetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: contentRo, from: 'ro', to: 'ru' }),
          }).then(r => r.ok ? r.json() : null),
          apiFetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: contentRo, from: 'ro', to: 'en' }),
          }).then(r => r.ok ? r.json() : null),
        ]);
        if (contentResults[0]?.translated) {
          setInitialContentRu(contentResults[0].translated);
          // Force re-render of RU editor
          setContentReady(false);
          setTimeout(() => setContentReady(true), 50);
        }
        if (contentResults[1]?.translated) {
          setInitialContentEn(contentResults[1].translated);
          setContentReady(false);
          setTimeout(() => setContentReady(true), 50);
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
      alert('Eroare la traducere automată');
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const content = editorRefRo.current?.getContent() || '';
      const contentRu = editorRefRu.current?.getContent() || '';
      const contentEn = editorRefEn.current?.getContent() || '';

      const res = await apiFetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, titleRu, titleEn, content, contentRu, contentEn }),
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

  const editorRefs = { ro: editorRefRo, ru: editorRefRu, en: editorRefEn };
  const initialContents = { ro: initialContent, ru: initialContentRu, en: initialContentEn };
  const titles = { ro: title, ru: titleRu, en: titleEn };
  const setTitles = { ro: setTitle, ru: setTitleRu, en: setTitleEn };

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

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoTranslate}
            disabled={translating}
            className="px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {translating ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
            )}
            {translating ? 'Se traduce...' : 'Auto-traducere RU + EN'}
          </button>
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

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Pagina a fost salvată cu succes! Modificările vor apărea pe site imediat.
        </div>
      )}

      {/* Language Tabs */}
      <div className="flex gap-1 mb-4">
        {LANGS.map((l) => (
          <button
            key={l.key}
            onClick={() => setActiveLang(l.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeLang === l.key
                ? 'bg-white border border-b-white border-gray-200 text-black -mb-px relative z-10'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      {/* Title Input */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titlul Paginii ({activeLang.toUpperCase()})
        </label>
        <input
          type="text"
          value={titles[activeLang]}
          onChange={(e) => setTitles[activeLang](e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
          placeholder={activeLang === 'ro' ? 'Titlul paginii...' : activeLang === 'ru' ? 'Заголовок страницы...' : 'Page title...'}
        />
      </div>

      {/* Editor for each language */}
      {LANGS.map((l) => (
        <div key={l.key} className={`mb-4 ${activeLang === l.key ? '' : 'hidden'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conținut ({l.label})
          </label>
          {contentReady && (
            <RichTextEditor
              ref={editorRefs[l.key]}
              initialContent={initialContents[l.key]}
            />
          )}
        </div>
      ))}

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
