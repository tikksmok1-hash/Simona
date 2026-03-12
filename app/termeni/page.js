import { getStaticPage } from '@/lib/db/queries';
import { defaultPages } from '@/lib/data/defaultPages';
import { sanitizeHtml } from '@/lib/sanitize';
import LegalPageClient from '@/app/components/LegalPageClient';

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
    <LegalPageClient
      title={title}
      titleRu={page?.titleRu || ''}
      titleEn={page?.titleEn || ''}
      sanitizedContent={sanitizeHtml(content)}
      sanitizedContentRu={page?.contentRu ? sanitizeHtml(page.contentRu) : ''}
      sanitizedContentEn={page?.contentEn ? sanitizeHtml(page.contentEn) : ''}
    />
  );
}
