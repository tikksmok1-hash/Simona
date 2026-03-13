import { getSaleProducts, getAllCategories } from '@/lib/db/queries';
import ReduceriPageClient from './ReduceriPageClient';

// ISR — regenerate at most every 300s; admin can trigger /api/revalidate instantly
export const revalidate = 300;

export const metadata = {
  title: 'Reduceri — SIMONA Fashion',
  description: 'Toate produsele cu reducere din colecția SIMONA Fashion. Oferte speciale și prețuri reduse la rochii, bluze, pantaloni și accesorii.',
};

export default async function ReduceriPage() {
  const [saleProducts, categories] = await Promise.all([
    getSaleProducts(),
    getAllCategories(),
  ]);

  const maxDiscount = saleProducts.reduce((max, p) => {
    const d = Math.round((1 - p.price / p.compareAtPrice) * 100);
    return d > max ? d : max;
  }, 0);

  const totalSavings = saleProducts.reduce(
    (sum, p) => sum + (p.compareAtPrice - p.price),
    0
  );

  const availableCategories = [...new Set(saleProducts.map((p) => p.categorySlug))];

  return (
    <ReduceriPageClient
      saleProducts={saleProducts}
      categories={categories}
      availableCategories={availableCategories}
      maxDiscount={maxDiscount}
      totalSavings={totalSavings}
    />
  );
}
