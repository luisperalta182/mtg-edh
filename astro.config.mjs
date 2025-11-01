import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [vue()],
  output: 'server',
  adapter: netlify(),
  server: { host: true },
});


