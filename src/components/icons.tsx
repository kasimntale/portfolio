export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"} />
    </svg>
  );
}
export function Mark() {
  return (
    <svg aria-hidden="true" width="30" height="30" viewBox="0 0 32 32">
      <path d="M3 27V5h6l14 22h6V5h-6v13L15 5H3" fill="currentColor" />
    </svg>
  );
}
