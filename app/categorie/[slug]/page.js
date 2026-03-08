import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/db/queries';
import CategoryFilters from '../CategoryFilters';

export const revalidate = 60;

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
    <div className="min-h-screen bg-white pt-[112px] md:pt-[170px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-black transition-colors">
            Acasă
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-black">{category.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black mb-4">
            {category.name}
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">{category.description}</p>
        </div>
      </div>

      {/* Subcategory Tabs */}
      {activeSubcategories.length > 0 && (
        <div className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/categorie/${category.slug}`}
                className="px-5 py-2 text-sm tracking-wide border border-black bg-black text-white"
              >
                Toate
              </Link>
              {activeSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categorie/${category.slug}/${sub.slug}`}
                  className="px-5 py-2 text-sm tracking-wide border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters + Grid (Client Component) */}
      <CategoryFilters
        categoryProducts={categoryProducts}
        category={{ ...category, subcategories: activeSubcategories }}
        activeSubslug={null}
      />
    </div>
  );
}
