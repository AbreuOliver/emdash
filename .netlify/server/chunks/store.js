import { randomInt, randomUUID } from "node:crypto";
import { a as authConfig } from "./config.js";
const otpByEmail = /* @__PURE__ */ new Map();
const sessionsByToken = /* @__PURE__ */ new Map();
function cleanupExpired() {
  const now = Date.now();
  for (const [email, challenge] of otpByEmail.entries()) {
    if (challenge.expiresAt <= now) otpByEmail.delete(email);
  }
  for (const [token, session] of sessionsByToken.entries()) {
    if (session.expiresAt <= now) sessionsByToken.delete(token);
  }
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function canUseAdmin(email) {
  const normalized = normalizeEmail(email);
  return authConfig.allowedAdminEmails.includes(normalized);
}
function createSession(email) {
  const normalized = normalizeEmail(email);
  const user = {
    id: normalized,
    email: normalized,
    role: normalized === authConfig.allowedAdminEmails[0] ? "owner" : "admin"
  };
  const session = {
    token: randomUUID(),
    user,
    expiresAt: Date.now() + authConfig.sessionTtlMs
  };
  sessionsByToken.set(session.token, session);
  return session;
}
function createOtpChallenge(email) {
  cleanupExpired();
  if (!canUseAdmin(email)) {
    return { ok: false, error: "This email is not allowed for admin access." };
  }
  const normalized = normalizeEmail(email);
  const code = randomInt(1e5, 999999).toString();
  const expiresAt = Date.now() + authConfig.otpTtlMs;
  otpByEmail.set(normalized, { email: normalized, code, expiresAt });
  return { ok: true, code, expiresAt };
}
function verifyOtpChallenge(email, code) {
  cleanupExpired();
  const normalized = normalizeEmail(email);
  const challenge = otpByEmail.get(normalized);
  if (!challenge) {
    return { ok: false, error: "No active code for this email. Request a new code." };
  }
  if (challenge.code !== code.trim()) {
    return { ok: false, error: "Invalid verification code." };
  }
  otpByEmail.delete(normalized);
  const session = createSession(normalized);
  return { ok: true, session };
}
function createDevSession() {
  cleanupExpired();
  const email = authConfig.allowedAdminEmails[0] ?? "owner@example.com";
  return createSession(email);
}
function getSessionByToken(token) {
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
function revokeSession(token) {
  if (!token) return;
  sessionsByToken.delete(token);
}
export {
  createOtpChallenge as a,
  createDevSession as c,
  getSessionByToken as g,
  revokeSession as r,
  verifyOtpChallenge as v
};
