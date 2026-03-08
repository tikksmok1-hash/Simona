import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db/queries';

// GET /api/categories — public categories with subcategories (for navbar)
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json([]);
  }
}
