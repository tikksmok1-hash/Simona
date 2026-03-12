'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminAuthContext';
import { livrareDefaults } from '@/lib/data/livrareDefaults';
import Link from 'next/link';

const LANGS = [
  { key: 'ro', label: 'RO', flag: '🇷🇴' },
  { key: 'ru', label: 'RU', flag: '🇷🇺' },
  { key: 'en', label: 'EN', flag: '🇬🇧' },
];

export default function LivrareEditor() {
  const { apiFetch } = useAdmin();
  const [title, setTitle] = useState('Livrare & Retur');
  const [titleRu, setTitleRu] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [dataRo, setDataRo] = useState(livrareDefaults);
  const [dataRu, setDataRu] = useState(livrareDefaults);
  const [dataEn, setDataEn] = useState(livrareDefaults);
  const [activeLang, setActiveLang] = useState('ro');
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const dataMap = { ro: dataRo, ru: dataRu, en: dataEn };
  const setDataMap = { ro: setDataRo, ru: setDataRu, en: setDataEn };
  const titleMap = { ro: title, ru: titleRu, en: titleEn };
  const setTitleMap = { ro: setTitle, ru: setTitleRu, en: setTitleEn };
  const data = dataMap[activeLang];
  const currentSetData = setDataMap[activeLang];

  useEffect(() => { loadPage(); }, []);

  const loadPage = async () => {
    try {
      const res = await apiFetch('/api/admin/pages/livrare');
      if (res.ok) {
        const page = await res.json();
        if (page) {
          setTitle(page.title);
          setTitleRu(page.titleRu || '');
          setTitleEn(page.titleEn || '');
          try { setDataRo(prev => ({ ...prev, ...JSON.parse(page.content) })); } catch {}
          try { if (page.contentRu) setDataRu(prev => ({ ...prev, ...JSON.parse(page.contentRu) })); } catch {}
          try { if (page.contentEn) setDataEn(prev => ({ ...prev, ...JSON.parse(page.contentEn) })); } catch {}
        }
      }
    } catch (error) {
      console.error('Error loading livrare:', error);
    } finally {
      setLoading(false);
    }
  };

  const translateText = async (text, to) => {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;
    try {
      const res = await apiFetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from: 'ro', to }),
      });
      if (res.ok) return (await res.json()).translated;
    } catch {}
    return text;
  };

  const translateStructuredData = async (sourceData, targetLang) => {
    const t = JSON.parse(JSON.stringify(sourceData));
    if (t.heroSubtitle) t.heroSubtitle = await translateText(t.heroSubtitle, targetLang);
    if (t.returnDescription) t.returnDescription = await translateText(t.returnDescription, targetLang);
    if (t.contactSubtitle) t.contactSubtitle = await translateText(t.contactSubtitle, targetLang);
    for (const opt of t.deliveryOptions || []) {
      if (opt.title) opt.title = await translateText(opt.title, targetLang);
      if (opt.subtitle) opt.subtitle = await translateText(opt.subtitle, targetLang);
      if (opt.description) opt.description = await translateText(opt.description, targetLang);
    }
    for (const step of t.steps || []) {
      if (step.title) step.title = await translateText(step.title, targetLang);
      if (step.description) step.description = await translateText(step.description, targetLang);
    }
    for (let i = 0; i < (t.returnItems || []).length; i++) {
      if (t.returnItems[i]) t.returnItems[i] = await translateText(t.returnItems[i], targetLang);
    }
    for (const card of t.returnCards || []) {
      if (card.title) card.title = await translateText(card.title, targetLang);
      if (card.description) card.description = await translateText(card.description, targetLang);
    }
    for (const faq of t.faqs || []) {
      if (faq.q) faq.q = await translateText(faq.q, targetLang);
      if (faq.a) faq.a = await translateText(faq.a, targetLang);
    }
    return t;
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const [ruTitle, enTitle] = await Promise.all([
        title ? translateText(title, 'ru') : '',
        title ? translateText(title, 'en') : '',
      ]);
      if (ruTitle) setTitleRu(ruTitle);
      if (enTitle) setTitleEn(enTitle);
      const [ruData, enData] = await Promise.all([
        translateStructuredData(dataRo, 'ru'),
        translateStructuredData(dataRo, 'en'),
      ]);
      setDataRu(ruData);
      setDataEn(enData);
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
      const res = await apiFetch('/api/admin/pages/livrare', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, titleRu, titleEn,
          content: JSON.stringify(dataRo),
          contentRu: JSON.stringify(dataRu),
          contentEn: JSON.stringify(dataEn),
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Eroare la salvare');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Eroare la salvarea paginii');
    } finally {
      setSaving(false);
    }
  };

  // Helper to update nested data (operates on active language)
  const updateField = (field, value) => currentSetData(prev => ({ ...prev, [field]: value }));
  const updateArrayItem = (field, index, key, value) => {
    currentSetData(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };
  const addArrayItem = (field, template) => {
    currentSetData(prev => ({ ...prev, [field]: [...prev[field], template] }));
  };
  const removeArrayItem = (field, index) => {
    currentSetData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const SaveButton = () => (
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
  );

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
          <Link href="/admin/pagini" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Pagini
          </Link>
          <h1 className="text-2xl font-serif font-light text-black">Editare: Livrare & Retur</h1>
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
          <SaveButton />
        </div>
      </div>

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

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pagina a fost salvată cu succes! Modificările vor apărea pe site imediat.
        </div>
      )}

      {/* Page Title */}
      <Section title="Titlu Pagină" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}>
        <Input label={`Titlul Paginii (${activeLang.toUpperCase()})`} value={titleMap[activeLang]} onChange={setTitleMap[activeLang]} placeholder="Livrare & Retur" />
        <Input label="Subtitlu Hero" value={data.heroSubtitle} onChange={(v) => updateField('heroSubtitle', v)} placeholder="Livrăm comenzile cu grijă..." />
      </Section>

      {/* Delivery Options */}
      <Section title="Opțiuni de Livrare" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.143-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}>
        {data.deliveryOptions.map((opt, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-lg mb-4 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Opțiunea {i + 1}</span>
              {data.deliveryOptions.length > 1 && (
                <button onClick={() => removeArrayItem('deliveryOptions', i)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Șterge
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Titlu" value={opt.title} onChange={(v) => updateArrayItem('deliveryOptions', i, 'title', v)} />
              <Input label="Subtitlu" value={opt.subtitle} onChange={(v) => updateArrayItem('deliveryOptions', i, 'subtitle', v)} />
              <Input label="Preț" value={opt.price} onChange={(v) => updateArrayItem('deliveryOptions', i, 'price', v)} />
            </div>
            <Textarea label="Descriere" value={opt.description} onChange={(v) => updateArrayItem('deliveryOptions', i, 'description', v)} rows={2} />
          </div>
        ))}
        <AddButton onClick={() => addArrayItem('deliveryOptions', { title: '', subtitle: '', price: '', description: '' })} label="Adaugă opțiune de livrare" />
      </Section>

      {/* Steps */}
      <Section title="Pași - Cum Funcționează" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}>
        {data.steps.map((step, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-lg mb-4 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pasul {i + 1}</span>
              {data.steps.length > 1 && (
                <button onClick={() => removeArrayItem('steps', i)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Șterge
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input label="Număr" value={step.number} onChange={(v) => updateArrayItem('steps', i, 'number', v)} />
              <div className="md:col-span-3">
                <Input label="Titlu" value={step.title} onChange={(v) => updateArrayItem('steps', i, 'title', v)} />
              </div>
            </div>
            <Textarea label="Descriere" value={step.description} onChange={(v) => updateArrayItem('steps', i, 'description', v)} rows={2} />
          </div>
        ))}
        <AddButton onClick={() => addArrayItem('steps', { number: String(data.steps.length + 1).padStart(2, '0'), title: '', description: '' })} label="Adaugă pas" />
      </Section>

      {/* Return Policy */}
      <Section title="Politica de Retur" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>}>
        <Textarea label="Descriere Retur" value={data.returnDescription} onChange={(v) => updateField('returnDescription', v)} rows={3} />
        
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Condiții de Retur</label>
        {data.returnItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const arr = [...data.returnItems];
                arr[i] = e.target.value;
                updateField('returnItems', arr);
              }}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
            {data.returnItems.length > 1 && (
              <button
                onClick={() => updateField('returnItems', data.returnItems.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:text-red-700 p-1"
              ><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            )}
          </div>
        ))}
        <button
          onClick={() => updateField('returnItems', [...data.returnItems, ''])}
          className="text-xs text-gray-500 hover:text-black transition-colors mt-1 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Adaugă condiție
        </button>
      </Section>

      {/* Return Steps Cards */}
      <Section title="Pași Retur (Carduri)" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>}>
        {data.returnCards.map((card, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Card {i + 1}</span>
              {data.returnCards.length > 1 && (
                <button onClick={() => removeArrayItem('returnCards', i)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Șterge
                </button>
              )}
            </div>
            <Input label="Titlu" value={card.title} onChange={(v) => updateArrayItem('returnCards', i, 'title', v)} />
            <Textarea label="Descriere" value={card.description} onChange={(v) => updateArrayItem('returnCards', i, 'description', v)} rows={2} />
          </div>
        ))}
        <AddButton onClick={() => addArrayItem('returnCards', { title: '', description: '' })} label="Adaugă card retur" />
      </Section>

      {/* FAQ */}
      <Section title="Întrebări Frecvente (FAQ)" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}>
        {data.faqs.map((faq, i) => (
          <div key={i} className="p-4 border border-gray-100 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Întrebarea {i + 1}</span>
              {data.faqs.length > 1 && (
                <button onClick={() => removeArrayItem('faqs', i)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Șterge
                </button>
              )}
            </div>
            <Input label="Întrebare" value={faq.q} onChange={(v) => updateArrayItem('faqs', i, 'q', v)} />
            <Textarea label="Răspuns" value={faq.a} onChange={(v) => updateArrayItem('faqs', i, 'a', v)} rows={2} />
          </div>
        ))}
        <AddButton onClick={() => addArrayItem('faqs', { q: '', a: '' })} label="Adaugă întrebare" />
      </Section>

      {/* Contact CTA */}
      <Section title="Secțiunea Contact" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}>
        <Textarea label="Subtitlu Contact" value={data.contactSubtitle} onChange={(v) => updateField('contactSubtitle', v)} rows={2} />
        <p className="text-xs text-gray-400 mt-1">Email-ul și telefonul se preiau automat din Setări Site.</p>
      </Section>

      {/* Bottom Save + Preview */}
      <div className="flex items-center justify-between mt-6 mb-10">
        <p className="text-sm text-gray-400">
          Previzualizare:{' '}
          <a href="/livrare" target="_blank" rel="noopener noreferrer" className="text-black underline underline-offset-2 hover:no-underline">/livrare</a>
        </p>
        <SaveButton />
      </div>
    </div>
  );
}

// ==================== Reusable sub-components ====================

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-5">
      <h2 className="text-lg font-medium text-black mb-5 flex items-center gap-2.5">
        <span className="text-gray-400">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
      />
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-1.5"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      {label}
    </button>
  );
}
