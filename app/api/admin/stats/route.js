import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/stats — dashboard stats
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const [productsCount, categoriesCount, ordersCount, blogCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.blogPost.count(),
    ]);

    return NextResponse.json({
      products: productsCount,
      categories: categoriesCount,
      orders: ordersCount,
      blog: blogCount,
    });
  } catch (error) {
    return NextResponse.json({
      products: 0,
      categories: 0,
      orders: 0,
      blog: 0,
    });
  }
}
