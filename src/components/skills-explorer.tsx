"use client";
import { useState } from "react";
import { skills } from "@/content/portfolio";
const filters = [
  { id: "all", label: "All disciplines" },
  { id: "product", label: "Product engineering" },
  { id: "systems", label: "Data & systems" },
] as const;
export function SkillsExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const selected = skills
    .map((skill, index) => ({ ...skill, index }))
    .filter(
      (skill) =>
        filter === "all" ||
        (filter === "product" ? skill.index < 3 : skill.index >= 3),
    );
  return (
    <div className="skills-explorer">
      <div
        className="skill-filters"
        role="group"
        aria-label="Filter engineering disciplines"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="skill-result-count mono" role="status">
        {selected.length} areas of practice /{" "}
        {filters.find((item) => item.id === filter)?.label}
      </p>
      <div className="skills-grid">
        {selected.map((skill) => (
          <article className="skill" key={skill.title}>
            <span className="mono">0{skill.index + 1} /</span>
            <h3>{skill.title}</h3>
            <ul>
              {skill.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
