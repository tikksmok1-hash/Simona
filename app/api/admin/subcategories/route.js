import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// POST /api/admin/subcategories
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();
    const sub = await prisma.subcategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        order: body.order || 0,
        isActive: body.isActive !== false,
        categoryId: body.categoryId,
      },
    });
    return NextResponse.json(sub, { status: 201 });
  } catch (error) {
    console.error('Subcategory POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
  }
}
