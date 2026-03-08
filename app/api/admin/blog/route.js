import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/blog — list all
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { date: 'desc' },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST /api/admin/blog — create
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        image: body.image || null,
        category: body.category || 'General',
        date: new Date(body.date || Date.now()),
        readTime: body.readTime || '5 min',
        author: body.author || 'Simona',
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== false,
        videoUrl: body.videoUrl || null,
        sections: {
          create: (body.sections || []).map((s, i) => ({
            heading: s.heading,
            body: s.body,
            image: s.image || null,
            order: i,
          })),
        },
      },
      include: { sections: true },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare: ' + error.message }, { status: 500 });
  }
}
