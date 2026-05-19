import { json } from "@sveltejs/kit";
import { d as dev } from "../../../../../chunks/false.js";
import { a as authConfig } from "../../../../../chunks/config.js";
import { v as verifyOtpChallenge } from "../../../../../chunks/store.js";
async function POST({ request, cookies }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const code = typeof body.code === "string" ? body.code : "";
  const result = verifyOtpChallenge(email, code);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, { status: 400 });
  }
  cookies.set(authConfig.sessionCookieName, result.session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: !dev,
    path: "/",
    maxAge: Math.floor(authConfig.sessionTtlMs / 1e3)
  });
  return json({ ok: true, user: result.session.user });
}
export {
  POST
};
