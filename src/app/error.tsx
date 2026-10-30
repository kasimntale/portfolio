"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found section-shell">
      <h1>Oops.</h1>
      <h2>This view couldn’t load.</h2>
      <p>Please try again, or return to the homepage.</p>
      <button className="button-link" onClick={reset}>
        Try again
      </button>
      <a className="text-link" href="/">
        Return home
      </a>
    </main>
  );
}
