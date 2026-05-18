import { redirect } from "@sveltejs/kit";
function load() {
  redirect(302, "/");
}
export {
  load
};
