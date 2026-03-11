import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { authenticator } from 'otplib';

// GET /api/admin/2fa/setup — generate a TOTP secret for setup
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const secret = authenticator.generateSecret();
  const appName = 'SIMONA Admin';
  const otpauthUrl = authenticator.keyuri(user.email, appName, secret);

  // QR code via free public API (no extra npm package needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;

  return NextResponse.json({ secret, qrUrl, otpauthUrl });
}
