import { json } from "@sveltejs/kit";
import { a as authConfig } from "../../../../../chunks/config.js";
import { c as createDevSession } from "../../../../../chunks/store.js";
async function POST({ cookies }) {
  if (!authConfig.allowDevBypass) {
    return json({ ok: false, error: "Dev sign-in is disabled. Set AUTH_ALLOW_DEV_BYPASS=1." }, { status: 403 });
  }
  const session = createDevSession();
  cookies.set(authConfig.sessionCookieName, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: Math.floor(authConfig.sessionTtlMs / 1e3)
  });
  return json({ ok: true, user: session.user });
}
export {
  POST
};
