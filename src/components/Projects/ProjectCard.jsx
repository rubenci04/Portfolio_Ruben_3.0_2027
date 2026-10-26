import { motion as Motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiLock } from "react-icons/fi";
import { categories } from "../../data/projects";

export default function ProjectCard({ project, index }) {
  const reduced = useReducedMotion();
  const category = categories.find(
    (item) => item.id === project.category,
  )?.label;
  return (
    <Motion.article
      className="project-card"
      data-project={project.id}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, delay: index * 0.035 }}
    >
      {project.image ? (
        <img
          className="project-cover"
          src={project.image}
          alt={project.imageAlt || "Vista de " + project.title}
          loading="lazy"
        />
      ) : (
        <div
          className={"project-cover cover-" + project.cover}
          aria-label={"Portada gráfica abstracta de " + project.title}
        >
          <div className="cover-meta">
            <span>{project.coverLabel}</span>
            <span>↗</span>
          </div>
          <div className="cover-geometry" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="cover-title">
            {project.coverTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <span className="cover-caption">
            CONCEPTO VISUAL · {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
      <div className="project-body">
        <div className="project-meta">
          <span>{category}</span>
          <span className={"project-status " + project.status}>
            <i />
            {project.statusLabel || (project.status === "published" ? "Publicado" : project.status === "archived" ? "Trabajo anterior" : "En desarrollo")}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        {project.availability && <p className="availability">{project.availability}</p>}
        <div className="project-links">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={(project.demoLabel || "Ver demo") + " de " + project.title}
            >
              {project.demoLabel || "Explorar proyecto"} <FiArrowUpRight />
            </a>
          )}
          {project.repository && (
            <a
              href={project.repository}
              target="_blank"
              rel="noreferrer"
              aria-label={"Ver código de " + project.title}
            >
              <FiGithub /> Código
            </a>
          )}
          {project.privateRepository && (
            <span>
              <FiLock /> Repositorio privado
            </span>
          )}
          {!project.demo &&
            !project.repository &&
            !project.privateRepository && (
              <span>{project.status === "archived" ? "Demo no disponible" : "En construcción · Próximamente"}</span>
            )}
        </div>
      </div>
    </Motion.article>
  );
}
