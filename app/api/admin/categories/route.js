import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { createRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

const writeLimit = createRateLimit({
  name: 'admin-categories-write',
  maxRequests: 20,
  windowMs: 10 * 60 * 1000,
});

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

  const { success, retryAfter } = writeLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe cereri. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        nameRu: body.nameRu || null,
        nameEn: body.nameEn || null,
        slug: body.slug,
        description: body.description || null,
        descriptionRu: body.descriptionRu || null,
        descriptionEn: body.descriptionEn || null,
        image: body.image || null,
        order: body.order || 0,
        isActive: body.isActive !== false,
      },
    });
    await logAudit(request, { action: 'CATEGORY_CREATE', details: `Categorie creată: ${category.name}`, userId: user.id, userEmail: user.email });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Category POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
  }
}
