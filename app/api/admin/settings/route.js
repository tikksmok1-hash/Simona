import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/settings — get all settings
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const settings = await prisma.siteSettings.findMany();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Eroare la citirea setărilor' }, { status: 500 });
  }
}

// POST /api/admin/settings — update settings
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const data = await request.json();

    // Update or create each setting
    const updates = Object.entries(data).map(([key, value]) => 
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Eroare la salvarea setărilor' }, { status: 500 });
  }
}
