import { NextResponse } from 'next/server';
import { verifyToken, signToken } from '@/lib/auth';
import { authenticator } from 'otplib';
import prisma from '@/lib/db';
import { createRateLimit } from '@/lib/rateLimit';

const verifyLimit = createRateLimit({
  name: '2fa-verify',
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});

// POST /api/admin/2fa/verify — verify TOTP code during login (step 2)
export async function POST(request) {
  const { success, retryAfter } = verifyLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe încercări. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  const { code, tempToken } = await request.json();

  if (!code || !tempToken) {
    return NextResponse.json({ error: 'Parametri lipsă' }, { status: 400 });
  }

  // Validate temp token
  const payload = verifyToken(tempToken);
  if (!payload || !payload.pending2fa) {
    return NextResponse.json({ error: 'Sesiune expirată. Autentifică-te din nou.' }, { status: 401 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.id } });
  if (!admin || !admin.twoFactorEnabled || !admin.twoFactorSecret) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }

  const isValid = authenticator.verify({ token: code, secret: admin.twoFactorSecret });
  if (!isValid) {
    return NextResponse.json({ error: 'Cod invalid. Încearcă din nou.' }, { status: 400 });
  }

  const token = signToken({ id: admin.id, email: admin.email, name: admin.name });

  const response = NextResponse.json({
    token,
    user: { id: admin.id, email: admin.email, name: admin.name },
  });

  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
