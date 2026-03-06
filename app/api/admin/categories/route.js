import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/categories — list all
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { subcategories: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST /api/admin/categories — create
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        order: body.order || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Category POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
  }
}
