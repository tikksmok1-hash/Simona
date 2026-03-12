import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { createRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

const writeLimit = createRateLimit({
  name: 'admin-settings-write',
  maxRequests: 20,
  windowMs: 10 * 60 * 1000,
});

// GET /api/admin/settings — get all settings
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const settings = await prisma.siteSettings.findMany();
    
    // Convert to key-value object with i18n
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
      if (s.valueRu) settingsObj[s.key + 'Ru'] = s.valueRu;
      if (s.valueEn) settingsObj[s.key + 'En'] = s.valueEn;
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

  const { success, retryAfter } = writeLimit(request);
  if (!success) {
    return NextResponse.json(
      { error: `Prea multe cereri. Reîncearcă peste ${retryAfter} secunde.` },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();

    // Group base keys with their Ru/En translations
    const grouped = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.endsWith('Ru')) {
        const base = key.slice(0, -2);
        if (!grouped[base]) grouped[base] = {};
        grouped[base].valueRu = String(value || '');
      } else if (key.endsWith('En')) {
        const base = key.slice(0, -2);
        if (!grouped[base]) grouped[base] = {};
        grouped[base].valueEn = String(value || '');
      } else {
        if (!grouped[key]) grouped[key] = {};
        grouped[key].value = String(value);
      }
    });

    // Update or create each setting
    const updates = Object.entries(grouped).map(([key, vals]) => 
      prisma.siteSettings.upsert({
        where: { key },
        update: vals,
        create: { key, value: vals.value || '', ...vals },
      })
    );

    await Promise.all(updates);
    await logAudit(request, { action: 'SETTINGS_UPDATE', details: `Setări actualizate: ${Object.keys(data).join(', ')}`, userId: user.id, userEmail: user.email });

    // Revalidate all pages so new settings appear immediately
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Eroare la salvarea setărilor' }, { status: 500 });
  }
}
