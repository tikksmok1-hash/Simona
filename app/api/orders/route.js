import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createRateLimit } from '@/lib/rateLimit';
import { sendTelegram, buildOrderMessage } from '@/lib/telegram';
import { stripHtml } from '@/lib/sanitize';

const orderLimit = createRateLimit({
  name: 'place-order',
  maxRequests: 5,           // 5 orders
  windowMs: 15 * 60 * 1000, // per 15 minutes
});

/**
 * Generate a unique order number using the highest existing order number.
 * Falls back to a timestamp-based number if a collision still happens.
 * Retries up to 3 times to handle concurrent requests.
 */
async function generateOrderNumber(retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Find the highest existing order number to avoid collisions
      const lastOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true },
      });

      let nextNum = 1;
      if (lastOrder?.orderNumber) {
        const match = lastOrder.orderNumber.match(/SM-(\d+)/);
        if (match) nextNum = parseInt(match[1], 10) + 1;
      }

      // Add a small random offset on retry to avoid repeated collisions
      if (attempt > 0) nextNum += attempt;

      return `SM-${String(nextNum).padStart(5, '0')}`;
    } catch {
      if (attempt === retries - 1) {
        // Last resort: timestamp-based order number
        return `SM-${Date.now().toString(36).toUpperCase()}`;
      }
    }
  }
}

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
    const { customer: rawCustomer, items, deliveryMethod, subtotal, shippingCost, total, observatii } = body;

    // Sanitize all customer text inputs
    const customer = {
      nume: stripHtml(rawCustomer?.nume),
      prenume: stripHtml(rawCustomer?.prenume),
      telefon: stripHtml(rawCustomer?.telefon),
      email: stripHtml(rawCustomer?.email),
      oras: stripHtml(rawCustomer?.oras),
      adresa: stripHtml(rawCustomer?.adresa),
    };
    const safeObservatii = stripHtml(observatii);

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

    // Find addresses matching phone to get their order history
    const matchingAddresses = await prisma.address.findMany({
      where: { phone },
      select: { id: true, firstName: true, lastName: true, address1: true },
    });
    const matchingAddressIds = matchingAddresses.map((a) => a.id);

    // Get all previous orders from this user OR from matching phone addresses
    const previousOrders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          ...(matchingAddressIds.length > 0
            ? [{ shippingAddressId: { in: matchingAddressIds } }]
            : []),
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
        user: { connect: { id: user.id } },
      },
    });

    // Generate order number (collision-safe)
    const orderNumber = await generateOrderNumber();

    // Create order with retry on unique constraint collision
    let order;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const num = attempt === 0 ? orderNumber : `SM-${Date.now().toString(36).toUpperCase()}`;
        order = await prisma.order.create({
          data: {
            orderNumber: num,
            subtotal: parseFloat(subtotal) || 0,
            shippingCost: parseFloat(shippingCost) || 0,
            total: parseFloat(total) || 0,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            paymentMethod: deliveryMethod === 'pickup' ? 'CASH_ON_PICKUP' : 'CASH_ON_DELIVERY',
            customerNote: safeObservatii || null,
            user: { connect: { id: user.id } },
            shippingAddress: { connect: { id: address.id } },
          },
        });
        break; // success
      } catch (err) {
        // If it's a unique constraint error on orderNumber, retry
        if (attempt < 2 && err?.code === 'P2002') {
          continue;
        }
        throw err;
      }
    }

    // Create order items — only store snapshot data
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          order: { connect: { id: order.id } },
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          productName: item.name || 'Produs',
          productSlug: item.slug || '-',
          colorName: item.color || '-',
          sizeName: item.size || '-',
          imageUrl: item.image || null,
          productId: item.productId || null,
          sizeId: item.sizeId || null,
        },
      });
    }

    // ── Send Telegram notification (fire-and-forget) ───────────
    const telegramMsg = buildOrderMessage(order, customer, items, returning, deliveryMethod);
    sendTelegram(telegramMsg).catch(() => {}); // don't await — order already saved

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json(
      { error: 'Eroare la plasarea comenzii.', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
