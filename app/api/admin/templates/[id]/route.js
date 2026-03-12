import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/templates/[id]
export async function GET(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const template = await prisma.productTemplate.findUnique({ where: { id } });
    if (!template) return NextResponse.json({ error: 'Șablon negăsit' }, { status: 404 });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// PATCH /api/admin/templates/[id]
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const data = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription || null;
    if (body.shortDescriptionRu !== undefined) data.shortDescriptionRu = body.shortDescriptionRu || null;
    if (body.shortDescriptionEn !== undefined) data.shortDescriptionEn = body.shortDescriptionEn || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.descriptionRu !== undefined) data.descriptionRu = body.descriptionRu || null;
    if (body.descriptionEn !== undefined) data.descriptionEn = body.descriptionEn || null;
    if (body.materialsInfo !== undefined) data.materialsInfo = body.materialsInfo || null;
    if (body.materialsInfoRu !== undefined) data.materialsInfoRu = body.materialsInfoRu || null;
    if (body.materialsInfoEn !== undefined) data.materialsInfoEn = body.materialsInfoEn || null;
    if (body.shippingInfo !== undefined) data.shippingInfo = body.shippingInfo || null;
    if (body.shippingInfoRu !== undefined) data.shippingInfoRu = body.shippingInfoRu || null;
    if (body.shippingInfoEn !== undefined) data.shippingInfoEn = body.shippingInfoEn || null;

    const template = await prisma.productTemplate.update({ where: { id }, data });
    return NextResponse.json(template);
  } catch (error) {
    console.error('Template PATCH error:', error);
    return NextResponse.json({ error: 'Eroare la actualizare: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[id]
export async function DELETE(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.productTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Template DELETE error:', error);
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
