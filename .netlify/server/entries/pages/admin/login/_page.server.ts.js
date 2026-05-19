import { redirect } from "@sveltejs/kit";
import { a as authConfig } from "../../../../chunks/config.js";
function load({ locals, url }) {
  if (locals.user) {
    throw redirect(302, url.searchParams.get("next") || "/admin");
  }
  return {
    devBypassEnabled: authConfig.allowDevBypass
  };
}
export {
  load
};
