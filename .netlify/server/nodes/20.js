import * as server from '../entries/pages/pages/_slug_/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pages/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pages/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.CnvZPtEh.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BS86lrJn.js","_app/immutable/chunks/DBT6TplI.js","_app/immutable/chunks/CrV6rAX8.js","_app/immutable/chunks/Dt4HC4uh.js","_app/immutable/chunks/BKZybx2a.js","_app/immutable/chunks/PmZ16NxN.js"];
export const stylesheets = [];
export const fonts = [];
