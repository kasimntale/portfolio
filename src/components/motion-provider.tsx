"use client";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, useGSAP);
export function MotionProvider() {
  const pathname = usePathname();
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (document.querySelector(".hero"))
          gsap.from(".hero-intro > *, .hero-name, .portrait-stage", {
            opacity: 0,
            y: 32,
            duration: 1.05,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            clearProps: "transform,opacity",
          }),
        );
        const portrait = document.querySelector<HTMLElement>(
          ".code-reveal-portrait",
        );
        if (
          portrait &&
          window.matchMedia("(min-width: 901px) and (pointer: fine)").matches
        ) {
          ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              const reveal =
                portrait.dataset.quality === "low"
                  ? 0
                  : Math.max(0, Math.min(1, (self.progress - 0.12) / 0.7)) *
                    0.55;
              portrait.dispatchEvent(
                new CustomEvent("code-reveal-scroll", { detail: reveal }),
              );
            },
          });
        }
        if (
          window.matchMedia("(min-width: 901px) and (pointer: fine)").matches &&
          document.querySelector(".hero")
        ) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom 15%",
                scrub: 0.5,
              },
            })
            .to(
              ".portrait-stage",
              { yPercent: 7, scale: 0.94, ease: "none" },
              0,
            )
            .to(".hero-name", { yPercent: -18, opacity: 0.5, ease: "none" }, 0);
        }
      });
      return () => media.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );
  return null;
}
