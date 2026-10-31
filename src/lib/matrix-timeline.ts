export const MATRIX_CYCLE_SECONDS = 14;
export type MatrixPhase =
  "portrait" | "transformation" | "matrix" | "reconstruction";
const smooth = (n: number) => {
  const t = Math.max(0, Math.min(1, n));
  return t * t * (3 - 2 * t);
};
export function matrixTimeline(seconds: number): {
  phase: MatrixPhase;
  blend: number;
  cycle: number;
} {
  const elapsed = Math.max(0, seconds);
  const t = elapsed % MATRIX_CYCLE_SECONDS;
  const cycle = Math.floor(elapsed / MATRIX_CYCLE_SECONDS);
  if (t < 2.2) return { phase: "portrait", blend: 0, cycle };
  if (t < 5.8)
    return { phase: "transformation", blend: smooth((t - 2.2) / 3.6), cycle };
  if (t < 9.4) return { phase: "matrix", blend: 1, cycle };
  if (t < 12.8)
    return {
      phase: "reconstruction",
      blend: 1 - smooth((t - 9.4) / 3.4),
      cycle,
    };
  return { phase: "portrait", blend: 0, cycle };
}
export type MatrixQuality = "low" | "balanced" | "high";
export const matrixProfiles = {
  low: { columns: 44, rows: 64, fps: 20, dpr: 1, maxWidth: 480 },
  balanced: { columns: 76, rows: 110, fps: 30, dpr: 1.25, maxWidth: 800 },
  high: { columns: 96, rows: 140, fps: 60, dpr: 1.5, maxWidth: 1000 },
};
export function portraitCover(
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number,
  position = "50% 50%",
  zoom = 1,
) {
  const parts = position
    .split(/\s+/)
    .map((n) => Math.max(0, Math.min(1, parseFloat(n) / 100)));
  const scale =
    Math.max(width / imageWidth, height / imageHeight) * Math.max(1, zoom);
  const w = imageWidth * scale,
    h = imageHeight * scale;
  return {
    x: (width - w) * (Number.isFinite(parts[0]) ? parts[0] : 0.5),
    y: (height - h) * (Number.isFinite(parts[1]) ? parts[1] : 0.5),
    width: w,
    height: h,
  };
}
