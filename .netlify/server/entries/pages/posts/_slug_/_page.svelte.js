import { o as head, e as escape_html, a as attr, d as derived } from "../../../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const seoTitle = derived(() => data.post.seoTitle?.trim() || data.post.title);
    const seoDescription = derived(() => data.post.seoDescription?.trim() || data.post.excerpt || "");
    const seoKeywords = derived(() => data.post.seoKeywords?.trim() || "");
    const robots = derived(() => data.post.seoNoIndex ? "noindex, nofollow" : "index, follow");
    head("14u6r3i", $$renderer2, ($$renderer3) => {
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
      $$renderer3.push(`<!--]--> <meta property="og:type" content="article"/>`);
    });
    $$renderer2.push(`<article class="content-wrap text-[var(--site-text-light)]"><h1 class="mb-2 text-4xl font-semibold tracking-tight">${escape_html(data.post.title)}</h1> <p class="mb-8 text-sm uppercase tracking-[0.12em] text-white/60">${escape_html(data.post.publishedAt)}</p> <p class="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-white/90">${escape_html(data.post.body)}</p></article>`);
  });
}
export {
  _page as default
};
