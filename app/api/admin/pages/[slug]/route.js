import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

const slugToPath = {
  confidentialitate: '/confidentialitate',
  termeni: '/termeni',
  livrare: '/livrare',
};

// GET /api/admin/pages/[slug] — get single static page
export async function GET(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { slug } = await params;
    const page = await prisma.staticPage.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json(null);
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page fetch error:', error);
    return NextResponse.json({ error: 'Eroare la citirea paginii' }, { status: 500 });
  }
}

// PUT /api/admin/pages/[slug] — update or create static page
export async function PUT(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { slug } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Titlul și conținutul sunt obligatorii' }, { status: 400 });
    }

    const page = await prisma.staticPage.upsert({
      where: { slug },
      update: { title, content },
      create: { slug, title, content },
    });

    // Revalidate the specific frontend page
    const pagePath = slugToPath[slug];
    if (pagePath) {
      revalidatePath(pagePath);
    }
    // Also revalidate layout in case footer links change
    revalidatePath('/', 'layout');

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Eroare la salvarea paginii' }, { status: 500 });
  }
}
