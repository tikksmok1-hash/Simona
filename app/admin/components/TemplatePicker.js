'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * TemplatePicker — dropdown that loads templates and lets user apply one
 * to fill in description fields.
 *
 * Props:
 *  - apiFetch — from AdminAuthContext
 *  - onApply(template) — called with the full template object; parent fills form fields
 */
export default function TemplatePicker({ apiFetch, onApply }) {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!loaded) {
      apiFetch('/api/admin/templates')
        .then((r) => r.json())
        .then((data) => {
          setTemplates(Array.isArray(data) ? data : []);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
    setOpen(!open);
  };

  const handleApply = (tpl) => {
    onApply(tpl);
    setOpen(false);
  };

  // Summary: what fields does a template cover
  const fieldBadges = (tpl) => {
    const badges = [];
    if (tpl.shortDescription) badges.push('Desc. scurtă');
    if (tpl.description) badges.push('Desc. completă');
    if (tpl.materialsInfo) badges.push('Materiale');
    if (tpl.shippingInfo) badges.push('Livrare');
    return badges;
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:border-black hover:text-black transition-colors cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        Aplică Șablon
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {!loaded ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-gray-400 mb-2">Niciun șablon creat.</p>
              <a href="/admin/sabloane" className="text-xs text-black underline">
                Creează un Șablon →
              </a>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[10px] tracking-wider uppercase text-gray-400">Selectează un șablon</p>
              </div>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleApply(tpl)}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                >
                  <p className="text-sm font-medium text-black">{tpl.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fieldBadges(tpl).map((b) => (
                      <span key={b} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tracking-wide">{b}</span>
                    ))}
                  </div>
                </button>
              ))}
              <div className="px-3 py-2 border-t border-gray-100">
                <a href="/admin/sabloane" className="text-[10px] text-gray-400 hover:text-black transition-colors tracking-wider uppercase">
                  Gestionează Șabloane →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
