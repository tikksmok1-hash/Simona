import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verify } from 'otplib';
import prisma from '@/lib/db';
import { logAudit } from '@/lib/audit';

// POST /api/admin/2fa/enable — verify code and save secret
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, secret } = await request.json();

  if (!code || !secret) {
    return NextResponse.json({ error: 'Cod și secret obligatorii' }, { status: 400 });
  }

  const result = await verify({ token: code, secret });
  if (!result.valid) {
    return NextResponse.json({ error: 'Cod invalid. Încearcă din nou.' }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret, twoFactorEnabled: true },
  });

  await logAudit(request, { action: '2FA_ENABLE', details: '2FA activat', userId: user.id, userEmail: user.email });
  return NextResponse.json({ success: true });
}
