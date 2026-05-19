import { a as authConfig } from "../chunks/config.js";
import { g as getSessionByToken } from "../chunks/store.js";
function resolveSessionUser(sessionToken) {
  const session = getSessionByToken(sessionToken);
  if (session) {
    return session.user;
  }
  return null;
}
const handle = async ({ event, resolve }) => {
  const token = event.cookies.get(authConfig.sessionCookieName);
  event.locals.user = resolveSessionUser(token);
  return resolve(event);
};
export {
  handle
};
