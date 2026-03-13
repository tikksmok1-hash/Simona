import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getSimilarProducts, getAllProductSlugs } from '@/lib/db/queries';
import ProductDetailClient from './ProductDetailClient';

// ISR — cache for 5 min; admin triggers /api/revalidate on product edit for instant updates
export const revalidate = 300;

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

// Helper: get the LCP image URL from the first variant
function getLcpImageUrl(product) {
  const firstVariant = product?.variants?.[0];
  const firstImage = firstVariant?.images?.[0];
  return firstImage?.url || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produs negăsit' };

  const lcpUrl = getLcpImageUrl(product);

  return {
    title: `${product.name} — SIMONA Fashion`,
    description: product.shortDescription || product.description?.substring(0, 160),
    ...(lcpUrl && {
      openGraph: {
        images: [{ url: lcpUrl }],
      },
    }),
  };
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = await params;
  const { variant } = await searchParams;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Start fetching similar products (don't await yet)
  const similarProductsPromise = getRelatedProducts(product);

  // Preload LCP image — browser discovers it immediately from HTML
  const lcpUrl = getLcpImageUrl(product);

  const similarProducts = await similarProductsPromise;

  return (
    <>
      {lcpUrl && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(lcpUrl)}&w=828&q=75`}
          // @ts-ignore
          fetchPriority="high"
        />
      )}
      <ProductDetailClient product={product} similarProducts={similarProducts} initialVariantId={variant} />
    </>
  );
}
