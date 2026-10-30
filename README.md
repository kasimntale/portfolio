# Ntale Kasim — Developer Portfolio

An original editorial portfolio built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, Lenis, and React Three Fiber. Charcoal, warm ivory, and vermilion frame a portrait-led introduction, four project explorations, technical interests, an engineering journey, and direct contact links.

## Run locally

Use Node.js 22.x (22.12.0 or later; see `.nvmrc`) and npm. No API keys, database, paid services, or external font requests are required.

```sh
npm ci
npm run dev
```

Open the development server on port 3000. For production:

```sh
npm run typecheck
npm run build
npm start
```

The default development command uses Turbopack. Close other heavy applications on an 8 GB laptop; the application does not need Docker or background services. Development on Windows 10 uses the same npm commands in PowerShell.

## Architecture

```text
src/app/                       App Router routes, metadata, sitemap, error/loading/404 views
src/app/projects/[slug]/        Statically generated project detail routes
src/components/                Navigation, sections, portrait, original concept illustrations
src/components/webgl/           Lazy-loaded demand-rendered portrait shader
src/content/portfolio.ts        Typed identity, projects, skills, journey content
src/lib/site.ts                Canonical origin configuration
public/images/                 Optimized local portrait
tests/                        Playwright browser acceptance tests
```

## Customize content

Edit `src/content/portfolio.ts` to change identity, email, GitHub, skills, experience, and projects. Optional LinkedIn, résumé, repository, and live-demo links render only when a nonempty URL is supplied. Do not use `#` links for missing destinations.

Project descriptions are based on the supplied briefs. Implementation details, proposed stacks, release status, and outcomes are **not independently verified**. Original procedural illustrations are labeled **concept visuals / media placeholders**, not screenshots. Replace these with verified product media and update the status and narrative before presenting them as shipped work. Experience entries intentionally omit unspecified employers and dates. No usage, financial, or performance claims are invented.

### Portrait replacement

The bundled `public/images/portrait.webp` is an AI-assisted dark-background treatment of the photograph supplied by the owner in chat. It is not an independently sourced face or a reconstructed 3D head. Review this treatment before publication; replace it with the original photo if exact photographic fidelity is required.

1. Put your replacement JPG, PNG, or WebP in `public/images/` (portrait ratio near 3:4, preferably 1080 px wide; keep the face centered).
2. Set `profile.portrait` to its root-relative path in `src/content/portfolio.ts` and keep `portraitIsPlaceholder: false`.
3. `next/image` generates responsive image variants. The WebGL lens loads the same local source; keep it reasonably compressed, preferably under 250 KB.
4. If needed, adjust `.portrait-image` and `.portrait-digital-fallback img` object positioning in `globals.css`; the shader uses a centered cover crop. Keep those crops aligned.
5. Delete the old asset once it is no longer referenced. No animation code needs rewriting.

The digital interpretation is a luminance-warped image grid and contour shader. It is an original computational treatment, **not facial mesh reconstruction**.

## Motion, accessibility, and performance

- Server-rendered semantic content and all project routes remain usable without WebGL.
- GSAP owns scroll timelines, reveal effects, and a bounded desktop work-index pin. Lenis updates ScrollTrigger through the same ticker; resources are disposed on route changes and preference changes.
- The portrait shader uses a single plane, capped DPR of 1.25, low-power graphics preference, and demand rendering. Pointer interpolation stops when settled. It unmounts outside the viewport and while the document is hidden.
- Touch devices, reduced-motion users, data-saving connections, and reported memory below 4 GB receive an image/CSS fallback. An accessible button enables the digital layer on every device. WebGL errors fall back to the image.
- Reduced-motion mode disables GSAP/Lenis, CSS transitions, and route-entry animation. Focus indicators, skip navigation, mobile focus management, Escape dismissal, active-section indicators, and named links support keyboard use.
- Fonts are licensed packages bundled locally through `next/font/local`; the portfolio makes no third-party font or analytics calls.

## Browser tests

```sh
npx playwright install --with-deps chromium
npm run build
npm test
```

Playwright starts the production server automatically. If using an existing system Chromium:

```sh
# Linux/macOS
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
# PowerShell (adjust path)
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\path\to\chrome.exe'
npm test
```

Tests cover desktop and mobile layouts, all project routes, anchor navigation, mobile focus containment and dismissal, portrait toggles, reduced-motion and touch fallbacks, WebGL initialization, route cleanup, runtime errors, metadata, sitemap, Open Graph generation, and custom 404 behavior. CI runs TypeScript, production build, and browser tests for pushes and pull requests. No Lighthouse scores are claimed; measure on the actual deployment and representative hardware.

## Deploy

1. Set `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS origin (see `.env.example`). This controls metadata, sitemap, and robots URLs. The default is the owner's GitHub Pages origin as an explicit editable fallback; update it before deploying to another host.
2. Use a Node.js-compatible Next.js host (for example Vercel), or build and run `npm start` behind an HTTPS reverse proxy. The configured application uses Next's image optimization and generated Open Graph images; copying it directly to GitHub Pages as static files is not supported by this configuration.
3. Configure `npm ci`, `npm run build`, and `npm start`; bind `PORT` if the host requires it. There are no secrets to configure.
4. Verify canonical URLs, contact destinations, original portrait fidelity, project details, and optional links before launch. Run the browser suite against production before promoting it.

## Repository replacement

The previous HTML, stylesheet, and all five outdated images have been removed. Git history and GitHub integration are preserved. The rebuild is developed on `feat/immersive-portfolio`; the original parent commit remains available in history, and no merge or push to `main` is required to review this replacement.

## Validation record

Validated in the cloud workspace using Node 22, Next.js production mode, and system Chromium:

- `npm run typecheck`: passed.
- `npm run build`: passed; home, four project pages, 404, robots, sitemap, and Open Graph image generated.
- `npm test`: **17 passed, 1 intentionally skipped** across desktop and mobile Chromium profiles. The skipped case is the WebGL-specific visual/context-loss test on the touch profile; the mobile fallback is covered separately.
- WCAG 2 A/AA and WCAG 2.1 AA axe scans: no violations on the home and MirrorLoad detail pages in desktop/mobile reduced-motion mode. Automated scanning does not replace a full manual accessibility audit.
- `npm audit --omit=dev --audit-level=high`: zero known vulnerabilities at validation time.
- Desktop and mobile screenshots inspected. No Lighthouse benchmark, physical Intel GPU, Windows, Firefox, or Safari result is claimed; the mobile tests use Chromium device emulation.

## Vercel runtime and npm cache configuration

`package.json` pins the runtime to `22.x`, `.nvmrc` selects Node 22, and GitHub Actions reads `.nvmrc`. Use the latest Node 22 patch: the locked accessibility testing dependency requires at least 22.12.0; Next.js requires at least 20.9.0. Dependencies have not been upgraded for this runtime change. In Vercel Project Settings, change Node.js Version from `20.x` to `22.x` to match the package engine and remove the settings-override warning. Use the Next.js framework preset, install with `npm ci`, and build with `npm run build`; no `vercel.json` runtime override is needed.

There is no repository `.npmrc` or `cache-dir` configuration. If Vercel reports `Unknown env config "cache-dir"` or `Unknown user config "cache-dir"`, inspect the project's Vercel environment variables and custom install command:

- Rename `NPM_CONFIG_CACHE_DIR` / `npm_config_cache_dir` to the supported `NPM_CONFIG_CACHE` / `npm_config_cache`, preserving the existing cache directory value.
- Replace a custom `--cache-dir <path>` argument with `--cache <path>`.
- If a generated or user-level `.npmrc` contains `cache-dir=<path>`, use `cache=<path>` instead.
- If no custom cache location is needed, remove the invalid override and retain npm's default cache. Keep GitHub Actions `cache: npm` and Vercel's normal dependency/build caching enabled. Do not clear caches to silence a configuration warning.

Check `npm config get cache` in the build environment to verify the effective cache path. If the invalid environment variable is absent from project/team settings, it may be injected by the Vercel build environment; report that to Vercel rather than adding warning-suppression scripts. External Vercel settings are not controlled by this repository; correct them for all relevant deployment environments and redeploy. A repository `.npmrc` cannot remove an invalid environment variable supplied by the host.
