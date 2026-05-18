function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section class="admin-panel grid gap-4"><div class="flex items-center justify-between"><h2 class="m-0 text-2xl text-[var(--admin-text-strong)]">Hours</h2> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-[var(--admin-text-soft)]">Loading hours...</p>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
