import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

// GET /api/admin/products/[id]
export async function GET(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        variants: {
          include: {
            images: { orderBy: { order: 'asc' } },
            sizes: true,
          },
        },
      },
    });
    if (!product) return NextResponse.json({ error: 'Produs negăsit' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

// PATCH /api/admin/products/[id] — update product
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.materialsInfo !== undefined) data.materialsInfo = body.materialsInfo || null;
    if (body.shippingInfo !== undefined) data.shippingInfo = body.shippingInfo || null;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.compareAtPrice !== undefined) data.compareAtPrice = body.compareAtPrice ? parseFloat(body.compareAtPrice) : null;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.isNew !== undefined) data.isNew = body.isNew;
    if (body.isBestseller !== undefined) data.isBestseller = body.isBestseller;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.subcategoryId !== undefined) data.subcategoryId = body.subcategoryId || null;

    // If variants are provided, delete old and recreate
    if (body.variants) {
      // Delete existing variants (cascade deletes images & sizes)
      await prisma.productVariant.deleteMany({ where: { productId: id } });

      data.variants = {
        create: body.variants.map((v) => ({
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
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        variants: { include: { images: true, sizes: true } },
        category: { select: { name: true } },
      },
    });

    await logAudit(request, { action: 'PRODUCT_UPDATE', details: `Produs actualizat: ${product.name}`, userId: user.id, userEmail: user.email });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Product PATCH error:', error);
    return NextResponse.json({ error: 'Eroare la actualizare: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id }, select: { name: true } });
    await prisma.product.delete({ where: { id } });
    await logAudit(request, { action: 'PRODUCT_DELETE', details: `Produs șters: ${existing?.name || id}`, userId: user.id, userEmail: user.email });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
