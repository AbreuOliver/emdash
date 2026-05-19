import { b as private_env } from "./shared-server.js";
const dayMs = 24 * 60 * 60 * 1e3;
const allowedAdminEmails = (private_env.ADMIN_ALLOWED_EMAILS ?? "owner@example.com").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
const authConfig = {
  sessionCookieName: "emdash_session",
  sessionTtlMs: Number(private_env.AUTH_SESSION_TTL_MS ?? dayMs),
  otpTtlMs: Number(private_env.AUTH_OTP_TTL_MS ?? 10 * 60 * 1e3),
  allowDevBypass: private_env.AUTH_ALLOW_DEV_BYPASS === "1",
  exposeDevOtp: private_env.AUTH_EXPOSE_DEV_OTP === "1",
  allowedAdminEmails
};
export {
  authConfig as a
};
