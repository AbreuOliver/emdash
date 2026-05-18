import { o as head, g as ensure_array_like, a as attr, e as escape_html } from "../../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("lvfn04", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Posts</title>`);
      });
    });
    $$renderer2.push(`<div class="content-wrap text-[var(--site-text-light)]"><h1 class="mb-6 text-3xl font-semibold tracking-tight">Posts</h1> <ul class="grid gap-3"><!--[-->`);
    const each_array = ensure_array_like(data.posts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let post = each_array[$$index];
      $$renderer2.push(`<li class="rounded-lg border border-white/15 bg-white/5 px-4 py-3"><a class="text-lg font-medium hover:text-[var(--site-accent)]"${attr("href", `/posts/${post.slug}`)}>${escape_html(post.title)}</a> <p class="mt-1 text-sm text-white/70">${escape_html(post.publishedAt)}</p></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div>`);
  });
}
export {
  _page as default
};
