# Behind the Code — Ntale Kasim

An original software-engineering portfolio built around the human behind the technology. The signature `CodeRevealPortrait` reveals a curated computational layer through a soft, pointer-following mask. The website includes an editorial introduction, four project case-study routes, filterable engineering disciplines, an experience section, and direct contact links.

## Local development

Use **Node.js 22.x**, at least 22.12.0, and npm. `.nvmrc`, `package.json`, and CI agree on Node 22. No API keys, database, paid services, or external font calls are required.

```sh
npm ci
npm run dev
```

The development server uses port 3000. Windows 10 users can run the same commands in PowerShell. This project needs neither Docker nor a GPU-specific development environment. On an 8 GB laptop, keep build/test workers modest; browser tests use two workers.

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm start
```

TypeScript 6.0.2 is intentional: the current Next.js ESLint toolchain does not support TypeScript 7. Dependency versions are locked. `npm run format:check` checks formatting; `npm run format` applies it.

## Architecture

```text
src/app/                              App Router pages, metadata, loading/error/404 states
src/app/projects/[slug]/               Four statically generated project case studies
src/components/portrait/               CodeRevealPortrait and inline image fallback
src/components/motion-provider.tsx     GSAP / @gsap/react page and scroll choreography
src/components/skills-explorer.tsx     Accessible discipline filters
src/hooks/use-code-reveal.ts           Demand-driven pointer/touch interpolation and cleanup
src/lib/reveal.ts                      Pure interpolation, bounds, and quality functions
src/content/portfolio.ts               Identity, headline, crop, projects, skills, experience
src/content/code-snippets.ts           Local pre-tokenized decorative programming examples
public/images/portrait-placeholder.svg Neutral local asset; no invented identity
tests/unit/                          Node tests for reveal behavior and quality selection
tests/*.spec.ts                      Playwright component-interaction and whole-site checks
```

The content, rendering, event lifecycle, animation, and routes are separate. Next.js server-renders the content; client islands handle the portrait, navigation, filters, and animation. No editor runtime, Three.js, React Three Fiber, or smooth-scroll library is shipped. Native browser scrolling is preserved.

## Design system

The identity uses deep charcoal (`#171918`, hero `#171b18`), warm off-white (`#eeeae1`), and muted terminal green (`#91b79c`). Barlow Condensed supplies the oversized display type; Manrope supplies body copy; the system monospace stack supplies technical annotations. Fonts are bundled locally through `next/font/local`.

Design tokens and responsive layouts are in `src/app/globals.css`. Generous editorial spacing, fine borders, restrained concept illustrations, and typographic hierarchy connect sections. The desktop hero uses an overlapping name and portrait; mobile uses stacked name typography with visible reveal controls. No real-world performance scores, project achievements, or proficiency percentages are invented.

## Signature portrait

`CodeRevealPortrait` is reusable and accepts:

| Prop             | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `src`            | Local photograph URL; defaults to the neutral placeholder           |
| `alt`            | Accurate description of the supplied photograph                     |
| `isPlaceholder`  | Show the explicit placeholder label                                 |
| `position`       | CSS object-position, e.g. `50% 38%`, applied to both layers         |
| `zoom`           | Matching scale for both portrait layers; default `1`                |
| `initialQuality` | Conservative SSR quality; device settings refine it after hydration |

The base image stays recognizable. A second aligned image carries a subdued grid and authentic TypeScript/React, Python/ML, HTTP API, data-structure, SQL, and test examples. These snippets are decorative and hidden from assistive technology. They are local typed data, not an editor or randomized text.

The mask radius grows on entry, follows interpolated pointer coordinates, and contracts on exit. Touch press/drag also reveals the layer; `touch-action: pan-y` allows normal page scrolling. The visible **Reveal the code** / **Hide the code** button offers a persistent, non-flashing alternative using keyboard, touch, or mouse. Its `aria-pressed` state reflects the user's toggle.

The `Detail` control selects three genuine CSS profiles:

- **Low:** smaller lens, static code, no atmospheric movement. Automatically used for reduced motion, touch/coarse pointers, data saving, or reported memory below 4 GB.
- **Balanced:** default desktop profile, soft lens, restrained depth and slow decorative movement.
- **High:** wider lens and more visible computational detail with slightly faster movement. It remains a CSS effect, not a shader or a 3D facial reconstruction.

WebGL was deliberately omitted because the baseline meets the brief with lower complexity and no mandatory GPU canvas. Pointer movement never calls a React state setter. A requestAnimationFrame loop runs only while the mask is settling, pauses offscreen/when hidden, and is canceled on cleanup. Code motion pauses outside a visible active reveal. Quality controls and full-layer toggles use ordinary React state.

With reduced motion, the mask responds directly, atmospheric movement and scroll animations stop, and quality is locked to low. If CSS masks are unavailable, the full-layer button still works. If an image fails, a labeled inline SVG replaces it without a second network request.

### Replace the photograph

The new brief defaults to a neutral placeholder until a photograph is supplied. No substitute person is presented as Ntale Kasim. The previous edited photo has been preserved outside the checkout at `/workspace/portfolio-asset-archive/previous-portrait-treatment.webp` in this workspace; it is not an active identity asset or a required deployment file.

1. Add an approved local JPG, PNG, or WebP under `public/images/`. Prefer a centered 3:4 portrait, roughly 1080 pixels wide, compressed to a few hundred KB or less.
2. In `src/content/portfolio.ts`, set `portrait`, `portraitIsPlaceholder: false`, `portraitPosition`, and `portraitZoom`.
3. Check desktop/mobile crop alignment. Both image layers share these controls, so no animation code needs to change.
4. Keep the neutral asset as the intentional default and the inline fallback for failures.

## Motion and accessibility

GSAP, ScrollTrigger, and `@gsap/react` own page-entry, typography, project transitions, subtle hero parallax, and a short desktop work-index pin. Motion initializes inside hydrated page boundaries. Scoped contexts revert on route changes and reduced-motion changes. No second scrolling system competes with the browser.

Intentional desktop scrolling expands the computational layer as the hero moves into the About section. Low quality and reduced motion skip that expansion. The portrait is closed on first render; the visitor controls pointer/touch/toggle reveals. Offscreen and page-visibility observers suspend unnecessary work.

Navigation includes a skip link, active-section indicators, visible focus states, mobile focus containment, Escape dismissal, and restored focus. Project routes have meaningful titles, descriptions, explicit status, and a custom 404. Skills filters are native buttons with pressed states and a polite result count. The page includes SEO metadata, generated Open Graph imagery, robots, and sitemap routes.

## Editable content and credibility

Edit `src/content/portfolio.ts` for the headline (initially “Building software. Solving real problems.”), identity, project descriptions, technology lists, experience, skills, email, and GitHub. Optional LinkedIn, résumé, source-code, and demo URLs are explicitly empty or absent until supplied; missing links are never rendered as dead buttons.

MirrorLoad, Academy OS, and PocketLedger are owner-supplied project directions with unverified implementation details. WetGuard is explicitly a concept. Original illustrations are labeled **concept visuals / media placeholders**, not product screenshots. Project status and proposed technology areas remain editable. Replace these notes with verified details, screenshots, employer names, dates, and outcomes when available.

## Tests

```sh
npx playwright install --with-deps chromium
npm run test:unit
npm run build
npm test
```

Playwright starts a production server automatically; keep port 3000 free when testing. To use system Chromium in this cloud workspace:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

On Windows, set the same environment variable with PowerShell's `$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if using an existing Chrome/Chromium installation, or use Playwright's installed browser. Unit tests run the actual interpolation/quality module. Browser tests exercise the rendered component's pointer, touch, keyboard, reduced-motion, and missing-image behavior; they also cover routes, responsive overflow, navigation, project links, metadata, 404 handling, console errors, skills filtering, and automated accessibility scans. CI runs lint, unit tests, type checking, production build, and desktop/mobile browser checks.

Browser emulation does not establish physical Windows/Intel GPU, Safari, Android, or iOS performance. No Lighthouse score is claimed. Use the deployed app and representative devices for release performance measurements.

## Deployment

This is a normal Next.js application rooted at the repository root, not `src` or `src/app`.

| Vercel setting   | Value                                       |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js                                     |
| Root directory   | Repository root (blank/default)             |
| Node.js          | `22.x`                                      |
| Install          | `npm ci`                                    |
| Build            | `npm run build`                             |
| Output directory | Framework default; disable custom overrides |

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin before building (see `.env.example`). It controls metadata/sitemap URLs and does not rewrite or redirect the homepage. No `vercel.json`, catch-all rewrite, static export, or external infrastructure is needed. The image and Open Graph features require a Next.js-capable host; copying files directly to GitHub Pages is not supported by this configuration.

For self-hosting, run `npm ci`, `npm run build`, then `npm start` behind an HTTPS reverse proxy.

If npm reports `Unknown env config "cache-dir"` in Vercel, replace the externally supplied `NPM_CONFIG_CACHE_DIR` with the supported `NPM_CONFIG_CACHE`, keeping its directory value. For custom commands use `--cache <path>`, and in npmrc use `cache=<path>`. Keep default dependency caching enabled. A repository npmrc cannot remove an invalid host environment variable.

If a Vercel preview returns platform `NOT_FOUND` while the local production homepage works, verify deployment status, correct Git commit, framework/root/output settings, direct deployment URL, branch-alias assignment, permissions, and Deployment Protection in the dashboard. Do not assume an old branch alias follows new `main` deployments. Dashboard configuration and actual remote deployment health require authenticated access; a successful local build alone does not verify them.

## Verified implementation results

Validation completed on Node 22.23.4 in the cloud workspace:

- Frozen `npm ci`, ESLint, TypeScript, formatting checks, and the production build passed.
- Four unit tests passed against the actual reveal math and quality-selection module.
- Playwright: **29 passed, 3 intentionally skipped** across desktop and mobile Chromium. The skips are mouse-only, touch-only, and desktop-scroll-only checks on the opposite device profile.
- Automated WCAG A/AA scans passed on the home and MirrorLoad detail pages in both profiles. This is not a substitute for a full assistive-technology audit.
- Final development-mode home/project transitions reported no browser console or hydration errors in the inspected desktop/mobile sessions.
- Desktop/mobile layouts and reveal-control placement were visually inspected. No horizontal overflow was observed in those sessions.
- Production dependency audit reported zero known vulnerabilities at validation time. npm emits a deprecation notice for the ESLint 9 version selected by the Next.js lint toolchain; linting itself passes.

These results validate the current workspace, not the health of a remote Vercel deployment or every physical device. No external deployment was performed for this implementation.
