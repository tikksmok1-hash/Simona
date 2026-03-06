import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/me — verify token
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
