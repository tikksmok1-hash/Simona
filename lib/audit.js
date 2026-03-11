import prisma from '@/lib/db';

/**
 * Log an admin action to the audit trail.
 *
 * @param {Request} request  – the incoming Next.js request (used for IP + UA)
 * @param {object}  opts
 * @param {string}  opts.action    – e.g. "LOGIN", "PRODUCT_CREATE"
 * @param {string}  [opts.details] – human-readable detail string
 * @param {string}  [opts.userId]  – admin user id
 * @param {string}  [opts.userEmail] – admin user email
 */
export async function logAudit(request, { action, details, userId, userEmail }) {
  try {
    const forwarded = request?.headers?.get?.('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || request?.headers?.get?.('x-real-ip') || null;
    const userAgent = request?.headers?.get?.('user-agent') || null;

    await prisma.auditLog.create({
      data: {
        action,
        details: details || null,
        userId: userId || null,
        userEmail: userEmail || null,
        ip,
        userAgent: userAgent ? userAgent.slice(0, 300) : null,
      },
    });
  } catch (err) {
    // Never let audit logging break the main flow
    console.error('Audit log error:', err);
  }
}

/**
 * Delete audit logs older than 30 days.
 * Called automatically when fetching logs.
 */
export async function cleanupOldLogs() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await prisma.auditLog.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } },
    });
  } catch (err) {
    console.error('Audit cleanup error:', err);
  }
}
