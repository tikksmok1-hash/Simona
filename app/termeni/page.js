import Link from 'next/link';
import { getStaticPage } from '@/lib/db/queries';
import { defaultPages } from '@/lib/data/defaultPages';

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getStaticPage('termeni');
  const title = page?.title || defaultPages.termeni.title;
  return {
    title: `${title} — SIMONA Fashion`,
    description: 'Termenii și condițiile de utilizare a site-ului SIMONA Fashion.',
  };
}

export default async function TermeniPage() {
  const page = await getStaticPage('termeni');
  const defaults = defaultPages.termeni;
  const title = page?.title || defaults.title;
  const content = page?.content || defaults.content;

  return (
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px] pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-widest uppercase">
            <Link href="/" className="hover:text-black transition-colors">Acasă</Link>
            <span>/</span>
            <span className="text-black">{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black">{title}</h1>
        </div>

        {/* Content */}
        <div className="page-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
