import { e as escape_html, a as attr } from "../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let revision = 0;
    let saving = false;
    $$renderer2.push(`<section class="admin-panel grid gap-4"><div class="flex items-center justify-between"><div><h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Pages</h2> <p class="m-0 mt-1 text-xs text-[var(--admin-text-soft)]">Revision ${escape_html(revision)}`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></p></div> <div class="flex gap-2">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="admin-pill-ghost">New Page</button> <button class="admin-pill"${attr("disabled", saving, true)}>${escape_html("Save")}</button></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-[var(--admin-text-soft)]">Loading pages...</p>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
