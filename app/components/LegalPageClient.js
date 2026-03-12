'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/context/LanguageContext';

export default function LegalPageClient({ title, titleRu, titleEn, sanitizedContent, sanitizedContentRu, sanitizedContentEn }) {
  const { lang, t } = useTranslation();

  // Pick localized content based on active language
  const localTitle = (lang === 'ru' && titleRu) ? titleRu : (lang === 'en' && titleEn) ? titleEn : title;
  const localContent = (lang === 'ru' && sanitizedContentRu) ? sanitizedContentRu : (lang === 'en' && sanitizedContentEn) ? sanitizedContentEn : sanitizedContent;

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px] pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">{t('common.home')}</Link>
            <span>/</span>
            <span className="text-black">{localTitle}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">{t('common.legal')}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black">{localTitle}</h1>
        </div>

        {/* Content */}
        <div className="page-content" dangerouslySetInnerHTML={{ __html: localContent }} />
      </div>
    </div>
  );
}
