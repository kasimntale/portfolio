"use client";
import Image from "next/image";
import { NeutralPortrait } from "./neutral-portrait";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { codeSnippets } from "@/content/code-snippets";
import { chooseQuality, type Quality } from "@/lib/reveal";
import { useCodeReveal } from "@/hooks/use-code-reveal";
export type CodeRevealPortraitProps = {
  src?: string;
  alt?: string;
  isPlaceholder?: boolean;
  position?: string;
  zoom?: number;
  initialQuality?: Quality;
};
const placeholder = "/images/portrait-placeholder.svg";
export function CodeRevealPortrait({
  src = placeholder,
  alt = "Neutral portrait placeholder for Ntale Kasim; photograph to follow",
  isPlaceholder = true,
  position = "50% 50%",
  zoom = 1,
  initialQuality = "balanced",
}: CodeRevealPortraitProps) {
  const preferredQuality = useRef<Quality | null>(null);
  const [full, setFull] = useState(false);
  const [quality, setQuality] = useState<Quality>(initialQuality);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      setQuality(
        media.matches
          ? "low"
          : (preferredQuality.current ??
              chooseQuality({
                reducedMotion: media.matches,
                coarse: window.matchMedia("(pointer: coarse)").matches,
                saveData: (
                  navigator as Navigator & {
                    connection?: { saveData?: boolean };
                  }
                ).connection?.saveData,
                memory: (navigator as Navigator & { deviceMemory?: number })
                  .deviceMemory,
              })),
      );
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const root = useCodeReveal(quality, full);
  const image = failed ? placeholder : src;
  const fallback = isPlaceholder || failed;
  const style = {
    "--portrait-position": position,
    "--portrait-zoom": zoom,
  } as CSSProperties;
  return (
    <div
      ref={root}
      className="portrait-stage code-reveal-portrait"
      style={style}
      data-renderer="css"
      data-quality={reduced ? "low" : quality}
      data-full={full}
      data-image-fallback={failed}
      data-revealing="false"
    >
      {failed ? (
        <NeutralPortrait />
      ) : (
        <Image
          className="portrait-image"
          src={image}
          alt={
            fallback
              ? "Neutral portrait placeholder for Ntale Kasim; photograph to follow"
              : alt
          }
          fill
          loading="eager"
          sizes="(max-width: 700px) 90vw, 48vw"
          unoptimized={image.endsWith(".svg")}
          onError={() => {
            if (!failed) setFailed(true);
          }}
        />
      )}
      <div className="code-reveal-layer" aria-hidden="true">
        {failed ? (
          <NeutralPortrait decorative />
        ) : (
          <Image
            className="code-portrait-image"
            src={image}
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 700px) 90vw, 48vw"
            unoptimized={image.endsWith(".svg")}
          />
        )}
        <div className="code-grid" />
        <div className="code-texture">
          {codeSnippets.map((snippet, i) => (
            <div
              className="code-fragment"
              key={snippet.language}
              style={{ "--fragment-index": i } as CSSProperties}
            >
              <span className="code-language">
                {"// "}
                {snippet.language}
              </span>
              <pre>
                {snippet.lines.map((line, j) => (
                  <span className="code-line" key={j}>
                    <span className="line-number">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    {line.map((token, k) => (
                      <span
                        className={`syntax-${token.kind ?? "plain"}`}
                        key={k}
                      >
                        {token.text}
                      </span>
                    ))}
                    {"\n"}
                  </span>
                ))}
              </pre>
            </div>
          ))}
        </div>
        <span className="code-layer-caption">
          HUMAN THINKING → EXECUTABLE IDEAS
        </span>
      </div>
      <div className="portrait-cross cross-a" aria-hidden="true">
        +
      </div>
      <div className="portrait-caption">
        <span className="signal-dot" /> BEHIND THE CODE <span>NK / 01</span>
      </div>
      {fallback && (
        <span className="portrait-placeholder-label">
          {failed ? "IMAGE UNAVAILABLE · PLACEHOLDER" : "PORTRAIT PLACEHOLDER"}
        </span>
      )}
      <div className="portrait-controls">
        <label className="quality-control">
          Detail
          <select
            aria-label="Portrait rendering quality"
            value={quality}
            disabled={reduced}
            onChange={(e) => {
              const value = e.target.value as Quality;
              preferredQuality.current = value;
              setQuality(value);
            }}
          >
            <option value="low">Low</option>
            <option value="balanced">Balanced</option>
            <option value="high">High</option>
          </select>
        </label>
        <button
          className="portrait-mode"
          aria-pressed={full}
          onClick={() => setFull(!full)}
        >
          <span aria-hidden="true">{full ? "−" : "+"}</span>
          {full ? "Hide the code" : "Reveal the code"}
        </button>
      </div>
    </div>
  );
}
