import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.B11UPcJZ.js","_app/immutable/chunks/BMJA893N.js","_app/immutable/chunks/geADuKD8.js","_app/immutable/chunks/BCRsK5dA.js","_app/immutable/chunks/B39y8fNq.js","_app/immutable/chunks/BQDvbZGv.js","_app/immutable/chunks/BPRwLzW7.js","_app/immutable/chunks/ni-5f9eJ.js","_app/immutable/chunks/CLYOk4gN.js","_app/immutable/chunks/IaDzyoXd.js","_app/immutable/chunks/DJPEuBKm.js","_app/immutable/chunks/BW40D7i3.js","_app/immutable/chunks/BcrIhj6r.js","_app/immutable/chunks/CUuyC3Fp.js","_app/immutable/chunks/Dukx8Osb.js"];
export const stylesheets = [];
export const fonts = [];
