import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint.
 * Called by the admin panel whenever products/categories are created, updated or deleted.
 *
 * Usage from admin panel:
 *   POST /api/revalidate
 *   Headers: { "Authorization": "Bearer <REVALIDATION_SECRET>" }
 *   Body:    { "paths": ["/bestsellers", "/categorie/rochii", "/produs/rochie-eleganta-satin"] }
 *
 * Or revalidate everything at once:
 *   POST /api/revalidate
 *   Headers: { "Authorization": "Bearer <REVALIDATION_SECRET>" }
 *   Body:    { "all": true }
 */
export async function POST(request) {
  // Verify secret so only the admin panel can trigger this
  const authHeader = request.headers.get('authorization');
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.all) {
      // Nuclear option — revalidate every product-related page
      revalidatePath('/', 'layout');
      return NextResponse.json({
        revalidated: true,
        message: 'All pages revalidated',
        timestamp: Date.now(),
      });
    }

    if (Array.isArray(body.paths) && body.paths.length > 0) {
      for (const path of body.paths) {
        revalidatePath(path);
      }
      return NextResponse.json({
        revalidated: true,
        paths: body.paths,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Provide either { "all": true } or { "paths": ["/path1", "/path2"] }' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body', details: err.message },
      { status: 400 }
    );
  }
}
