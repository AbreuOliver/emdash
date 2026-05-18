import * as server from '../entries/pages/posts/_page.server.ts.js';

export const index = 21;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/posts/+page.server.ts";
export const imports = ["_app/immutable/nodes/21.n0vX8nKw.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BS86lrJn.js","_app/immutable/chunks/C0lnJvo3.js","_app/immutable/chunks/Dt4HC4uh.js","_app/immutable/chunks/BKZybx2a.js","_app/immutable/chunks/PmZ16NxN.js"];
export const stylesheets = [];
export const fonts = [];
