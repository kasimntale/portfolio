"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mark, Arrow } from "./icons";
const links = [
  { id: "about", title: "About" },
  { id: "work", title: "Selected work" },
  { id: "expertise", title: "Expertise" },
  { id: "contact", title: "Contact" },
];
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -45% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [
          toggle.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const index = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && index <= 0) {
          e.preventDefault();
          nodes.at(-1)?.focus();
        } else if (!e.shiftKey && index === nodes.length - 1) {
          e.preventDefault();
          nodes[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="site-header">
      <Link
        className="brand"
        href="/"
        aria-label="Ntale Kasim — home"
        onClick={() => setOpen(false)}
      >
        <Mark />
        <span>
          NTALE KASIM<span className="brand-role">SOFTWARE ENGINEER</span>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.id}
            href={`/#${link.id}`}
            onClick={() => setActive(link.id)}
            aria-current={
              active === link.id && path === "/" ? "location" : undefined
            }
          >
            {link.title}
          </Link>
        ))}
      </nav>
      <a className="header-cta" href="mailto:kasimntale2@gmail.com">
        Let’s talk <Arrow diagonal />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div
        ref={panel}
        id="mobile-navigation"
        className="mobile-navigation"
        hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {links.map((link, i) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              onClick={() => setOpen(false)}
            >
              <span>0{i + 1}</span>
              {link.title}
              <Arrow diagonal />
            </Link>
          ))}
        </nav>
        <p>Ideas are better in conversation.</p>
        <a href="mailto:kasimntale2@gmail.com" onClick={() => setOpen(false)}>
          kasimntale2@gmail.com
        </a>
      </div>
    </header>
  );
}
