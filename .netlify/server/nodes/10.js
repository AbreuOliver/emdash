import * as server from '../entries/pages/admin/login/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/login/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.uZSqbtgp.js","_app/immutable/chunks/BMJA893N.js","_app/immutable/chunks/geADuKD8.js","_app/immutable/chunks/BCRsK5dA.js","_app/immutable/chunks/BPRwLzW7.js","_app/immutable/chunks/BQDvbZGv.js","_app/immutable/chunks/IaDzyoXd.js","_app/immutable/chunks/DJPEuBKm.js","_app/immutable/chunks/kvz71l-X.js","_app/immutable/chunks/BW40D7i3.js","_app/immutable/chunks/BcrIhj6r.js","_app/immutable/chunks/CUuyC3Fp.js"];
export const stylesheets = [];
export const fonts = [];
