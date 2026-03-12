'use client';

import { useState, useCallback } from 'react';

/**
 * Reusable component that wraps a text field with RO/RU/EN tabs
 * and an auto-translate button.
 *
 * Props:
 *  - label: string — field label
 *  - value: string — RO value (main)
 *  - valueRu: string
 *  - valueEn: string
 *  - onChange(field, value) — callback e.g. ('name', 'val') or ('nameRu', 'val')
 *  - fieldKey: string — base field key (e.g., 'name', 'description')
 *  - multiline: bool — if true, render textarea
 *  - rows: number — textarea rows (default 3)
 *  - placeholder: string
 *  - required: bool
 *  - apiFetch: function — from AdminAuthContext
 *  - className: string — extra wrapper className
 */
export default function TranslatableField({
  label,
  value = '',
  valueRu = '',
  valueEn = '',
  onChange,
  fieldKey,
  multiline = false,
  rows = 3,
  placeholder = '',
  required = false,
  apiFetch,
  className = '',
}) {
  const [tab, setTab] = useState('ro');
  const [translating, setTranslating] = useState(false);

  const ruKey = fieldKey + 'Ru';
  const enKey = fieldKey + 'En';

  const currentValue = tab === 'ro' ? value : tab === 'ru' ? valueRu : valueEn;
  const currentFieldKey = tab === 'ro' ? fieldKey : tab === 'ru' ? ruKey : enKey;

  const handleTranslate = useCallback(async () => {
    if (!value?.trim()) {
      alert('Completează mai întâi câmpul în limba română (RO).');
      return;
    }

    setTranslating(true);
    try {
      const targets = [];
      if (!valueRu?.trim()) targets.push({ lang: 'ru', key: ruKey });
      if (!valueEn?.trim()) targets.push({ lang: 'en', key: enKey });

      // If both already filled, translate all anyway
      if (targets.length === 0) {
        targets.push({ lang: 'ru', key: ruKey });
        targets.push({ lang: 'en', key: enKey });
      }

      const results = await Promise.all(
        targets.map(async ({ lang, key }) => {
          const res = await apiFetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: value, from: 'ro', to: lang }),
          });
          if (res.ok) {
            const data = await res.json();
            return { key, text: data.translated };
          }
          return null;
        })
      );

      for (const r of results) {
        if (r) onChange(r.key, r.text);
      }
    } catch (err) {
      console.error('Translate error:', err);
      alert('Eroare la traducere automată.');
    } finally {
      setTranslating(false);
    }
  }, [value, valueRu, valueEn, apiFetch, onChange, ruKey, enKey]);

  const tabs = [
    { key: 'ro', label: 'RO', flag: '🇷🇴' },
    { key: 'ru', label: 'RU', flag: '🇷🇺' },
    { key: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-gray-600">
          {label} {required && '*'}
        </label>
        <div className="flex items-center gap-1">
          {/* Language tabs */}
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors cursor-pointer ${
                tab === t.key
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t.flag} {t.label}
            </button>
          ))}
          {/* Auto-translate button */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating || !value?.trim()}
            className="ml-1 px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            title="Traducere automată din RO → RU, EN"
          >
            {translating ? (
              <span className="inline-block w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
            )}
            Auto
          </button>
        </div>
      </div>

      <InputTag
        value={currentValue}
        onChange={(e) => onChange(currentFieldKey, e.target.value)}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black ${
          tab !== 'ro' ? 'border-gray-300 bg-gray-50/50' : 'border-gray-200'
        }`}
        placeholder={
          tab === 'ro'
            ? placeholder
            : tab === 'ru'
            ? placeholder ? `${placeholder} (RU)` : 'Traducere în rusă...'
            : placeholder ? `${placeholder} (EN)` : 'English translation...'
        }
        required={tab === 'ro' && required}
        {...(multiline ? { rows } : { type: 'text' })}
        style={multiline ? { resize: 'none' } : undefined}
      />

      {/* Small indicator for other languages */}
      {tab === 'ro' && (valueRu || valueEn) && (
        <div className="flex gap-2 mt-1">
          {valueRu && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">🇷🇺 RU ✓</span>}
          {valueEn && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">🇬🇧 EN ✓</span>}
        </div>
      )}
    </div>
  );
}
