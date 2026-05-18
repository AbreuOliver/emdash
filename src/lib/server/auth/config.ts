import { env } from '$env/dynamic/private';

const dayMs = 24 * 60 * 60 * 1000;

const allowedAdminEmails = (env.ADMIN_ALLOWED_EMAILS ?? 'owner@example.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const authConfig = {
  sessionCookieName: 'emdash_session',
  sessionTtlMs: Number(env.AUTH_SESSION_TTL_MS ?? dayMs),
  otpTtlMs: Number(env.AUTH_OTP_TTL_MS ?? 10 * 60 * 1000),
  allowDevBypass: env.AUTH_ALLOW_DEV_BYPASS === '1',
  exposeDevOtp: env.AUTH_EXPOSE_DEV_OTP === '1',
  allowedAdminEmails
};
