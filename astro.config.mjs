import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [vue()],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: true },
});


