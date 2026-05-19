import * as server from '../entries/pages/pages/_slug_/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pages/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/pages/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.DTPJJAuR.js","_app/immutable/chunks/BMJA893N.js","_app/immutable/chunks/geADuKD8.js","_app/immutable/chunks/BCRsK5dA.js","_app/immutable/chunks/BPRwLzW7.js","_app/immutable/chunks/BQDvbZGv.js","_app/immutable/chunks/TVJRldG9.js","_app/immutable/chunks/IaDzyoXd.js","_app/immutable/chunks/DJPEuBKm.js"];
export const stylesheets = [];
export const fonts = [];
