import type { Project } from "@/content/portfolio";
export function ProjectArt({ project }: { project: Project }) {
  return (
    <div
      className={`project-art art-${project.visual}`}
      role="img"
      aria-label={`${project.title}: conceptual illustration, not a product screenshot`}
    >
      <span className="art-index">NK / {project.number}</span>
      {project.visual === "terminal" && (
        <div className="terminal-art">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <b>mirrorload / session</b>
          </div>
          <div className="terminal-body">
            <p>
              <span>~</span> mirrorload orchestrate
            </p>
            <p className="muted">Initializing a clearer view.</p>
            <div className="session-lines">
              <i />
              <i />
              <i />
              <i />
            </div>
            <p>
              <span>↳</span> one workflow. many perspectives.
            </p>
            <span className="terminal-cursor" />
          </div>
        </div>
      )}
      {project.visual === "pitch" && (
        <div className="pitch-art">
          <div className="pitch-field">
            <span />
            <i />
            <b />
          </div>
          <div className="pitch-label">
            ACADEMY<span>OS / THE NEXT PLAY</span>
          </div>
        </div>
      )}
      {project.visual === "ledger" && (
        <div className="ledger-art">
          <span className="ledger-word">
            pocket
            <br />
            ledger<span>YOUR MONEY. YOUR DEVICE.</span>
          </span>
          <div className="ledger-device">
            <span>LOCAL FIRST</span>
            <b>
              Make room
              <br />
              for clarity.
            </b>
            <div className="ledger-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span>DESIGN EXPLORATION</span>
          </div>
        </div>
      )}
      {project.visual === "terrain" && (
        <div className="terrain-art">
          <svg viewBox="0 0 600 350" aria-hidden="true">
            {Array.from({ length: 13 }, (_, i) => (
              <ellipse
                key={i}
                cx={300 + i * 4}
                cy={175 - i * 2}
                rx={60 + i * 23}
                ry={20 + i * 11}
                transform={`rotate(-22 300 175)`}
              />
            ))}
          </svg>
          <div>
            WetGuard<span>OBSERVE. UNDERSTAND. PROTECT.</span>
          </div>
          <span className="terrain-point" />
        </div>
      )}
      <span className="art-label">CONCEPT VISUAL · MEDIA PLACEHOLDER</span>
    </div>
  );
}
