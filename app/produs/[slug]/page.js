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

  return <ProductDetailClient product={product} />;
}
