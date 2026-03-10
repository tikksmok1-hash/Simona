import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createRateLimit } from '@/lib/rateLimit';

const settingsLimit = createRateLimit({
  name: 'settings',
  maxRequests: 60,
  windowMs: 60 * 1000,
});

// Cache at the Next.js / Vercel edge level — revalidate every 5 min
export const revalidate = 300;

// GET /api/settings — get public settings (no auth required)
export async function GET(request) {
  const { success } = settingsLimit(request);
  if (!success) {
    return NextResponse.json({}, { status: 429 });
  }
  try {
    const settings = await prisma.siteSettings.findMany();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json(settingsObj, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Eroare la citirea setărilor' }, { status: 500 });
  }
}
