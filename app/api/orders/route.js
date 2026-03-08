import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createRateLimit } from '@/lib/rateLimit';
import { sendTelegram, buildOrderMessage } from '@/lib/telegram';

const orderLimit = createRateLimit({
  name: 'place-order',
  maxRequests: 5,           // 5 orders
  windowMs: 15 * 60 * 1000, // per 15 minutes
});

// POST /api/orders — place a guest order
export async function POST(request) {
  const { success, retryAfter } = orderLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe comenzi. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { customer, items, deliveryMethod, subtotal, shippingCost, total, observatii } = body;

    // Validate required fields
    if (!customer?.nume || !customer?.prenume || !customer?.telefon) {
      return NextResponse.json({ error: 'Date client incomplete.' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
    }
    if (deliveryMethod === 'standard' && (!customer.adresa || !customer.oras)) {
      return NextResponse.json({ error: 'Adresa de livrare este obligatorie.' }, { status: 400 });
    }

    // Find or create guest user by email or phone
    const email = customer.email?.trim() || `guest_${Date.now()}@simona.md`;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName: customer.nume,
          lastName: customer.prenume,
          phone: customer.telefon,
        },
      });
    }

    // ── Detect returning customer ──────────────────────────────
    const fullName = `${customer.nume} ${customer.prenume}`.trim().toLowerCase();
    const phone = customer.telefon.trim();
    const addr = (customer.adresa || '').trim().toLowerCase();

    // Check previous orders by this user or matching phone/name/address
    const previousOrders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { shippingAddress: { phone: phone } },
        ],
      },
      include: { shippingAddress: true },
    });

    const phoneOrders = previousOrders.filter(
      (o) => o.shippingAddress?.phone === phone
    ).length;

    const nameOrders = previousOrders.filter(
      (o) =>
        `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`
          .trim()
          .toLowerCase() === fullName
    ).length;

    const addressOrders = addr
      ? previousOrders.filter(
          (o) => (o.shippingAddress?.address1 || '').trim().toLowerCase() === addr
        ).length
      : 0;

    const returning = {
      isReturning: previousOrders.length > 0,
      totalPreviousOrders: previousOrders.length,
      phoneOrders,
      nameOrders,
      addressOrders,
    };

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        firstName: customer.nume,
        lastName: customer.prenume,
        address1: customer.adresa || 'Ridicare din magazin',
        city: customer.oras || 'Chișinău',
        county: customer.oras || 'Chișinău',
        postalCode: '-',
        country: 'Moldova',
        phone: customer.telefon,
        userId: user.id,
      },
    });

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `SM-${String(orderCount + 1).padStart(5, '0')}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: parseFloat(subtotal) || 0,
        shippingCost: parseFloat(shippingCost) || 0,
        total: parseFloat(total) || 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: deliveryMethod === 'pickup' ? 'CASH_ON_PICKUP' : 'CASH_ON_DELIVERY',
        customerNote: observatii || null,
        userId: user.id,
        shippingAddressId: address.id,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            productName: item.name,
            productSlug: item.slug,
            colorName: item.color || '-',
            sizeName: item.size || '-',
            imageUrl: item.image || null,
            productId: item.productId,
            ...(item.sizeId ? { sizeId: item.sizeId } : {}),
          })),
        },
      },
      include: { items: true },
    });

    // ── Send Telegram notification (fire-and-forget) ───────────
    const telegramMsg = buildOrderMessage(order, customer, items, returning, deliveryMethod);
    sendTelegram(telegramMsg).catch(() => {}); // don't await — order already saved

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'Eroare la plasarea comenzii.' }, { status: 500 });
  }
}
