export type Quality = "low" | "balanced" | "high";
export type RevealPoint = { x: number; y: number; radius: number };
export const qualityProfiles = {
  low: { radius: 115, response: 16, animatedCode: false },
  balanced: { radius: 155, response: 18, animatedCode: true },
  high: { radius: 190, response: 22, animatedCode: true },
} satisfies Record<
  Quality,
  { radius: number; response: number; animatedCode: boolean }
>;
export function chooseQuality({
  reducedMotion = false,
  coarse = false,
  saveData = false,
  memory = 4,
}: {
  reducedMotion?: boolean;
  coarse?: boolean;
  saveData?: boolean;
  memory?: number;
}): Quality {
  return reducedMotion || coarse || saveData || memory < 4 ? "low" : "balanced";
}
export function stepReveal(
  current: RevealPoint,
  target: RevealPoint,
  seconds: number,
  response: number,
): RevealPoint {
  const alpha = 1 - Math.exp(-Math.min(Math.max(seconds, 0), 0.05) * response);
  return {
    x: current.x + (target.x - current.x) * alpha,
    y: current.y + (target.y - current.y) * alpha,
    radius: current.radius + (target.radius - current.radius) * alpha,
  };
}
export function isSettled(a: RevealPoint, b: RevealPoint) {
  return (
    Math.abs(a.x - b.x) < 0.15 &&
    Math.abs(a.y - b.y) < 0.15 &&
    Math.abs(a.radius - b.radius) < 0.15
  );
}
export function clampPoint(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  return {
    x: Math.max(0, Math.min(width, x)),
    y: Math.max(0, Math.min(height, y)),
  };
}
