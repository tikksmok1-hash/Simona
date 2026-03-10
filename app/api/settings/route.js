import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Cache at the Next.js / Vercel edge level — revalidate every 5 min
export const revalidate = 300;

// GET /api/settings — get public settings (no auth required)
export async function GET() {
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
