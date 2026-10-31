export function NeutralPortrait({
  decorative = false,
}: {
  decorative?: boolean;
}) {
  return (
    <svg
      className="neutral-portrait"
      viewBox="0 0 1080 1440"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={
        decorative
          ? undefined
          : "Neutral portrait placeholder; photograph unavailable"
      }
    >
      <rect width="1080" height="1440" fill="#242a26" />
      <g stroke="#91b79c" strokeOpacity=".4" fill="none" strokeWidth="2">
        <ellipse cx="540" cy="480" rx="165" ry="220" />
        <path d="M230 1440v-140c0-310 620-310 620 0v140M510 480h60M540 450v60" />
      </g>
      <text
        x="540"
        y="850"
        textAnchor="middle"
        fill="#bdc9be"
        fontFamily="monospace"
        fontSize="20"
        letterSpacing="5"
      >
        PORTRAIT TO FOLLOW
      </text>
    </svg>
  );
}
