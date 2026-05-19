import { json } from "@sveltejs/kit";
import { a as authConfig } from "../../../../../chunks/config.js";
import { a as createOtpChallenge } from "../../../../../chunks/store.js";
async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const result = createOtpChallenge(email);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, { status: 400 });
  }
  return json({
    ok: true,
    expiresAt: result.expiresAt,
    ...authConfig.exposeDevOtp ? { devCode: result.code } : {}
  });
}
export {
  POST
};
