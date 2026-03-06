import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PATCH /api/admin/blog/[id]
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const data = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.image !== undefined) data.image = body.image;
    if (body.category !== undefined) data.category = body.category;
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.readTime !== undefined) data.readTime = body.readTime;
    if (body.author !== undefined) data.author = body.author;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    // If sections provided, delete old and recreate
    if (body.sections) {
      await prisma.blogSection.deleteMany({ where: { postId: id } });
      data.sections = {
        create: body.sections.map((s, i) => ({
          heading: s.heading,
          body: s.body,
          image: s.image || null,
          order: i,
        })),
      };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
      include: { sections: true },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog PATCH error:', error);
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
