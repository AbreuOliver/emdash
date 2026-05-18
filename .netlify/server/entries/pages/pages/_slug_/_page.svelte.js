import { o as head, e as escape_html, a as attr, d as derived } from "../../../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const seoTitle = derived(() => data.page.seoTitle?.trim() || data.page.title);
    const seoDescription = derived(() => data.page.seoDescription?.trim() || "");
    const seoKeywords = derived(() => data.page.seoKeywords?.trim() || "");
    const robots = derived(() => data.page.seoNoIndex ? "noindex, nofollow" : "index, follow");
    head("1qzi5s5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(seoTitle())}</title>`);
      });
      if (seoDescription()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="description"${attr("content", seoDescription())}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (seoKeywords()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta name="keywords"${attr("content", seoKeywords())}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta name="robots"${attr("content", robots())}/> <meta property="og:title"${attr("content", seoTitle())}/> `);
      if (seoDescription()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<meta property="og:description"${attr("content", seoDescription())}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <meta property="og:type" content="website"/>`);
    });
    $$renderer2.push(`<article class="content-wrap text-[var(--site-text-light)]"><h1 class="mb-6 text-4xl font-semibold tracking-tight">${escape_html(data.page.title)}</h1> <p class="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-white/90">${escape_html(data.page.body)}</p></article>`);
  });
}
export {
  _page as default
};
