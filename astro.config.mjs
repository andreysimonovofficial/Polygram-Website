import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
  site: 'https://polygram.id',
  trailingSlash: 'never',
  prefetch: { defaultStrategy: 'hover' },
  image: { quality: 85, sizes: [480, 768, 1024, 1280, 1920] },
});
