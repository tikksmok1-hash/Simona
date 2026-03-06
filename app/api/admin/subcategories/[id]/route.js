import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PATCH /api/admin/subcategories/[id]
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const sub = await prisma.subcategory.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.categoryId && { categoryId: body.categoryId }),
      },
    });
    return NextResponse.json(sub);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}

// DELETE /api/admin/subcategories/[id]
export async function DELETE(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.subcategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
