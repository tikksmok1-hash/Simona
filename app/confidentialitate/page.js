import { getStaticPage } from '@/lib/db/queries';
import { defaultPages } from '@/lib/data/defaultPages';
import { sanitizeHtml } from '@/lib/sanitize';
import LegalPageClient from '@/app/components/LegalPageClient';

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getStaticPage('confidentialitate');
  const title = page?.title || defaultPages.confidentialitate.title;
  return {
    title: `${title} — SIMONA Fashion`,
    description: 'Politica de confidențialitate și protecția datelor personale SIMONA Fashion.',
  };
}

export default async function ConfidentialitatePage() {
  const page = await getStaticPage('confidentialitate');
  const defaults = defaultPages.confidentialitate;
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
