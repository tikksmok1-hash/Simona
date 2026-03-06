import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

// POST /api/admin/login
export async function POST(request) {
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

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name });

    const response = NextResponse.json({
      token,
      user: { id: admin.id, email: admin.email, name: admin.name },
    });

    // Set cookie too
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}
