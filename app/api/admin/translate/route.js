import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createRateLimit } from '@/lib/rateLimit';

const translateLimit = createRateLimit({
  name: 'admin-translate',
  maxRequests: 100,
  windowMs: 10 * 60 * 1000,
});

/**
 * POST /api/admin/translate
 * Body: { text: string, from: 'ro'|'ru'|'en', to: 'ro'|'ru'|'en' }
 * Returns: { translated: string }
 * 
 * Uses the free Google Translate web API (no key needed).
 */
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { success, retryAfter } = translateLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe cereri. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const { text, from, to } = await request.json();

    if (!text || !from || !to) {
      return NextResponse.json({ error: 'text, from, to sunt obligatorii' }, { status: 400 });
    }

    if (from === to) {
      return NextResponse.json({ translated: text });
    }

    // Use Google Translate free API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      throw new Error(`Google Translate returned ${res.status}`);
    }

    const data = await res.json();

    // Google returns [[["translated text","original text",null,null,10]]]
    // Combine all translated segments
    let translated = '';
    if (Array.isArray(data) && Array.isArray(data[0])) {
      for (const segment of data[0]) {
        if (segment && segment[0]) {
          translated += segment[0];
        }
      }
    }

    if (!translated) {
      throw new Error('Empty translation result');
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json(
      { error: 'Eroare la traducere: ' + error.message },
      { status: 500 }
    );
  }
}
