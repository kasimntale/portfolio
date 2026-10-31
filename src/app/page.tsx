import { SkillsExplorer } from "@/components/skills-explorer";
import { MotionProvider } from "@/components/motion-provider";
import Link from "next/link";
import { WorkAside } from "@/components/work-aside";
import { MatrixPortrait } from "@/components/portrait/matrix-portrait";
import { Arrow } from "@/components/icons";
import { ProjectArt } from "@/components/project-art";
import { profile, projects, journey } from "@/content/portfolio";
export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-topline mono">
          <span>BEHIND THE CODE / NTALE KASIM</span>
          <span>PORTFOLIO / VOL. 01</span>
        </div>
        <div className="hero-intro">
          <p className="eyebrow">
            <span className="signal-dot" /> SOFTWARE ENGINEER & OPEN-SOURCE
            BUILDER
          </p>
          <p>{profile.headline}</p>
          <div className="hero-actions">
            <a className="text-link" href="#work">
              Explore selected work <Arrow diagonal />
            </a>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <Arrow diagonal />
            </a>
          </div>
        </div>
        <MatrixPortrait
          src={profile.portrait}
          isPlaceholder={profile.portraitIsPlaceholder}
          alt="Portrait of Ntale Kasim"
          position={profile.portraitPosition}
          zoom={profile.portraitZoom}
        />
        <div className="hero-coordinate mono" aria-hidden="true">
          HUMAN THINKING.
          <br />
          DIGITAL POSSIBILITIES.
        </div>
        <h1 className="hero-name" id="hero-heading">
          <span>NTALE</span>{" "}
          <span>
            KASIM<span className="name-dot">.</span>
          </span>
        </h1>
        <div className="hero-bottom">
          <a className="scroll-link mono" href="#about">
            <span>↓</span> SCROLL TO DISCOVER
          </a>
          <span className="mono hero-hint">
            HUMAN → BINARY → HUMAN. ALWAYS EVOLVING.
          </span>
          <span className="mono">DESIGNED TO BUILD.</span>
        </div>
      </section>
      <section
        className="about section-shell"
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="section-heading">
          <span className="eyebrow">01 / THE PERSON BEHIND THE CODE</span>
          <span className="mono">CURIOUS BY DEFAULT.</span>
        </div>
        <div className="about-layout">
          <div className="about-kicker" data-reveal>
            <span className="asterisk" aria-hidden="true">
              *
            </span>
            <p>
              Good software begins
              <br />
              with better questions.
            </p>
          </div>
          <div>
            <h2 className="statement" id="about-heading" data-reveal>
              More than code.
              <br />
              <span>A way of thinking.</span>
            </h2>
            <p className="about-copy" data-reveal>
              I’m Kasim, a software engineer with a computer science background
              and a product-focused mindset. I’m interested in the space where
              thoughtful interfaces, dependable systems, and useful data meet.
            </p>
            <p className="about-copy muted" data-reveal>
              From full-stack applications to open-source tools, I build to
              understand — and to make something practical. Data science and
              machine learning keep me asking what’s possible next.
            </p>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow the work on GitHub <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="principles">
          <span>THINK IN SYSTEMS.</span>
          <span>BUILD FOR PEOPLE.</span>
          <span>KEEP EXPLORING.</span>
        </div>
      </section>
      <section
        id="work"
        className="work section-shell"
        aria-labelledby="work-heading"
      >
        <div className="section-heading">
          <span className="eyebrow">02 / SELECTED EXPLORATIONS</span>
          <span className="mono">FOUR IDEAS. DIFFERENT CHALLENGES.</span>
        </div>
        <div className="work-grid">
          <WorkAside />
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.slug} data-reveal>
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-link"
                  aria-label={`Explore ${project.title}`}
                >
                  <ProjectArt project={project} />
                  <div className="project-meta">
                    <span className="mono">
                      {project.number} / {project.category}
                    </span>
                    <Arrow diagonal />
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="project-action">
                    Explore the project <span aria-hidden="true">↗</span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="expertise section-shell"
        id="expertise"
        aria-labelledby="expertise-heading"
      >
        <div className="section-heading">
          <span className="eyebrow">03 / THE TOOLKIT</span>
          <span className="mono">TOOLS FOLLOW THE PROBLEM.</span>
        </div>
        <div className="expertise-intro">
          <h2 className="display-heading" id="expertise-heading" data-reveal>
            RANGE WITH
            <br />
            <span>INTENTION.</span>
          </h2>
          <p data-reveal>
            Across the stack, with a focus on the details that make software
            useful. Areas of practice and ongoing exploration.
          </p>
        </div>
        <SkillsExplorer />
      </section>
      <section
        className="journey section-shell"
        id="journey"
        aria-labelledby="journey-heading"
      >
        <div className="section-heading">
          <span className="eyebrow">04 / ALWAYS IN PROGRESS</span>
          <span className="mono">THE ENGINEERING JOURNEY</span>
        </div>
        <h2 className="statement" id="journey-heading" data-reveal>
          Learning is part
          <br />
          of <span>the work.</span>
        </h2>
        <div className="journey-grid">
          {journey.map((item) => (
            <article key={item.title} data-reveal>
              <span className="mono">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="contact section-shell"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <div className="section-heading">
          <span className="eyebrow">05 / NEXT, LET’S MAKE SOMETHING</span>
          <span className="mono">START WITH A CONVERSATION.</span>
        </div>
        <h2 className="contact-heading" id="contact-heading" data-reveal>
          GOT A GOOD
          <br />
          <span>PROBLEM?</span>
        </h2>
        <div className="contact-bottom">
          <p>
            I’d love to hear it.
            <br />
            Let’s build something that matters.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <Arrow diagonal />
          </a>
          <div className="contact-socials">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <Arrow diagonal />
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin}>
                LinkedIn <Arrow diagonal />
              </a>
            )}
            {profile.resume && (
              <a href={profile.resume} download>
                Download résumé <Arrow diagonal />
              </a>
            )}
          </div>
        </div>
      </section>
      <MotionProvider />
    </main>
  );
}
