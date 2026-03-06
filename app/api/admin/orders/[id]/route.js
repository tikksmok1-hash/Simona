import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PATCH /api/admin/orders/[id] — update order status
export async function PATCH(request, { params }) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const data = {};

    if (body.status) data.status = body.status;
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
    if (body.adminNote !== undefined) data.adminNote = body.adminNote;
    if (body.trackingNumber !== undefined) data.trackingNumber = body.trackingNumber;

    const order = await prisma.order.update({ where: { id }, data });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order PATCH error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}
