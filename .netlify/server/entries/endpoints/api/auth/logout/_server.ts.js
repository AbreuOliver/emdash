import { json } from "@sveltejs/kit";
import { a as authConfig, r as revokeSession } from "../../../../../chunks/store.js";
async function POST({ cookies }) {
  const token = cookies.get(authConfig.sessionCookieName);
  revokeSession(token);
  cookies.delete(authConfig.sessionCookieName, {
    path: "/"
  });
  return json({ ok: true });
}
export {
  POST
};
