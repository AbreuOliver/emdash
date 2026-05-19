import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import type { RequestEvent } from '@sveltejs/kit';

type AuditActor = {
  id?: string;
  email?: string;
  role?: string;
};

export type AuditEvent = {
  action: string;
  status: 'ok' | 'error' | 'denied';
  message?: string;
  target?: string;
  details?: Record<string, unknown>;
  actor?: AuditActor;
  route?: string;
  ip?: string | null;
  userAgent?: string;
  timestamp?: string;
};

const auditPath = resolve(process.cwd(), 'data', 'audit.log');
const auditEnabled = (process.env.AUDIT_LOG_ENABLED ?? '1') === '1';

function toLine(entry: AuditEvent): string {
  return `${JSON.stringify({ ...entry, timestamp: entry.timestamp ?? new Date().toISOString() })}\n`;
}

export function auditContext(event: RequestEvent): Pick<AuditEvent, 'actor' | 'route' | 'ip' | 'userAgent'> {
  const forwarded = event.request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : null;

  return {
    actor: event.locals.user
      ? {
          id: event.locals.user.id,
          email: event.locals.user.email,
          role: event.locals.user.role
        }
      : undefined,
    route: event.url.pathname,
    ip,
    userAgent: event.request.headers.get('user-agent') ?? ''
  };
}

export async function writeAuditEvent(event: AuditEvent): Promise<void> {
  if (!auditEnabled) return;

  await mkdir(dirname(auditPath), { recursive: true });
  await appendFile(auditPath, toLine(event), 'utf8');
}
