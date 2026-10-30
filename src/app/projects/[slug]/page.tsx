import { MotionProvider } from "@/components/motion-provider";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/portfolio";
import { ProjectArt } from "@/components/project-art";
import { Arrow } from "@/components/icons";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.title || "Project not found",
    description: project?.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main" className="project-page section-shell">
      <Link href="/#work" className="text-link back-link">
        ← All explorations
      </Link>
      <div className="project-page-heading">
        <span className="eyebrow">
          {project.number} / {project.category}
        </span>
        <h1 className="display-heading">{project.title}</h1>
        <p>{project.summary}</p>
        <span className="status-badge">{project.status}</span>
      </div>
      <ProjectArt project={project} />
      <div className="project-detail-grid">
        <aside>
          <h2 className="eyebrow">PROJECT NOTES</h2>
          <p>
            Owner-supplied project direction. This page describes the idea, not
            a claim of completed features.
          </p>
          <h3 className="eyebrow">PROPOSED AREAS / TO VERIFY</h3>
          <ul className="stack-list">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {project.github && (
            <a
              className="text-link"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code <Arrow diagonal />
            </a>
          )}
          {project.demo && (
            <a
              className="text-link"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo <Arrow diagonal />
            </a>
          )}
          {!project.github && !project.demo && (
            <p className="muted">
              Repository and demo links will be added when supplied.
            </p>
          )}
        </aside>
        <div>
          <section data-reveal>
            <span className="eyebrow">01 / THE QUESTION</span>
            <h2>The problem worth solving.</h2>
            <p>{project.problem}</p>
          </section>
          <section data-reveal>
            <span className="eyebrow">02 / THE DIRECTION</span>
            <h2>An engineering approach.</h2>
            <p>{project.approach}</p>
          </section>
          <section data-reveal>
            <span className="eyebrow">03 / THE NEXT STEP</span>
            <h2>From idea to evidence.</h2>
            <p>
              Verified screenshots, implementation decisions, testing notes, and
              outcomes will replace these concept notes when supplied. The
              illustration above is an original media placeholder.
            </p>
          </section>
        </div>
      </div>
      <Link className="next-project" href={`/projects/${next.slug}`}>
        <span className="eyebrow">NEXT EXPLORATION / {next.number}</span>
        <span>
          {next.title}
          <Arrow diagonal />
        </span>
      </Link>
      <MotionProvider />
    </main>
  );
}
