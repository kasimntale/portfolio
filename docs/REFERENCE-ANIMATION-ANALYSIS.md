# Reference animation analysis — automatic Matrix portrait

## Scope and method

The requested `juank115/reverse-engineerskill` skill was installed with the exact requested command and retained under `.agents/skills/reverse-engineering`, with `skills-lock.json`. Its full SKILL.md and report template were read. The applicable workflow is: identify the target, inspect available evidence, observe behavior, distinguish facts from hypotheses, implement independently, then report actual tests. Binary triage, disassembly, unknown-executable execution, malware indicators, and firmware tracks are inapplicable to this authorized website UI task; none were executed.

## Confirmed reference observations

A request to `https://landonorris.com/` was blocked by the cloud outbound proxy: CONNECT returned HTTP 403 before the reference could be reached. No reference HTML, screenshots, animation timeline, shaders, assets, or live browser interaction were successfully observed. This is an environment access limitation, not evidence that the reference itself is unavailable.

Therefore there are **no independently confirmed visual/technical findings about that live site in this session**. No source code, shaders, assets, or branding from that site were copied.

## Hypotheses, not observations

Layered portrait composition, spatial masking, displacement, independently timed renderer loops, and luminance-driven glyph fields are plausible techniques for a cinematic transformation. These are general graphics approaches selected from the user's requested behavior, not claims about the reference's implementation.

## Original implementation

- A 14-second timeline holds the photograph, progressively dissolves it into binary, holds an animated binary face, and reconstructs the photograph. Transition endpoints match so the loop is continuous.
- The local portrait is sampled for luminance. Thousands of visible, atlas-rendered `0` and `1` glyphs carry this brightness structure, while an approximate head/shoulder silhouette suppresses unrelated background. This is an image-based interpretation, not a reconstructed 3D face or machine-learned segmentation.
- A spatial threshold field spreads the transition through the face; it is not a uniform photo-opacity fade. Small displacement is restricted to transition intervals.
- Native WebGL supplies the enhanced renderer without new runtime dependencies. A Canvas 2D renderer uses the same photograph, luminance, spatial dissolve, and timing at a smaller grid/frame budget.
- Automatic quality starts conservatively, considers save-data/memory/core constraints, measures delivered frame cadence, and can lower rendering resolution and rate. Those observations are not GPU benchmarks or a guarantee of 60 FPS.
- Both renderers use the same source-cover transform. The photograph is present in server HTML while initialization occurs. Visibility, reduced motion, resize, context-loss fallback, pause/resume, and cleanup are explicit.

## Identity provenance

`public/images/portrait.webp` is the previously saved dark-background treatment made from the photograph supplied by Ntale Kasim in chat. It is restored from the workspace archive, not a newly invented likeness. The unmodified original upload was not accessible as a local file; exact original pixel fidelity is not claimed. A local replacement requires only the content configuration and crop controls.

## Validation evidence

See `docs/MATRIX-VALIDATION.md` for actual results. Playwright stage captures and observation data are written to `test-results/` for the current run; that generated directory is intentionally ignored by Git. Public Vercel deployment health is separate from local validation and is not established by a build alone.
