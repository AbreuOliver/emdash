

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/guide/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.Bxe3JetU.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BnhHaDzM.js"];
export const stylesheets = [];
export const fonts = [];
