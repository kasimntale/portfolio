import Link from "next/link";
import { profile } from "@/content/portfolio";
import { Arrow, Mark } from "./icons";
export function Footer() {
  return (
    <footer className="site-footer">
      <Link className="footer-mark" href="/" aria-label="Back to home">
        <Mark /> NTALE KASIM
      </Link>
      <span>Built with intention. Always evolving.</span>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">
        GitHub <Arrow diagonal />
      </a>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  );
}
