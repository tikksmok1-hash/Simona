import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

// PATCH /api/admin/categories/[id]
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.nameRu !== undefined && { nameRu: body.nameRu || null }),
        ...(body.nameEn !== undefined && { nameEn: body.nameEn || null }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionRu !== undefined && { descriptionRu: body.descriptionRu || null }),
        ...(body.descriptionEn !== undefined && { descriptionEn: body.descriptionEn || null }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    await logAudit(request, { action: 'CATEGORY_UPDATE', details: `Categorie actualizată: ${category.name}`, userId: user.id, userEmail: user.email });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const existing = await prisma.category.findUnique({ where: { id }, select: { name: true } });
    await prisma.category.delete({ where: { id } });
    await logAudit(request, { action: 'CATEGORY_DELETE', details: `Categorie ștearsă: ${existing?.name || id}`, userId: user.id, userEmail: user.email });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
