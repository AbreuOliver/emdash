import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.9_7HahgC.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BS86lrJn.js","_app/immutable/chunks/xiBZsA8Z.js","_app/immutable/chunks/CrV6rAX8.js","_app/immutable/chunks/DBT6TplI.js","_app/immutable/chunks/C0lnJvo3.js","_app/immutable/chunks/DPiBb6Na.js","_app/immutable/chunks/BKZybx2a.js","_app/immutable/chunks/PmZ16NxN.js","_app/immutable/chunks/7D_qV6K8.js","_app/immutable/chunks/C7_bOy8f.js","_app/immutable/chunks/B8KfODEG.js","_app/immutable/chunks/BnhHaDzM.js"];
export const stylesheets = [];
export const fonts = [];
