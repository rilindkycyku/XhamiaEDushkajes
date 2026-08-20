# CLAUDE.md

Guidance for AI assistants working in this repository. Read this before touching code.

## What this is

**XhamiaEDushkajes** — the public website of the Dushkajë mosque in Kaçanik, Kosovo. React 18 +
Vite SPA, static, no backend of its own. It shows prayer times, weekly activities, the 99 names,
a Zakat calculator, donation information, galleries, and a Facebook/YouTube presence.

It is a **content site for the congregation**, so two things matter more than they would elsewhere:

- **SEO and structured data.** This site exists to be found. `components/SEO.jsx` builds
  Helmet tags and JSON-LD (`Mosque`, breadcrumbs) per route, and `public/sitemap.xml` and
  `robots.txt` are maintained by hand.
- **It must work on old phones and bad connections.** `@vitejs/plugin-legacy` targets Chrome ≥ 49 /
  Safari ≥ 10 / Samsung ≥ 4, the PWA precaches everything, and images ship pre-optimized.

All content is **Albanian**. Deployed as a static SPA on Vercel (`vercel.json` rewrites everything
to `/`).

The one outbound call the site makes on the user's behalf is the contact form, which posts through
**EmailJS** from the browser. There is no server to add here.

## Commands

```bash
npm install
npm run dev       # vite --host, port 5173
npm run build
npm run preview
```

There is **no test suite**. ESLint is in `devDependencies` but there is **no config file and no
`lint` script**, so `npm run lint` does not exist — don't put it in a commit message as if it ran.
Verification is manual, in a browser, and the commit body is where you say what you checked.
`lighthouse.json` at the root is a saved Lighthouse report, kept as a reference point.

## House style

- Content is Albanian; identifiers mix Albanian and English (`vaktet`, `emriXhamis`, `kohaTeravise`
  next to `siteConfig`, `consentAccepted`). Match the file you are editing.
- Commit subjects are short and mostly Albanian (`Perditesime te ndryshme`, `Jane shtuar 99
  Emrat`), with occasional conventional prefixes (`docs: …`) on tooling commits. Read `git log`.
- **Never leave English text on screen.**

## Layout

```
src/
  App.jsx        Routes (all pages React.lazy), Header/Footer shell, consent-gated analytics
  main.jsx       Entry; font imports live here, not in CSS (see gotchas)
  index.css      Tailwind v4 entry + the @theme token block
  pages/         One file per route
  components/    Header, Footer, Hero, PrayerTimes, VaktetTicker, FotoGallery, VideoGallery,
                 ZekatCalculator, EsmaulHusnaWidget, GlobalQuranRadio, FacebookEmbed,
                 YouTubeChannelEmbed, CookieConsent, SEO, ScrollToTop
  data/          site.json, vaktet-e-namazit.json, aktivitetejavore.json, dhuro-per-xhami.json
  hooks/         useConsentAccepted
  lib/           analytics.js
  assets/video/  The mosque video
public/          favicon set, logo, robots.txt, sitemap.xml, img/, esmaul-husna.json
```

Routes, all lazy: `/`, `/rrethxhamis`, `/aktivitetejavore`, `/kohetenamazitpersot`,
`/dhuroperxhamin`, `/esmaul-husna`.

## Architecture rules

### 1. Content lives in `src/data/*.json`, not in JSX

Mosque name, imam, address, social links, the welcome text, the Ramadan block and its messages are
all in `site.json`, read as `siteConfig`. Weekly activities and donation details are their own
files. Prayer times are a bundled calendar (`vaktet-e-namazit.json`), one row per day with `H:mm`
strings — **data, not a calculation**, authored elsewhere and shipped.

Changing text on the site should almost always be a JSON edit. If you find yourself typing Albanian
copy into a component, check whether it belongs in `site.json` first.

The **Ramadan flag is global**: `siteConfig.ramazan.active` changes the header height (`App.jsx`
picks a different top padding) as well as what is displayed. Toggling it affects layout, so check
both states.

### 2. Analytics is consent-gated, and that gate is load-bearing

`CookieConsent` writes `cookie-consent` to `localStorage` and dispatches a
`cookie-consent-changed` event; `useConsentAccepted` listens for it. `<Analytics />` (Vercel) is
rendered **only** when consent is accepted.

Anything new that tracks, embeds a third party, or sets a cookie goes behind the same hook. Don't
render it unconditionally "just for now".

`lib/analytics.js` handles the PWA-specific GA problems: an installed app parses `index.html` once,
so a single mount-time `page_view` is all GA would ever see, and hits made offline are lost
outright. It re-sends `page_view` after the GA4 session timeout, beats a heartbeat, and queues
offline hits — with `offline_replay` / `offline_time` params, because GA4 stamps a hit when it
*arrives*. The service worker's matching half is the `NetworkOnly` + Background Sync rule in
`vite.config.js`. Change one and you must change the other.

### 3. SEO is per-route and hand-maintained

`SEO.jsx` holds `SITE_URL`, the default description/keywords/image, a `BREADCRUMB_MAP` keyed by
path, and the JSON-LD builders. **Adding a page means four edits**, not one:

1. The page file in `src/pages/`.
2. A `lazy` import and `<Route>` in `App.jsx`.
3. A `BREADCRUMB_MAP` entry in `SEO.jsx`, plus whatever `<SEO>` props the page passes.
4. `public/sitemap.xml`.

Then add it to the header/footer navigation.

### 4. Performance budget

- Vendor chunks are split by hand in `vite.config.js` (`vendor`, `framer`, `icons`). If you add a
  heavy dependency, decide which chunk it belongs in.
- Every page is `React.lazy` behind a single `Suspense` fallback in `App.jsx`.
- Images are optimized at build time by `vite-plugin-image-optimizer` and committed in modern
  formats (`.webp` / `.avif`). Commit the optimized file, not a 4 MB original.
- Animations are Framer Motion; `react-intersection-observer` drives reveal-on-scroll so nothing
  animates off-screen.

## Gotchas

- **Tailwind is v4, and `tailwind.config.cjs` is not being read.** The entry is
  `@import "tailwindcss"` in `src/index.css` and the theme is the `@theme { --color-… }` block right
  below it. v4 ignores a JS config unless `@config` points at it, and nothing does. Edit `@theme`;
  the `.cjs` file is a v3 leftover. (Deleting it would be a reasonable cleanup — just don't "fix" a
  color there and expect it to apply.)
- **Fonts are imported from `src/main.jsx`, not from CSS, on purpose.** The CSS `@import` left
  `./files/...` references in the built stylesheet without Vite copying the `.woff2` assets, and the
  fonts vanished on Vercel. There's a comment in `index.css` saying so — don't move them back.
- **`src/pages/Kontakti.jsx` exists but has no route.** It is reachable only if you add one; the
  breadcrumb map still lists `/kontakti`. Decide deliberately before wiring or removing it.
- The contact page reads `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` and
  `VITE_EMAILJS_PUBLIC_KEY` from the environment. There is no `.env.example`; these are set in
  Vercel. `VITE_`-prefixed variables are **public** — never put a private key behind that prefix.
- `vite.config.js` proxies `/api` to `http://localhost:3001` ("our Express proxy"). **No such server
  exists in this repository.** Nothing in `src/` calls `/api` today; treat the proxy as vestigial
  rather than as evidence of a backend.
- `vercel.json` rewrites **everything** to `/`, including paths that look like files. Static assets
  under `public/` are served before the rewrite, but be careful adding routes that resemble file
  paths.
- Prayer times are `H:mm` strings, sometimes without a leading zero. Parse with the helpers already
  in the prayer components, not with `Date` or string comparison.
