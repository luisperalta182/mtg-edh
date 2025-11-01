import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [vue()],
  output: 'server',
  server: { host: true },
});


