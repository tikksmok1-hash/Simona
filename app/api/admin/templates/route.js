import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/templates — list all templates
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const templates = await prisma.productTemplate.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Templates GET error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST /api/admin/templates — create template
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Numele șablonului este obligatoriu' }, { status: 400 });
    }

    const template = await prisma.productTemplate.create({
      data: {
        name: body.name.trim(),
        shortDescription: body.shortDescription || null,
        shortDescriptionRu: body.shortDescriptionRu || null,
        shortDescriptionEn: body.shortDescriptionEn || null,
        description: body.description || null,
        descriptionRu: body.descriptionRu || null,
        descriptionEn: body.descriptionEn || null,
        materialsInfo: body.materialsInfo || null,
        materialsInfoRu: body.materialsInfoRu || null,
        materialsInfoEn: body.materialsInfoEn || null,
        shippingInfo: body.shippingInfo || null,
        shippingInfoRu: body.shippingInfoRu || null,
        shippingInfoEn: body.shippingInfoEn || null,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Template POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare: ' + error.message }, { status: 500 });
  }
}
