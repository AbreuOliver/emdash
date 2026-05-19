import { h as attr_style } from "../../../../chunks/renderer.js";
import "../../../../chunks/client.js";
import { e as escape_html, a as attr } from "../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let email = "";
    let isSubmitting = false;
    $$renderer2.push(`<div class="admin-theme min-h-screen"><section class="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10"><article class="admin-panel w-full max-w-xl border p-8"${attr_style(`border-color: var(--admin-panel-border);`)}><p class="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-soft)]">Admin Access</p> <p class="mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"${attr_style(`border-color: ${data.devBypassEnabled ? "color-mix(in oklab, var(--admin-success) 36%, #ffffff)" : "color-mix(in oklab, var(--admin-danger) 36%, #ffffff)"}; color: ${data.devBypassEnabled ? "var(--admin-success)" : "var(--admin-danger)"}; background: ${data.devBypassEnabled ? "var(--admin-success-bg)" : "var(--admin-danger-bg)"};`)}>Dev bypass: ${escape_html(data.devBypassEnabled ? "ON" : "OFF")}</p> <h1 class="m-0 mt-2 text-3xl font-semibold text-[var(--admin-text-strong)]">Sign in to your workspace</h1> <p class="mt-3 text-sm text-[var(--admin-text-soft)]">Use OTP sign-in. During development, you can also use quick sign-in.</p> <label class="admin-label mt-6" for="email">Email</label> <input id="email" class="admin-input mt-1"${attr("value", email)} type="email" placeholder="owner@example.com"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-6 flex flex-wrap gap-2"><button class="admin-pill"${attr("disabled", !email, true)}>${escape_html("Request Code")}</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="admin-pill-ghost"${attr("disabled", isSubmitting, true)}>Dev Quick Sign-In</button></div></article></section></div>`);
  });
}
export {
  _page as default
};
