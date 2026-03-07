import { cache } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { products as staticProducts } from '@/lib/data/products';
import ProductDetailClient from './ProductDetailClient';

// ISR — regenerate at most every 60s; admin triggers /api/revalidate on product edit
export const revalidate = 60;

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

// cache() deduplicates calls within a single render pass
const getProduct = cache(async (slug) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          include: {
            images: { orderBy: { order: 'asc' } },
            sizes: true,
          },
        },
        category: true,
        subcategory: true,
        reviews: true,
      },
    });
    if (product) return product;
  } catch (e) {}

  // Fallback to static data (used at build time and when DB is unavailable)
  return staticProducts.find((p) => p.slug === slug) || null;
});

const getSimilarProducts = cache(async (product) => {
  const subcatId = product.subcategoryId;
  const catId = product.categoryId;

  try {
    // Try subcategory first, fallback to category
    const where = {
      id: { not: product.id },
      isActive: true,
      ...(subcatId ? { subcategoryId: subcatId } : { categoryId: catId }),
    };

    let similar = await prisma.product.findMany({
      where,
      take: 8,
      include: {
        variants: {
          include: {
            images: { orderBy: { order: 'asc' } },
            sizes: true,
          },
        },
        category: true,
        subcategory: true,
      },
    });

    // If not enough from subcategory, fill from category
    if (similar.length < 4 && subcatId) {
      const ids = similar.map((p) => p.id);
      const extra = await prisma.product.findMany({
        where: {
          id: { notIn: [...ids, product.id] },
          isActive: true,
          categoryId: catId,
        },
        take: 8 - similar.length,
        include: {
          variants: {
            include: {
              images: { orderBy: { order: 'asc' } },
              sizes: true,
            },
          },
          category: true,
          subcategory: true,
        },
      });
      similar = [...similar, ...extra];
    }

    if (similar.length > 0) return similar;
  } catch (e) {}

  // Fallback to static data
  const slug = product.slug;
  return staticProducts
    .filter((p) => p.slug !== slug && (subcatId ? p.subcategoryId === subcatId : p.categoryId === catId))
    .slice(0, 8);
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produs negăsit' };
  return {
    title: `${product.name} — SIMONA Fashion`,
    description: product.shortDescription || product.description?.substring(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const similarProducts = await getSimilarProducts(product);

  return <ProductDetailClient product={product} similarProducts={similarProducts} />;
}
