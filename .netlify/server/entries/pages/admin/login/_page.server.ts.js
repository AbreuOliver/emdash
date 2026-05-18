import { redirect } from "@sveltejs/kit";
function load({ locals, url }) {
  if (locals.user) {
    throw redirect(302, url.searchParams.get("next") || "/admin");
  }
  return {};
}
export {
  load
};
