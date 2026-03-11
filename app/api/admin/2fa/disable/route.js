import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

// POST /api/admin/2fa/disable — disable 2FA (requires current password)
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json({ error: 'Parola este obligatorie' }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: user.id } });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return NextResponse.json({ error: 'Parolă incorectă' }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { twoFactorSecret: null, twoFactorEnabled: false },
  });

  return NextResponse.json({ success: true });
}
