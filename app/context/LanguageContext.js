'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation } from '@/lib/translations';

const LanguageContext = createContext({ lang: 'ro', setLang: () => {}, t: (k) => k });

const STORAGE_KEY = 'simona_lang';
const SUPPORTED = ['ro', 'ru', 'en'];

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ro');

  /* hydrate from localStorage once */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) setLangState(saved);
    } catch { /* SSR / private mode */ }
  }, []);

  const setLang = useCallback((l) => {
    if (!SUPPORTED.includes(l)) return;
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const t = useCallback((key) => getTranslation(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook that returns { lang, setLang, t }
 * t(key) → translated string
 */
export function useTranslation() {
  return useContext(LanguageContext);
}

export default LanguageContext;
