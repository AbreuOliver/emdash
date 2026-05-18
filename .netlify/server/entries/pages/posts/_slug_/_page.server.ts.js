import { error } from "@sveltejs/kit";
import { r as readCmsData } from "../../../../chunks/cms-store.js";
async function load({ params }) {
  const cms = await readCmsData();
  const post = cms.posts.find((entry) => entry.slug === params.slug);
  if (!post) {
    throw error(404, "Post not found");
  }
  return { post };
}
export {
  load
};
