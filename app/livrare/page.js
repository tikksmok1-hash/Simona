import { getStaticPage } from '@/lib/db/queries';
import { getSiteSettings } from '@/lib/db/queries';
import { livrareDefaults } from '@/lib/data/livrareDefaults';
import LivrarePageClient from './LivrarePageClient';

export const revalidate = 60;

function parseLivrareData(page) {
  if (!page) return { title: 'Livrare & Retur', ...livrareDefaults };
  try {
    const parsed = JSON.parse(page.content);
    return { title: page.title, ...livrareDefaults, ...parsed };
  } catch {
    return { title: page.title || 'Livrare & Retur', ...livrareDefaults };
  }
}

function parseLivrareDataLang(page, field) {
  if (!page || !page[field]) return null;
  try {
    const parsed = JSON.parse(page[field]);
    return { ...livrareDefaults, ...parsed };
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const page = await getStaticPage('livrare');
  const data = parseLivrareData(page);
  return {
    title: `${data.title} — SIMONA Fashion`,
    description: 'Informații despre livrare, costuri, termene și politica de retur SIMONA Fashion.',
  };
}

export default async function LivrarePage() {
  const [page, settings] = await Promise.all([
    getStaticPage('livrare'),
    getSiteSettings(),
  ]);

  const d = parseLivrareData(page);
  const dRu = parseLivrareDataLang(page, 'contentRu');
  const dEn = parseLivrareDataLang(page, 'contentEn');
  const email = settings.email || 'simona.md_info@mail.ru';
  const phone1 = settings.phone1 || '062 000 160';
  const phone1Intl = '+373' + phone1.replace(/\s+/g, '').replace(/^0/, '');

  return (
    <LivrarePageClient
      d={d}
      dRu={dRu ? { ...dRu, title: page?.titleRu || '' } : null}
      dEn={dEn ? { ...dEn, title: page?.titleEn || '' } : null}
      email={email}
      phone1={phone1}
      phone1Intl={phone1Intl}
    />
  );
}
