import { test } from "node:test";
import assert from "node:assert/strict";
import {
  chooseQuality,
  clampPoint,
  isSettled,
  stepReveal,
  qualityProfiles,
} from "../../src/lib/reveal.ts";
test("conservative defaults and device constraints select the correct profile", () => {
  assert.equal(chooseQuality({}), "balanced");
  for (const options of [
    { reducedMotion: true },
    { coarse: true },
    { saveData: true },
    { memory: 2 },
  ])
    assert.equal(chooseQuality(options), "low");
  assert.equal(qualityProfiles.low.animatedCode, false);
});
test("interpolation approaches the target without overshooting and contracts on exit", () => {
  const target = { x: 320, y: 230, radius: 155 };
  let state = { x: 0, y: 0, radius: 0 };
  for (let i = 0; i < 80; i++) {
    const next = stepReveal(state, target, 1 / 60, 18);
    assert.ok(next.x >= state.x && next.x <= target.x);
    assert.ok(next.radius >= state.radius && next.radius <= target.radius);
    state = next;
  }
  assert.ok(isSettled(state, target));
  const smaller = stepReveal(state, { ...target, radius: 0 }, 1 / 60, 18);
  assert.ok(smaller.radius < state.radius);
});
test("resuming after a background tab does not cause an interpolation jump", () => {
  const a = { x: 0, y: 0, radius: 0 },
    b = { x: 400, y: 200, radius: 150 };
  assert.deepEqual(stepReveal(a, b, 5, 18), stepReveal(a, b, 0.05, 18));
  assert.deepEqual(stepReveal(a, b, -1, 18), a);
});
test("pointer coordinates stay within the image after resize or pointer capture", () => {
  assert.deepEqual(clampPoint(-20, 600, 300, 400), { x: 0, y: 400 });
  assert.deepEqual(clampPoint(40, 50, 300, 400), { x: 40, y: 50 });
});
