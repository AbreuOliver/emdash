import { randomInt, randomUUID } from 'node:crypto';

import { authConfig } from './config';
import type { AuthSession, SessionUser } from './types';

type OtpChallenge = {
  email: string;
  code: string;
  expiresAt: number;
};

const otpByEmail = new Map<string, OtpChallenge>();
const sessionsByToken = new Map<string, AuthSession>();

function cleanupExpired() {
  const now = Date.now();

  for (const [email, challenge] of otpByEmail.entries()) {
    if (challenge.expiresAt <= now) otpByEmail.delete(email);
  }

  for (const [token, session] of sessionsByToken.entries()) {
    if (session.expiresAt <= now) sessionsByToken.delete(token);
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function canUseAdmin(email: string): boolean {
  const normalized = normalizeEmail(email);
  return authConfig.allowedAdminEmails.includes(normalized);
}

function createSession(email: string): AuthSession {
  const normalized = normalizeEmail(email);
  const user: SessionUser = {
    id: normalized,
    email: normalized,
    role: normalized === authConfig.allowedAdminEmails[0] ? 'owner' : 'admin'
  };

  const session: AuthSession = {
    token: randomUUID(),
    user,
    expiresAt: Date.now() + authConfig.sessionTtlMs
  };

  sessionsByToken.set(session.token, session);
  return session;
}

export function createOtpChallenge(email: string): { ok: true; code: string; expiresAt: number } | { ok: false; error: string } {
  cleanupExpired();

  if (!canUseAdmin(email)) {
    return { ok: false, error: 'This email is not allowed for admin access.' };
  }

  const normalized = normalizeEmail(email);
  const code = randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + authConfig.otpTtlMs;

  otpByEmail.set(normalized, { email: normalized, code, expiresAt });

  return { ok: true, code, expiresAt };
}

export function verifyOtpChallenge(email: string, code: string): { ok: true; session: AuthSession } | { ok: false; error: string } {
  cleanupExpired();

  const normalized = normalizeEmail(email);
  const challenge = otpByEmail.get(normalized);

  if (!challenge) {
    return { ok: false, error: 'No active code for this email. Request a new code.' };
  }

  if (challenge.code !== code.trim()) {
    return { ok: false, error: 'Invalid verification code.' };
  }

  otpByEmail.delete(normalized);
  const session = createSession(normalized);

  return { ok: true, session };
}

export function createDevSession(): AuthSession {
  cleanupExpired();
  const email = authConfig.allowedAdminEmails[0] ?? 'owner@example.com';
  return createSession(email);
}

export function getSessionByToken(token: string | null | undefined): AuthSession | null {
  cleanupExpired();

  if (!token) return null;
  const session = sessionsByToken.get(token);

  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessionsByToken.delete(token);
    return null;
  }

  return session;
}

export function revokeSession(token: string | null | undefined): void {
  if (!token) return;
  sessionsByToken.delete(token);
}
