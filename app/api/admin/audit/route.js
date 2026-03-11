import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { cleanupOldLogs } from '@/lib/audit';

// GET /api/admin/audit — list audit logs (paginated)
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  // Cleanup old logs (>30 days) on each fetch
  await cleanupOldLogs();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '50', 10)));
  const action = searchParams.get('action') || null;

  const where = {};
  if (action) where.action = action;

  try {
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Audit logs GET error:', error);
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}
