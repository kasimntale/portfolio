import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matrixTimeline,
  portraitCover,
  MATRIX_CYCLE_SECONDS,
  matrixProfiles,
} from "../../src/lib/matrix-timeline.ts";
test("automatic cycle visits all four states and returns seamlessly", () => {
  assert.equal(MATRIX_CYCLE_SECONDS, 14);
  assert.equal(matrixTimeline(1).phase, "portrait");
  assert.equal(matrixTimeline(4).phase, "transformation");
  assert.equal(matrixTimeline(7).phase, "matrix");
  assert.equal(matrixTimeline(11).phase, "reconstruction");
  assert.equal(matrixTimeline(13.99).blend, 0);
  assert.deepEqual(matrixTimeline(14), {
    phase: "portrait",
    blend: 0,
    cycle: 1,
  });
  assert.equal(matrixTimeline(28).cycle, 2);
});
test("both transition boundaries are continuous and clamped", () => {
  for (const t of [2.2, 5.8, 9.4, 12.8, 14])
    assert.ok(
      Math.abs(
        matrixTimeline(t - 0.0001).blend - matrixTimeline(t + 0.0001).blend,
      ) < 0.001,
    );
  for (let t = 0; t < 30; t += 0.05) {
    const value = matrixTimeline(t).blend;
    assert.ok(value >= 0 && value <= 1);
  }
});
test("cover crop shares a predictable alignment for photograph and digit sampling", () => {
  assert.deepEqual(portraitCover(300, 400, 600, 800), {
    x: 0,
    y: 0,
    width: 300,
    height: 400,
  });
  const crop = portraitCover(300, 300, 600, 800);
  assert.equal(crop.y, -50);
  assert.equal(crop.width, 300);
  assert.equal(
    matrixProfiles.balanced.columns * matrixProfiles.balanced.rows,
    8360,
  );
});
