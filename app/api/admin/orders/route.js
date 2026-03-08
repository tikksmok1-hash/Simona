import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/orders
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { email: true, firstName: true, lastName: true, phone: true } },
        shippingAddress: true,
      },
    });

    // Enrich each order with returning-customer hints
    const enriched = orders.map((order, _idx, all) => {
      const phone = order.shippingAddress?.phone;
      const fullName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim().toLowerCase();
      const addr = (order.shippingAddress?.address1 || '').trim().toLowerCase();

      // Count OTHER orders (exclude current) that match this phone/name/address
      const others = all.filter((o) => o.id !== order.id);

      const phoneOrders = phone
        ? others.filter((o) => o.shippingAddress?.phone === phone).length
        : 0;

      const nameOrders = fullName
        ? others.filter(
            (o) =>
              `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`
                .trim()
                .toLowerCase() === fullName
          ).length
        : 0;

      const addressOrders =
        addr && addr !== 'ridicare din magazin'
          ? others.filter(
              (o) => (o.shippingAddress?.address1 || '').trim().toLowerCase() === addr
            ).length
          : 0;

      const totalPrev = phoneOrders || nameOrders || addressOrders
        ? Math.max(phoneOrders, nameOrders, addressOrders)
        : 0;

      return {
        ...order,
        returning: {
          isReturning: totalPrev > 0,
          totalPreviousOrders: totalPrev,
          phoneOrders,
          nameOrders,
          addressOrders,
        },
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}
