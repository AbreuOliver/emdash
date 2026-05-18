import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DPEP1JBI.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BS86lrJn.js","_app/immutable/chunks/Dt4HC4uh.js","_app/immutable/chunks/BKZybx2a.js","_app/immutable/chunks/PmZ16NxN.js"];
export const stylesheets = [];
export const fonts = [];
