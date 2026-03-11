import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, signTempToken } from '@/lib/auth';
import { createRateLimit } from '@/lib/rateLimit';

const loginLimit = createRateLimit({
  name: 'admin-login',
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
});

// POST /api/admin/login
export async function POST(request) {
  const { success, retryAfter } = loginLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe încercări. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email și parola sunt obligatorii' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Credențiale invalide' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Credențiale invalide' }, { status: 401 });
    }

    // 2FA check
    if (admin.twoFactorEnabled && admin.twoFactorSecret) {
      const tempToken = signTempToken({ id: admin.id, email: admin.email, name: admin.name });
      return NextResponse.json({ requiresTwoFactor: true, tempToken });
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}
