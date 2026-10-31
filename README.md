# Behind the Code — Ntale Kasim

An original software-engineering portfolio built around the human behind the technology. The signature `MatrixPortrait` automatically transforms the photograph into a luminance-shaped binary face and reconstructs it in a repeating 14-second cycle. The website includes an editorial introduction, four project case-study routes, filterable engineering disciplines, an experience section, and direct contact links.

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
src/components/portrait/               MatrixPortrait and inline image fallback
src/components/motion-provider.tsx     GSAP / @gsap/react page and scroll choreography
src/components/skills-explorer.tsx     Accessible discipline filters
src/components/portrait/matrix/        Native WebGL shaders and Canvas fallback renderer
src/lib/matrix-timeline.ts             Shared cycle, quality profiles, and cover-crop math
src/content/portfolio.ts               Identity, headline, crop, projects, skills, experience
public/images/portrait.webp            Supplied-photo treatment used as the active identity
tests/unit/                          Node tests for reveal behavior and quality selection
tests/*.spec.ts                      Playwright component-interaction and whole-site checks
```

The content, rendering, event lifecycle, animation, and routes are separate. Next.js server-renders the content; client islands handle the portrait, navigation, filters, and animation. No editor runtime, Three.js, React Three Fiber, or smooth-scroll library is shipped; the enhanced renderer uses the browser’s native WebGL API. Native browser scrolling is preserved.

## Design system

The identity uses deep charcoal (`#171918`, hero `#171b18`), warm off-white (`#eeeae1`), and muted terminal green (`#91b79c`). Barlow Condensed supplies the oversized display type; Manrope supplies body copy; the system monospace stack supplies technical annotations. Fonts are bundled locally through `next/font/local`.

Design tokens and responsive layouts are in `src/app/globals.css`. Generous editorial spacing, fine borders, restrained concept illustrations, and typographic hierarchy connect sections. The desktop hero uses an overlapping name and portrait; mobile uses stacked name typography with visible reveal controls. No real-world performance scores, project achievements, or proficiency percentages are invented.

## Automatic Matrix portrait

`MatrixPortrait` takes `src`, `alt`, `isPlaceholder`, `position`, and `zoom`. Its animation starts without mouse movement, hover, clicking, or touching, on both desktop and mobile.

The 14-second loop holds the photo (0–2.2 s), spatially transforms it (2.2–5.8 s), shows a flowing binary face (5.8–9.4 s), reconstructs the image (9.4–12.8 s), and holds the photo again before the seamless repeat. The GLSL renderer draws real `0` and `1` glyphs from a local generated atlas; source-image luminance and an approximate head/shoulder mask shape the digital face. Transition fields spread through the image instead of applying a uniform opacity fade. No 3D reconstruction or learned face segmentation is claimed.

A conservative balanced profile starts at capped DPR 1.25 / a 30 FPS render budget, with 76 × 110 potential glyph cells. High allows a 60 FPS budget and a denser grid. Actual performance is device-dependent. Data saving, low reported memory/core counts, unavailable WebGL, or context loss use a smaller Canvas-based automatic cycle. Delivered frame cadence is measured and automatic quality can lower the resolution/rate. Quality can be adjusted manually. No high-end GPU is assumed.

The real photograph is rendered in server HTML while the client-only renderer loads. Resize uses the same cover-crop transform for photograph and luminance sampling. Offscreen/hidden-tab work pauses; returning resumes the stored clock. GPU programs, shaders, buffers, textures, observers, listeners, and animation-frame requests are cleaned up. The visible pause button returns to a still photo; resume continues the animation. Reduced motion selects a still photograph automatically.

### Portrait identity and replacement

`public/images/portrait.webp` is restored from the earlier dark-background treatment made from the photograph Ntale Kasim supplied in chat. It is not a newly invented likeness. The original, unmodified upload was not available as a local file; exact original pixel fidelity is not claimed.

To replace it, add an approved local JPG/PNG/WebP, then update `portrait`, `portraitIsPlaceholder: false`, `portraitPosition`, and `portraitZoom` in `src/content/portfolio.ts`. A centered 3:4 portrait with a dark background works best. Adjust the approximate silhouette in the renderers if the new composition differs substantially. Keep the placeholder SVG and inline fallback for loading failures. The animation timeline needs no changes.

## Reference research and installed skill

The exact requested reverse-engineering skill is retained in `.agents/skills/reverse-engineering`; `skills-lock.json` records its source. See [reference analysis](docs/REFERENCE-ANIMATION-ANALYSIS.md). The reference website was blocked by the environment proxy, so no live reference observations or claims about its shaders are made. The installed binary-analysis workflow was adapted to relevant website observation/reporting tasks; no binary-disassembly or malware-execution steps were applicable.

## Motion and accessibility

GSAP, ScrollTrigger, and `@gsap/react` own page-entry, typography, project transitions, subtle hero parallax, and a short desktop work-index pin. Motion initializes inside hydrated page boundaries. Scoped contexts revert on route changes and reduced-motion changes. No second scrolling system competes with the browser.

Hero parallax remains controlled by GSAP; it no longer controls the portrait transformation. The renderer owns its independent visible-time clock, so scrolling does not hijack or restart the automatic cycle. Offscreen and page-visibility observers suspend unnecessary work.

Navigation includes a skip link, active-section indicators, visible focus states, mobile focus containment, Escape dismissal, and restored focus. Project routes have meaningful titles, descriptions, explicit status, and a custom 404. Skills filters are native buttons with pressed states and a polite result count. The page includes SEO metadata, generated Open Graph imagery, robots, and sitemap routes.

## Editable content and credibility

Edit `src/content/portfolio.ts` for the headline (initially “Building software. Solving real problems.”), identity, project descriptions, technology lists, experience, skills, email, and GitHub. The supplied LinkedIn profile is linked in Contact. Optional résumé, source-code, and demo URLs are explicitly empty or absent until supplied; missing links are never rendered as dead buttons.

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

On Windows, set the same environment variable with PowerShell's `$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if using an existing Chrome/Chromium installation, or use Playwright's installed browser. Unit tests run the actual timeline/cover/quality module. Browser tests observe two full cycles without pointer input on desktop and mobile, capture six animation stages, and exercise pause/resume, hidden/offscreen handling, context-loss fallback, reduced-motion, and missing-image behavior; they also cover routes, responsive overflow, navigation, project links, metadata, 404 handling, console errors, skills filtering, and automated accessibility scans. CI runs lint, unit tests, type checking, production build, and desktop/mobile browser checks.

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

## Validation and visual evidence

See [Matrix validation](docs/MATRIX-VALIDATION.md) for the actual results of this revision. Stage screenshots and test diagnostics are written to `test-results/`; those generated artifacts are intentionally ignored by Git. A successful local build does not verify the accessibility of a remote Vercel deployment. No external deployment is implied by this implementation.
