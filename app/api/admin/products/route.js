import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { createRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

const writeLimit = createRateLimit({
  name: 'admin-products-write',
  maxRequests: 30,           // 30 creates
  windowMs: 10 * 60 * 1000,  // per 10 minutes
});

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

  const { success, retryAfter } = writeLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe cereri. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        nameRu: body.nameRu || null,
        nameEn: body.nameEn || null,
        slug: body.slug,
        description: body.description || '',
        descriptionRu: body.descriptionRu || '',
        descriptionEn: body.descriptionEn || '',
        shortDescription: body.shortDescription || null,
        shortDescriptionRu: body.shortDescriptionRu || null,
        shortDescriptionEn: body.shortDescriptionEn || null,
        materialsInfo: body.materialsInfo || null,
        materialsInfoRu: body.materialsInfoRu || null,
        materialsInfoEn: body.materialsInfoEn || null,
        shippingInfo: body.shippingInfo || null,
        shippingInfoRu: body.shippingInfoRu || null,
        shippingInfoEn: body.shippingInfoEn || null,
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
            colorNameRu: v.colorNameRu || null,
            colorNameEn: v.colorNameEn || null,
            colorCode: v.colorCode,
            isActive: true,
            images: {
              create: (v.images || []).filter(img => img.url && img.url.trim() !== '').map((img, i) => ({
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

    await logAudit(request, { action: 'PRODUCT_CREATE', details: `Produs creat: ${product.name}`, userId: user.id, userEmail: user.email });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'Eroare la creare: ' + error.message }, { status: 500 });
  }
}
