import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'simona-admin-secret-key-2026';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Also check cookies
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin-token=([^;]+)/);
  return match ? match[1] : null;
}

export function requireAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
