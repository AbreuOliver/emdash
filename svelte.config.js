import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    files: {
      routes: 'src/routes',
      lib: 'src/lib',
    },
    paths: {
      base: '/admin',
    },
  },
};

export default config;
