# Matrix portrait — validation record

## Results

Validated on Node 22.23.4 using the current Next.js production build and system Chromium:

- ESLint: passed.
- TypeScript: passed.
- Production build: passed; homepage, all four project pages, metadata routes, and custom 404 generated.
- Unit tests: **3 passed**. The real timeline visits all four states, crosses cycle boundaries continuously, and shares crop/profile math with the renderers.
- Playwright: **28 passed, 0 skipped** across desktop and mobile Chromium profiles.
- Critical acceptance: each profile observed **two full automatic cycles** with no pointer movement, clicks, or touch input. Tests tracked all four states, observed return to the portrait, and confirmed at least two completed cycles and changing rendered output.
- Pause/resume, offscreen and hidden-tab suspension, reduced motion, context-loss Canvas fallback, missing-image labels, routing, keyboard/mobile navigation, responsive overflow, skills filters, and LinkedIn URL checks passed.
- Automated accessibility scans passed on the homepage and MirrorLoad page in desktop/mobile reduced-motion mode. A full manual assistive-technology audit was not performed.

## Visual captures

Actual stage captures are retained, losslessly converted from the current browser-run PNGs:

| Stage                       | Desktop                                              | Mobile                                              |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| Photograph                  | [image](matrix-captures/desktop/real.webp)           | [image](matrix-captures/mobile/real.webp)           |
| Early transformation        | [image](matrix-captures/desktop/early.webp)          | [image](matrix-captures/mobile/early.webp)          |
| Intermediate transformation | [image](matrix-captures/desktop/half.webp)           | [image](matrix-captures/mobile/half.webp)           |
| Binary face                 | [image](matrix-captures/desktop/matrix.webp)         | [image](matrix-captures/mobile/matrix.webp)         |
| Reconstruction              | [image](matrix-captures/desktop/reconstruction.webp) | [image](matrix-captures/mobile/reconstruction.webp) |
| Return to photograph        | [image](matrix-captures/desktop/return.webp)         | [image](matrix-captures/mobile/return.webp)         |

Capture timing is recorded by the browser test, including phase assertions before and after capture. “Intermediate” is an illustrative point in the spatial transformation, not a claim that exactly 50% of photographic pixels remain. Screenshots show the production layout, including the intentional name overlap.

A real-time unattended [cycle recording](matrix-captures/automatic-cycle.mp4) was captured with Chromium's screencast protocol and encoded with the installed FFmpeg. The recording includes the original photo, transformation, flowing binary, reconstruction, and return. Capture overhead and sparse screencast delivery reduce video frame cadence; it is not a 60 FPS benchmark.

## Performance evidence and limits

In the software-WebGL screencast session, the initial observed cadence was about **16.8 rendered FPS**; the automatic controller lowered quality to the low resolution/frame budget. The session observed 282 rendered frames at 14.52 seconds of visible animation time, returned to the photograph, and completed a cycle. These values describe that instrumented cloud session, not a visitor's physical GPU or a universal performance result. No Lighthouse scores or guaranteed frame rates are claimed.

Reduced motion uses a still photograph. Low-quality Canvas continues the conceptual automatic transformation with fewer cells and a lower frame budget. WebGL context-loss fallback was tested. Desktop/mobile Chromium emulation does not verify every physical Android, iOS, Safari, or GPU configuration.

## Reference and deployment boundaries

The requested reverse-engineering skill installed successfully and remains in the repository. The reference site could not be fetched because the cloud proxy returned CONNECT 403; no live reference behavior was verified or copied. See [reference analysis](REFERENCE-ANIMATION-ANALYSIS.md).

The active photo is the earlier dark-background treatment of the user's supplied image, restored from the workspace archive. No new face was generated for this task. Original-upload pixel fidelity is not claimed.

Vercel deployment health was not verified. After deployment, check the actual deployment URL, GET `/`, all project routes, image loading, two unattended desktop/mobile cycles, reduced-motion settings, and the supplied LinkedIn link. A passing local build does not establish that an old branch-preview alias points at this revision.
