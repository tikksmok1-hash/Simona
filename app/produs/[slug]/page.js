import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getSimilarProducts, getAllProductSlugs } from '@/lib/db/queries';
import ProductDetailClient from './ProductDetailClient';

// ISR — regenerate at most every 60s; admin triggers /api/revalidate on product edit
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// cache() deduplicates calls within a single render pass
const getProduct = cache(async (slug) => {
  try {
    return await getProductBySlug(slug);
  } catch (e) {
    console.error('Product fetch error:', e);
    return null;
  }
});

const getRelatedProducts = cache(async (product) => {
  try {
    return await getSimilarProducts(product, 8);
  } catch (e) {
    console.error('Similar products fetch error:', e);
    return [];
  }
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

  const similarProducts = await getRelatedProducts(product);

  return <ProductDetailClient product={product} similarProducts={similarProducts} />;
}
