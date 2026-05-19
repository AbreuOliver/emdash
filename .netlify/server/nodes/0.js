import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CHfw-VGB.js","_app/immutable/chunks/BMJA893N.js","_app/immutable/chunks/geADuKD8.js","_app/immutable/chunks/CUuyC3Fp.js","_app/immutable/chunks/BCRsK5dA.js","_app/immutable/chunks/BPRwLzW7.js","_app/immutable/chunks/BQDvbZGv.js","_app/immutable/chunks/B39y8fNq.js","_app/immutable/chunks/IaDzyoXd.js","_app/immutable/chunks/DJPEuBKm.js","_app/immutable/chunks/BW40D7i3.js","_app/immutable/chunks/BcrIhj6r.js"];
export const stylesheets = ["_app/immutable/assets/0.C9KhZ800.css"];
export const fonts = [];
