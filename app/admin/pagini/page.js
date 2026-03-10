'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminAuthContext';
import Link from 'next/link';

const pageDefinitions = [
  {
    slug: 'confidentialitate',
    label: 'Politica de Confidențialitate',
    description: 'Informații despre colectarea și protecția datelor personale',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    slug: 'termeni',
    label: 'Termeni și Condiții',
    description: 'Condițiile de utilizare a site-ului și regulile de achiziție',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    slug: 'livrare',
    label: 'Livrare & Retur',
    description: 'Informații despre livrare, costuri, termene și politica de retur',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export default function PaginiPage() {
  const { apiFetch } = useAdmin();
  const [dbPages, setDbPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const res = await apiFetch('/api/admin/pages');
      if (res.ok) {
        const data = await res.json();
        setDbPages(data);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDbPage = (slug) => dbPages.find(p => p.slug === slug);

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
        <h1 className="text-2xl font-serif font-light text-black">Pagini</h1>
        <p className="text-sm text-gray-500 mt-1">Editează conținutul paginilor statice ale site-ului</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageDefinitions.map((page) => {
          const dbPage = getDbPage(page.slug);
          return (
            <Link
              key={page.slug}
              href={`/admin/pagini/${page.slug}`}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
            >
              <div className="text-gray-400 group-hover:text-black transition-colors mb-4">
                {page.icon}
              </div>
              <h2 className="font-medium text-black mb-1">{page.label}</h2>
              <p className="text-xs text-gray-400 mb-4">{page.description}</p>
              <div className="flex items-center justify-between">
                {dbPage ? (
                  <span className="text-[10px] tracking-widest uppercase text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Salvată
                  </span>
                ) : (
                  <span className="text-[10px] tracking-widest uppercase text-amber-500">
                    — Implicit
                  </span>
                )}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Notă:</strong> Paginile care nu au fost încă editate vor afișa conținutul implicit.
          Apasă pe o pagină pentru a o edita cu editorul vizual.
        </p>
      </div>
    </div>
  );
}
