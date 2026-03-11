import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ── Global rate-limiter + admin page protection (Edge middleware) ──

const ipHits = new Map();          // ip → { count, resetAt }
const WINDOW_MS   = 60 * 1000;    // 1-minute sliding window
const MAX_API     = 120;           // 120 API requests / min / IP
const MAX_ADMIN   = 60;            // 60 admin API requests / min / IP

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

// Periodic cleanup (every 2 min)
setInterval(() => {
  const now = Date.now();
  for (const [key, v] of ipHits) {
    if (now > v.resetAt) ipHits.delete(key);
  }
}, 2 * 60 * 1000);

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

function rateCheck(ip, prefix, max) {
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const entry = ipHits.get(key);

  if (!entry || now > entry.resetAt) {
    ipHits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null; // OK
  }

  entry.count++;
  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return retryAfter;
  }
  return null; // OK
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Protect admin pages (server-side) ──────────────────────────
  // Anyone visiting /admin/* (except /admin/login) must have a valid JWT
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get('admin-token')?.value;
    const authHeader = request.headers.get('authorization');
    const token = cookie || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      // Block temp 2FA tokens from accessing admin pages
      if (payload.pending2fa) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Invalid or expired token → redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin-token');
      return response;
    }
  }

  // Only rate-limit API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = getIP(request);

  // ── CSRF protection for mutating admin API requests ───────────
  // Block POST/PUT/PATCH/DELETE from foreign origins
  if (pathname.startsWith('/api/admin') && request.method !== 'GET') {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Determine allowed origins from Host header
    const allowedOrigins = host
      ? [`https://${host}`, `http://${host}`]
      : [];

    const originOk = origin && allowedOrigins.some(ao => origin === ao);
    const refererOk = referer && allowedOrigins.some(ao => referer.startsWith(ao));

    if (!originOk && !refererOk) {
      return NextResponse.json(
        { error: 'Cerere respinsă — origin invalid (CSRF protection).' },
        { status: 403 }
      );
    }
  }

  // ── Admin API routes ──────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    const retryAfter = rateCheck(ip, 'admin', MAX_ADMIN);
    if (retryAfter) {
      return NextResponse.json(
        { error: 'Prea multe cereri. Reîncearcă mai târziu.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(MAX_ADMIN),
          },
        }
      );
    }
    return NextResponse.next();
  }

  // ── Public API routes ─────────────────────────────────────────
  const retryAfter = rateCheck(ip, 'api', MAX_API);
  if (retryAfter) {
    return NextResponse.json(
      { error: 'Prea multe cereri. Reîncearcă mai târziu.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(MAX_API),
        },
      }
    );
  }

  // ── Security headers for all API responses ────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
