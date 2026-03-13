import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory, getProductsByCategoryAndSubcategory, getAllCategories } from '@/lib/db/queries';
import SubcategoryPageClient from '../../SubcategoryPageClient';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    const params = [];
    for (const cat of categories) {
      for (const sub of cat.subcategories ?? []) {
        params.push({ slug: cat.slug, subslug: sub.slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug, subslug } = await params;
  const category = await getCategoryBySlug(slug);
  const subcategory = category?.subcategories?.find((s) => s.slug === subslug);
  if (!category || !subcategory) return { title: 'Pagina nu a fost găsită' };
  return {
    title: `${subcategory.name} — ${category.name} | SIMONA Fashion`,
    description: subcategory.description,
  };
}

export default async function SubcategoryPage({ params }) {
  const { slug, subslug } = await params;

  const category = await getCategoryBySlug(slug);
  const subcategory = category?.subcategories?.find((s) => s.slug === subslug);
  if (!category || !subcategory) notFound();

  const [categoryProducts, allCategoryProducts] = await Promise.all([
    getProductsByCategoryAndSubcategory(slug, subslug),
    getProductsByCategory(slug),
  ]);

  // Only show subcategories that have at least one active product
  const activeSubcategories = category.subcategories?.filter((sub) =>
    allCategoryProducts.some((p) => p.subcategorySlug === sub.slug)
  ) ?? [];

  return (
    <SubcategoryPageClient
      category={category}
      subcategory={subcategory}
      categoryProducts={categoryProducts}
      activeSubcategories={activeSubcategories}
      subslug={subslug}
    />
  );
}
