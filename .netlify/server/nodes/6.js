

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/account/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.ByVuQHjh.js","_app/immutable/chunks/B1mKZIRe.js","_app/immutable/chunks/CSc2bR8F.js","_app/immutable/chunks/BnhHaDzM.js"];
export const stylesheets = [];
export const fonts = [];
