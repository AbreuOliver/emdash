import { r as readCmsData } from "../../../chunks/cms-store.js";
async function load() {
  const cms = await readCmsData();
  return { posts: cms.posts };
}
export {
  load
};
