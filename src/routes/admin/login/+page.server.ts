import { redirect } from '@sveltejs/kit';
import { authConfig } from '$lib/server/auth/config';

export function load({ locals, url }) {
  if (locals.user) {
    throw redirect(302, url.searchParams.get('next') || '/admin');
  }

  return {
    devBypassEnabled: authConfig.allowDevBypass
  };
}
