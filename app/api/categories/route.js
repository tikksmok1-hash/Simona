import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db/queries';
import { createRateLimit } from '@/lib/rateLimit';

const catLimit = createRateLimit({
  name: 'categories',
  maxRequests: 60,
  windowMs: 60 * 1000,
});

// Cache at the Next.js / Vercel edge level — revalidate every 5 min
export const revalidate = 300;

// GET /api/categories — public categories with subcategories (for navbar)
export async function GET(request) {
  const { success } = catLimit(request);
  if (!success) {
    return NextResponse.json([], { status: 429 });
  }
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json([]);
  }
}
