// Simple in-memory rate limiter for serverless
// Works per warm instance — stops most bot spam

const stores = new Map();

function getStore(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  return stores.get(name);
}

// Clean expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [, store] of stores) {
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limiter factory
 * @param {Object} options
 * @param {string} options.name - Unique limiter name
 * @param {number} options.maxRequests - Max requests per window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {function} - rateLimit(request) => { success, remaining, retryAfter }
 */
export function createRateLimit({ name, maxRequests, windowMs }) {
  const store = getStore(name);

  return function rateLimit(request) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return { success: false, remaining: 0, retryAfter };
    }

    entry.count++;
    return { success: true, remaining: maxRequests - entry.count };
  };
}
