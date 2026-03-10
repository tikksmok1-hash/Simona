import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/db/queries';
import { createRateLimit } from '@/lib/rateLimit';

const searchLimit = createRateLimit({
  name: 'search',
  maxRequests: 30,          // 30 searches
  windowMs: 60 * 1000,      // per minute per IP
});

// GET /api/search?q=query — public product search
export async function GET(request) {
  const { success } = searchLimit(request);
  if (!success) {
    return NextResponse.json([], { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const products = await searchProducts(q, 6);
    // Return minimal data for search results
    const results = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.variants?.[0]?.images?.[0]?.url || null,
    }));
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}
