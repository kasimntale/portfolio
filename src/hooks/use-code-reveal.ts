"use client";
import { useEffect, useRef } from "react";
import {
  clampPoint,
  isSettled,
  qualityProfiles,
  stepReveal,
  type Quality,
  type RevealPoint,
} from "@/lib/reveal";
export function useCodeReveal(quality: Quality, full: boolean) {
  const root = useRef<HTMLDivElement>(null);
  const saved = useRef<RevealPoint | null>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let bounds = element.getBoundingClientRect();
    let current: RevealPoint = saved.current ?? {
      x: bounds.width / 2,
      y: bounds.height / 2,
      radius: 0,
    };
    let pointer = { x: current.x, y: current.y };
    let entered =
        element.matches(":hover") &&
        window.matchMedia("(pointer: fine)").matches,
      intersecting = true,
      scroll = 0,
      frame = 0,
      last = 0,
      disposed = false;
    const profile = qualityProfiles[quality];
    const write = () => {
      element.style.setProperty("--reveal-x", `${current.x}px`);
      element.style.setProperty("--reveal-y", `${current.y}px`);
      element.style.setProperty("--reveal-radius", `${current.radius}px`);
      element.style.setProperty(
        "--portrait-shift-x",
        `${(current.x / Math.max(bounds.width, 1) - 0.5) * 5}px`,
      );
      element.style.setProperty(
        "--portrait-shift-y",
        `${(current.y / Math.max(bounds.height, 1) - 0.5) * 5}px`,
      );
      element.dataset.revealing = current.radius > 0.5 ? "true" : "false";
    };
    const target = (): RevealPoint => {
      const scrollRadius = reduce.matches
        ? 0
        : scroll * Math.hypot(bounds.width, bounds.height);
      return {
        x: full ? bounds.width / 2 : entered ? pointer.x : bounds.width / 2,
        y: full ? bounds.height / 2 : entered ? pointer.y : bounds.height / 2,
        radius: full
          ? Math.hypot(bounds.width, bounds.height)
          : Math.max(
              entered ? Math.min(profile.radius, bounds.width * 0.38) : 0,
              scrollRadius,
            ),
      };
    };
    const draw = (time: number) => {
      frame = 0;
      if (disposed || document.hidden || !intersecting) return;
      const next = target();
      current = reduce.matches
        ? next
        : stepReveal(
            current,
            next,
            last ? (time - last) / 1000 : 1 / 60,
            profile.response,
          );
      last = time;
      if (isSettled(current, next)) current = next;
      else frame = requestAnimationFrame(draw);
      write();
    };
    const request = () => {
      if (!frame && !document.hidden && intersecting) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    const locate = (event: PointerEvent) => {
      bounds = element.getBoundingClientRect();
      pointer = clampPoint(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        bounds.width,
        bounds.height,
      );
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        locate(event);
        entered = true;
        request();
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.buttons) {
        locate(event);
        entered = true;
        request();
      }
    };
    const down = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("button,select,label")) return;
      locate(event);
      entered = true;
      request();
    };
    const leave = () => {
      entered = false;
      request();
    };
    const resize = new ResizeObserver(() => {
      bounds = element.getBoundingClientRect();
      pointer = clampPoint(pointer.x, pointer.y, bounds.width, bounds.height);
      request();
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      element.dataset.visible = String(intersecting);
      if (intersecting) request();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(element);
    const visibility = () => {
      element.dataset.pageVisible = String(!document.hidden);
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else request();
    };
    const onScroll = (event: Event) => {
      scroll = (event as CustomEvent<number>).detail;
      request();
    };
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointerup", leave);
    element.addEventListener("pointercancel", leave);
    element.addEventListener("code-reveal-scroll", onScroll);
    document.addEventListener("visibilitychange", visibility);
    reduce.addEventListener("change", request);
    element.dataset.ready = "true";
    write();
    request();
    return () => {
      delete element.dataset.ready;
      saved.current = current;
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointerup", leave);
      element.removeEventListener("pointercancel", leave);
      element.removeEventListener("code-reveal-scroll", onScroll);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", request);
    };
  }, [quality, full]);
  return root;
}
