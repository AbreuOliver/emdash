import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.F2wr1Dff.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/B8KfODEG.js","_app/immutable/chunks/BS86lrJn.js","_app/immutable/chunks/DBT6TplI.js","_app/immutable/chunks/CrV6rAX8.js","_app/immutable/chunks/xiBZsA8Z.js","_app/immutable/chunks/BKZybx2a.js","_app/immutable/chunks/PmZ16NxN.js","_app/immutable/chunks/7D_qV6K8.js","_app/immutable/chunks/C7_bOy8f.js"];
export const stylesheets = ["_app/immutable/assets/0.DEVxuLLL.css"];
export const fonts = [];
