// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL to the domain you actually deploy to (e.g. on Vercel:
// Project → Settings → Environment Variables). It drives the canonical URL,
// Open Graph tags, robots.txt and the sitemap — so it must be a live domain.
const site = process.env.SITE_URL || 'https://faxriddin.vercel.app';

export default defineConfig({
  site,
  integrations: [sitemap()],
});
