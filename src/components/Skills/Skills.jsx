import { createElement } from "react";
import { FiCode, FiBox, FiLayers, FiTerminal } from "react-icons/fi";
import "./Skills.css";
const skills = [
  {
    title: "Web Development",
    icon: FiCode,
    description: "Interfaces claras. Productos que funcionan.",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Vue.js",
      "HTML",
      "CSS",
      "Tailwind",
    ],
  },
  {
    title: "Game Development",
    icon: FiBox,
    description: "De la mecánica a la experiencia de juego.",
    items: [
      "Godot Engine",
      "GDScript",
      "Sistemas 2D/3D",
      "Gameplay",
      "Lógica de juegos",
    ],
  },
  {
    title: "Backend y servicios",
    icon: FiLayers,
    description: "La base que conecta cada experiencia.",
    items: ["Node.js", "Express", "MongoDB", "Supabase", "Autenticación", "PWA", "Despliegue cloud"],
  },
  {
    title: "Herramientas, testing e IA",
    icon: FiTerminal,
    description: "Un flujo de trabajo para construir y mejorar.",
    items: [
      "Git",
      "GitHub",
      "Python",
      "Vitest",
      "Playwright",
      "Codex",
      "Claude Code",
    ],
  },
];
export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / Mi caja de herramientas</div>
            <h2>Tecnología con propósito.</h2>
          </div>
          <p>
            Elijo las herramientas en función de la experiencia que quiero
            construir.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map(({ title, icon, description, items }, index) => (
            <article className="skill-group" key={title}>
              <div className="skill-top">
                {createElement(icon)}
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="tags">
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
