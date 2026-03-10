import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/pages — list all static pages
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const pages = await prisma.staticPage.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        updatedAt: true,
      },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Pages fetch error:', error);
    return NextResponse.json({ error: 'Eroare la citirea paginilor' }, { status: 500 });
  }
}
