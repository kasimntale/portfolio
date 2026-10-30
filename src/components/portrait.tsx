"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/content/portfolio";
const Scene = dynamic(() => import("./webgl/portrait-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Portrait() {
  const root = useRef<HTMLDivElement>(null);
  const point = useRef({ x: 0.5, y: 0.5 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [full, setFull] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection;
      const memory = (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory;
      setEnabled(
        media.matches && !connection?.saveData && (!memory || memory >= 4),
      );
    };
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    const visibility = () => {
      const rect = root.current?.getBoundingClientRect();
      setVisible(
        !document.hidden &&
          !!rect &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight,
      );
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const webgl = enabled && visible && !failed;
  return (
    <div
      className="portrait-stage"
      ref={root}
      data-renderer={webgl ? "webgl" : "lightweight"}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        point.current = {
          x: (e.clientX - r.left) / r.width,
          y: 1 - (e.clientY - r.top) / r.height,
        };
        window.dispatchEvent(new Event("portrait-move"));
        if (e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
    >
      <Image
        className="portrait-image"
        src={profile.portrait}
        alt={
          profile.portraitIsPlaceholder
            ? "Abstract wireframe silhouette, awaiting Ntale Kasim’s supplied portrait"
            : "Portrait of Ntale Kasim"
        }
        fill
        priority
        sizes="(max-width: 700px) 90vw, 48vw"
        unoptimized={profile.portrait.endsWith(".svg")}
      />
      <div
        className={`portrait-digital-fallback ${full ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        <Image
          src={profile.portrait}
          alt=""
          fill
          sizes="(max-width: 700px) 90vw, 48vw"
          unoptimized={profile.portrait.endsWith(".svg")}
        />
        <div className="digital-grid" />
      </div>
      {webgl && (
        <div className="portrait-canvas">
          <SceneBoundary onFailure={() => setFailed(true)}>
            <Scene
              src={profile.portrait}
              point={point}
              revealed={hover}
              full={full}
              onFailure={() => setFailed(true)}
            />
          </SceneBoundary>
        </div>
      )}
      <div className="portrait-cross cross-a" aria-hidden="true">
        +
      </div>
      <div className="portrait-cross cross-b" aria-hidden="true">
        +
      </div>
      <div className="portrait-caption">
        <span className="signal-dot" /> HUMAN / ENGINEER <span>01—NK</span>
      </div>
      <button
        className="portrait-mode"
        aria-pressed={full}
        onClick={() => setFull(!full)}
      >
        <span aria-hidden="true">{full ? "−" : "+"}</span>{" "}
        {full ? "View human" : "Reveal digital layer"}
      </button>
      {profile.portraitIsPlaceholder && (
        <span className="portrait-placeholder-label">
          PORTRAIT ASSET PENDING
        </span>
      )}
    </div>
  );
}
