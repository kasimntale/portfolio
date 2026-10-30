"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function MotionProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const media = gsap.matchMedia();
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine) {
        lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          anchors: { offset: -100 },
        });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
      }
      const ctx = gsap.context(() => {
        gsap.from(".hero-intro > *, .hero-name, .portrait-stage", {
          opacity: 0,
          y: 32,
          duration: 1.15,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
            clearProps: "transform,opacity",
          }),
        );
        if (fine && window.innerWidth > 900) {
          if (document.querySelector(".hero"))
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "bottom 15%",
                  scrub: 0.7,
                },
              })
              .to(
                ".portrait-stage",
                { yPercent: 9, scale: 0.93, ease: "none" },
                0,
              )
              .to(
                ".hero-name",
                { yPercent: -24, opacity: 0.45, ease: "none" },
                0,
              );
        }
      });
      const onVisibility = () => {
        if (document.hidden) lenis?.stop();
        else lenis?.start();
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        ctx.revert();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = undefined;
      };
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
