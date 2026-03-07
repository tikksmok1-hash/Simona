import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { put, del } from '@vercel/blob';

// POST /api/admin/upload — upload image to Vercel Blob
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Niciun fișier trimis' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`simona/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url, filename: file.name });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Eroare la upload' }, { status: 500 });
  }
}

// DELETE /api/admin/upload — delete image from Vercel Blob
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL lipsă' }, { status: 400 });
    }

    // Only delete Vercel Blob URLs, skip Unsplash/other external URLs
    if (url.includes('.vercel-storage.com') || url.includes('.blob.vercel-storage.com')) {
      await del(url);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
