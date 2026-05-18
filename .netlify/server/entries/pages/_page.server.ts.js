import { r as readCmsData } from "../../chunks/cms-store.js";
async function load() {
  const cms = await readCmsData();
  return { site: cms.site };
}
export {
  load
};
