import { getBestsellerProducts, getAllCategories } from '@/lib/db/queries';
import BestsellersPageClient from './BestsellersPageClient';

// ISR — regenerate at most every 300s; admin can trigger /api/revalidate instantly
export const revalidate = 300;

export const metadata = {
  title: 'Bestsellers — SIMONA Fashion',
  description: 'Cele mai vândute produse din colecția SIMONA Fashion. Produsele preferate de clientele noastre.',
};

export default async function BestsellersPage() {
  const [bestsellerProducts, categories] = await Promise.all([
    getBestsellerProducts(),
    getAllCategories(),
  ]);

  const availableCategories = [...new Set(bestsellerProducts.map((p) => p.categorySlug))];

  return (
    <BestsellersPageClient
      bestsellerProducts={bestsellerProducts}
      categories={categories}
      availableCategories={availableCategories}
    />
  );
}