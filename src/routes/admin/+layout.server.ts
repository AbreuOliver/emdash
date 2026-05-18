import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  if (url.pathname === '/admin/login') {
    return {};
  }

  if (!locals.user) {
    const next = encodeURIComponent(url.pathname + url.search);
    throw redirect(302, `/admin/login?next=${next}`);
  }

  return {
    user: locals.user
  };
}
