import { d as derived } from "../../chunks/renderer.js";
import { p as page } from "../../chunks/index.js";
import { a as attr, e as escape_html } from "../../chunks/attributes.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    const banner = derived(() => data.banner);
    const inAdmin = derived(() => page.url.pathname.startsWith("/admin"));
    const showBanner = derived(() => Boolean(banner()) && true && !inAdmin());
    if (showBanner() && banner()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<aside class="sticky top-0 z-50 flex flex-col gap-2 border-b border-white/25 bg-[#1d5fd0] px-4 py-3 text-[#f4f8ff] sm:flex-row sm:items-center sm:justify-between" role="status" aria-live="polite"><a class="flex flex-wrap items-baseline gap-2 no-underline"${attr("href", `/posts/${banner().slug}`)}><strong>${escape_html(banner().title)}</strong> `);
      if (banner().excerpt) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-sm opacity-90">${escape_html(banner().excerpt)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></a> <button class="inline-flex items-center rounded-md border border-white/45 bg-transparent px-2.5 py-1 text-xs uppercase tracking-[0.04em] text-white" aria-label="Dismiss banner">Dismiss</button></aside>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
