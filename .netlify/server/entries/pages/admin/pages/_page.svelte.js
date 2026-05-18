function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section class="admin-panel grid gap-3"><h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Pages</h2> <p class="m-0 text-sm text-[var(--admin-text-soft)]">Read-only list for now. Full page CRUD is the next step.</p> `);
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
