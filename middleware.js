import { NextResponse } from 'next/server';

// ── Global API rate-limiter (Edge middleware) ──────────────────────
// Runs BEFORE any route handler.  Light, in-memory, per-instance.
// Not a bullet-proof WAF, but stops casual DDoS / bot floods.

const ipHits = new Map();          // ip → { count, resetAt }
const WINDOW_MS   = 60 * 1000;    // 1-minute sliding window
const MAX_API     = 120;           // 120 API requests / min / IP (generous for legit users)
const MAX_ADMIN   = 60;            // 60 admin API requests / min / IP

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

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only rate-limit API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = getIP(request);

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
  matcher: '/api/:path*',
};
