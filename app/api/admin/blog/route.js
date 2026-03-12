import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { createRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

const writeLimit = createRateLimit({
  name: 'admin-blog-write',
  maxRequests: 20,
  windowMs: 10 * 60 * 1000,
});

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

  const { success, retryAfter } = writeLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe cereri. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        titleRu: body.titleRu || null,
        titleEn: body.titleEn || null,
        slug: body.slug,
        excerpt: body.excerpt || '',
        excerptRu: body.excerptRu || null,
        excerptEn: body.excerptEn || null,
        image: body.image || null,
        category: body.category || 'General',
        categoryRu: body.categoryRu || null,
        categoryEn: body.categoryEn || null,
        date: new Date(body.date || Date.now()),
        readTime: body.readTime || '5 min',
        author: body.author || 'Simona',
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== false,
        videoUrl: body.videoUrl || null,
        sections: {
          create: (body.sections || []).map((s, i) => ({
            heading: s.heading,
            headingRu: s.headingRu || null,
            headingEn: s.headingEn || null,
            body: s.body,
            bodyRu: s.bodyRu || null,
            bodyEn: s.bodyEn || null,
            image: s.image || null,
            videoUrl: s.videoUrl || null,
            order: i,
          })),
        },
      },
      include: { sections: true },
    });

    revalidatePath('/noutati', 'page');
    await logAudit(request, { action: 'BLOG_CREATE', details: `Articol creat: ${post.title}`, userId: user.id, userEmail: user.email });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare: ' + error.message }, { status: 500 });
  }
}
