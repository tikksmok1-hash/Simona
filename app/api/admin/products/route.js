import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/products — list all
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
        variants: {
          include: {
            images: { orderBy: { order: 'asc' } },
            sizes: true,
          },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// POST /api/admin/products — create product with variants
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || '',
        shortDescription: body.shortDescription || null,
        materialsInfo: body.materialsInfo || null,
        shippingInfo: body.shippingInfo || null,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false,
        isNew: body.isNew || false,
        isBestseller: body.isBestseller || false,
        categoryId: body.categoryId,
        subcategoryId: body.subcategoryId || null,
        variants: {
          create: (body.variants || []).map((v) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            isActive: true,
            images: {
              create: (v.images || []).map((img, i) => ({
                url: img.url,
                type: img.type || 'FRONT',
                order: i,
              })),
            },
            sizes: {
              create: (v.sizes || []).map((s) => ({
                size: s.size,
                stock: parseInt(s.stock) || 0,
              })),
            },
          })),
        },
      },
      include: {
        variants: { include: { images: true, sizes: true } },
        category: { select: { name: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare: ' + error.message }, { status: 500 });
  }
}
