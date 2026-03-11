import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/me — verify token
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  // Fetch fresh 2FA status from DB
  const admin = await prisma.adminUser.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      twoFactorEnabled: admin?.twoFactorEnabled ?? false,
    },
  });
}
