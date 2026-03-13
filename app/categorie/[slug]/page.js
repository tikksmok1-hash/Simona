import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/db/queries';
import CategoryPageClient from '../CategoryPageClient';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Categorie negăsită' };
  return {
    title: `${category.name} — SIMONA Fashion`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = await getProductsByCategory(slug);

  // Only show subcategories that have at least one active product
  const activeSubcategories = category.subcategories?.filter((sub) =>
    categoryProducts.some((p) => p.subcategorySlug === sub.slug)
  ) ?? [];

  return (
    <CategoryPageClient
      category={category}
      categoryProducts={categoryProducts}
      activeSubcategories={activeSubcategories}
    />
  );
}
