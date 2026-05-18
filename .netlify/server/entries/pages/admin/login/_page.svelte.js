import { a as attr } from "../../../../chunks/renderer.js";
import "../../../../chunks/client.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    $$renderer2.push(`<section class="mx-auto mt-16 max-w-md rounded-xl border border-white/20 bg-white/5 p-6 text-white"><h1 class="m-0 text-2xl font-semibold">Admin Login</h1> <p class="mt-2 text-sm text-white/70">Placeholder OTP auth for now. Resend integration will replace this route.</p> <label class="mt-5 block text-sm" for="email">Email</label> <input id="email" class="mt-1 w-full rounded-md border border-white/25 bg-black/25 px-3 py-2"${attr("value", email)} type="email"/> `);
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
    $$renderer2.push(`<!--]--> <div class="mt-5 flex gap-2"><button class="rounded-md bg-white px-4 py-2 text-black"${attr("disabled", !email, true)}>Request Code</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
export {
  _page as default
};
