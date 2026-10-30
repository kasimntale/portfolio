"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function WorkAside() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    // Pin only after this client-owned subtree has hydrated. Reparenting server
    // markup from the global motion effect can race React's hydration.
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(
          () =>
            ScrollTrigger.create({
              trigger: root.current?.parentElement,
              start: "top 120px",
              end: "bottom bottom",
              pin: root.current,
              pinSpacing: false,
            }),
          root,
        );
        return () => ctx.revert();
      },
    );
    return () => media.revert();
  }, []);
  return (
    <aside ref={root} className="work-aside">
      <h2 className="display-heading" id="work-heading">
        WORK
        <br />
        IN <span>FOCUS.</span>
      </h2>
      <p>
        Tools, platforms, and experiments.
        <br />A look at what I’m thinking about.
      </p>
      <span className="mono work-count">INDEX / 01—04</span>
    </aside>
  );
}
