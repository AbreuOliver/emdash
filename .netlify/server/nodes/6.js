

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/account/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.MDgqtfuK.js","_app/immutable/chunks/BMJA893N.js","_app/immutable/chunks/geADuKD8.js","_app/immutable/chunks/Dukx8Osb.js"];
export const stylesheets = [];
export const fonts = [];
