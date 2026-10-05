# Faxriddin Mo‘ydinxonov — Portfolio

Personal portfolio site. Built with Astro, GSAP and Lenis.

## Edit content
All text lives in `src/data/profile.ts` — stats, about, skills, projects, experience, links.

- **Photo:** add `public/me.jpg`, then set `photo: '/me.jpg'` in `profile.ts`.
- **Résumé:** replace `public/Faxriddin_Moydinxonov_CV.pdf`.
- **Share image / icons:** edit `scripts/make-images.mjs`, then run `node scripts/make-images.mjs`.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:4321

## Deploy (Vercel)
1. Sign in at vercel.com with GitHub.
2. **Add New → Project** → import this repo → **Deploy** (Astro is detected automatically).
3. In **Settings → Environment Variables**, add `SITE_URL` = your live address
   (e.g. `https://faxriddin.vercel.app`), then **Redeploy**.

Every push to `main` redeploys the site automatically.
