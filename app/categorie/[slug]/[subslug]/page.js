import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import CategoryFilters from '../../CategoryFilters';

export const revalidate = 60;

export async function generateStaticParams() {
  const params = [];
  for (const cat of categories) {
    for (const sub of cat.subcategories ?? []) {
      params.push({ slug: cat.slug, subslug: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, subslug } = await params;
  const category = categories.find((c) => c.slug === slug);
  const subcategory = category?.subcategories?.find((s) => s.slug === subslug);
  if (!category || !subcategory) return { title: 'Pagina nu a fost găsită' };
  return {
    title: `${subcategory.name} — ${category.name} | SIMONA Fashion`,
    description: subcategory.description,
  };
}

export default async function SubcategoryPage({ params }) {
  const { slug, subslug } = await params;

  const category = categories.find((c) => c.slug === slug);
  const subcategory = category?.subcategories?.find((s) => s.slug === subslug);
  if (!category || !subcategory) notFound();

  const categoryProducts = products.filter(
    (p) => p.isActive && p.categorySlug === slug && p.subcategorySlug === subslug
  );

  // Only show subcategories that have at least one active product
  const activeSubcategories = category.subcategories?.filter((sub) =>
    products.some((p) => p.isActive && p.categorySlug === slug && p.subcategorySlug === sub.slug)
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
          <Link
            href={`/categorie/${category.slug}`}
            className="text-neutral-500 hover:text-black transition-colors"
          >
            {category.name}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-black">{subcategory.name}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-neutral-400 text-sm tracking-widest uppercase mb-2">
            {category.name}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-black mb-4">
            {subcategory.name}
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">{subcategory.description}</p>
        </div>
      </div>

      {/* Sibling Subcategory Tabs */}
      {activeSubcategories.length > 0 && (
        <div className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/categorie/${category.slug}`}
                className="px-5 py-2 text-sm tracking-wide border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
              >
                Toate
              </Link>
              {activeSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categorie/${category.slug}/${sub.slug}`}
                  className={`px-5 py-2 text-sm tracking-wide border transition-colors ${
                    sub.slug === subslug
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                  }`}
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
        activeSubslug={subslug}
      />
    </div>
  );
}
