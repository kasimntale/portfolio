"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NeutralPortrait } from "./neutral-portrait";
import {
  matrixProfiles,
  matrixTimeline,
  type MatrixQuality,
} from "@/lib/matrix-timeline";
import type { MatrixRenderer } from "./matrix/renderers";
export type MatrixPortraitProps = {
  src: string;
  alt: string;
  isPlaceholder?: boolean;
  position?: string;
  zoom?: number;
};
export function MatrixPortrait({
  src,
  alt,
  isPlaceholder = false,
  position = "50% 50%",
  zoom = 1,
}: MatrixPortraitProps) {
  const root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    clock = useRef(0);
  const [paused, setPaused] = useState(false),
    [reduced, setReduced] = useState(false),
    [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<"auto" | "canvas">("auto");
  const [choice, setChoice] = useState<"auto" | MatrixQuality>("auto");
  const image = failed ? "/images/portrait-placeholder.svg" : src;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const stage = root.current,
      target = canvas.current;
    if (!stage) return;
    stage.dataset.ready = "false";
    stage.dataset.running = "false";
    stage.dataset.phase = "portrait";
    if (reduced || paused) {
      stage.dataset.renderer = "still";
      return;
    }
    if (!target) return;
    let renderer: MatrixRenderer | undefined,
      disposed = false,
      frame = 0,
      visible = true,
      last = 0,
      lastDraw = 0,
      frames = 0,
      measurementStart = 0,
      measurementFrames = 0;
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    let quality: MatrixQuality =
      choice === "auto"
        ? device.connection?.saveData ||
          (device.deviceMemory ?? 4) < 4 ||
          (navigator.hardwareConcurrency ?? 4) <= 2
          ? "low"
          : "balanced"
        : choice;
    const photo = new window.Image();
    photo.decoding = "async";
    const animate = (timestamp: number) => {
      frame = 0;
      if (disposed || document.hidden || !visible || !renderer) return;
      if (last) clock.current += Math.min(0.25, (timestamp - last) / 1000);
      last = timestamp;
      const interval = 1000 / matrixProfiles[quality].fps;
      if (timestamp - lastDraw >= interval - 1) {
        const state = matrixTimeline(clock.current);
        renderer.draw(clock.current, state.blend);
        lastDraw = timestamp;
        frames++;
        stage.dataset.ready = "true";
        stage.dataset.phase = state.phase;
        stage.dataset.cycle = String(state.cycle);
        stage.dataset.elapsed = clock.current.toFixed(2);
        stage.dataset.frames = String(frames);
        stage.dataset.running = "true";
        if (!measurementStart) measurementStart = timestamp;
        measurementFrames++;
        if (measurementFrames === 45) {
          const fps =
            (measurementFrames * 1000) /
            (timestamp - measurementStart + interval);
          stage.dataset.measuredFps = fps.toFixed(1);
          if (
            choice === "auto" &&
            quality !== "low" &&
            fps < matrixProfiles[quality].fps * 0.65
          ) {
            quality = "low";
            stage.dataset.quality = "low";
            renderer.dispose();
            try {
              renderer = mode === "canvas" ? createFallback() : createGpu();
              renderer.resize();
            } catch {
              setMode("canvas");
              return;
            }
          }
        }
      }
      frame = requestAnimationFrame(animate);
    };
    let factory: typeof import("./matrix/renderers") | undefined;
    const createGpu = () =>
      factory!.createWebGLRenderer(target, photo, quality, position, zoom);
    const createFallback = () =>
      factory!.createCanvasRenderer(target, photo, quality, position, zoom);
    const resume = () => {
      last = 0;
      lastDraw = 0;
      if (!frame && !disposed && visible && !document.hidden && renderer)
        frame = requestAnimationFrame(animate);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      stage.dataset.running = "false";
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
      else stop();
    });
    observer.observe(stage);
    const resize = new ResizeObserver(() => renderer?.resize());
    resize.observe(stage);
    const visibility = () => {
      if (document.hidden) stop();
      else resume();
    };
    document.addEventListener("visibilitychange", visibility);
    const contextLost = (event: Event) => {
      event.preventDefault();
      stop();
      stage.dataset.ready = "false";
      setMode("canvas");
    };
    target.addEventListener("webglcontextlost", contextLost);
    photo.onload = () => {
      void import("./matrix/renderers")
        .then((module) => {
          if (disposed) return;
          factory = module;
          try {
            renderer =
              mode === "canvas" || quality === "low"
                ? createFallback()
                : createGpu();
          } catch {
            if (mode !== "canvas") {
              setMode("canvas");
              return;
            }
            stage.dataset.renderer = "still";
            return;
          }
          stage.dataset.renderer = renderer.kind;
          stage.dataset.quality = quality;
          resume();
        })
        .catch(() => {
          if (!disposed) stage.dataset.renderer = "still";
        });
    };
    photo.onerror = () => {
      if (!disposed) setFailed(true);
    };
    photo.src = image;
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      target.removeEventListener("webglcontextlost", contextLost);
      photo.onload = null;
      photo.onerror = null;
      renderer?.dispose();
    };
  }, [image, position, zoom, paused, reduced, mode, choice]);
  return (
    <div
      ref={root}
      className="portrait-stage matrix-portrait"
      style={
        {
          "--portrait-position": position,
          "--portrait-zoom": zoom,
        } as CSSProperties
      }
      data-ready="false"
      data-running="false"
      data-renderer="initializing"
      data-phase="portrait"
      data-image-fallback={failed}
    >
      {failed ? (
        <NeutralPortrait />
      ) : (
        <Image
          className="portrait-image"
          src={image}
          alt={
            isPlaceholder
              ? "Neutral portrait placeholder; photograph to follow"
              : alt
          }
          fill
          loading="eager"
          sizes="(max-width:700px) 90vw,48vw"
          unoptimized={image.endsWith(".svg")}
          onError={() => setFailed(true)}
        />
      )}
      {!reduced && !paused && (
        <canvas
          key={`${mode}-${choice}`}
          ref={canvas}
          className="matrix-canvas"
          aria-hidden="true"
        />
      )}
      <div className="portrait-caption">
        <span className="signal-dot" /> HUMAN → BINARY → HUMAN{" "}
        <span>14S / LOOP</span>
      </div>
      {(isPlaceholder || failed) && (
        <span className="portrait-placeholder-label">
          {failed ? "IMAGE UNAVAILABLE · PLACEHOLDER" : "PORTRAIT PLACEHOLDER"}
        </span>
      )}
      <p className="sr-only">
        The photograph automatically transforms into flowing binary digits and
        back. The animation pauses offscreen. Use the pause control to view the
        still photograph.
      </p>
      <div className="portrait-controls matrix-controls">
        <label className="quality-control">
          Detail
          <select
            aria-label="Portrait rendering quality"
            value={choice}
            disabled={reduced}
            onChange={(e) => setChoice(e.target.value as typeof choice)}
          >
            <option value="auto">Auto</option>
            <option value="low">Low</option>
            <option value="balanced">Balanced</option>
            <option value="high">High</option>
          </select>
        </label>
        {reduced ? (
          <span className="matrix-reduced">
            Reduced motion · still portrait
          </span>
        ) : (
          <button
            className="portrait-mode"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume animation" : "Pause animation"}
          </button>
        )}
      </div>
    </div>
  );
}
