import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found section-shell">
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>
        404<span>.</span>
      </h1>
      <h2>Nothing to build on here.</h2>
      <p>This page doesn’t exist. There’s more to explore back home.</p>
      <Link href="/" className="button-link">
        Back to the portfolio ↗
      </Link>
    </main>
  );
}
