import { error } from "@sveltejs/kit";
import { r as readCmsData } from "../../../../chunks/cms-store.js";
async function load({ params }) {
  const cms = await readCmsData();
  const page = cms.pages.find((entry) => entry.slug === params.slug);
  if (!page) {
    throw error(404, "Page not found");
  }
  return { page };
}
export {
  load
};
