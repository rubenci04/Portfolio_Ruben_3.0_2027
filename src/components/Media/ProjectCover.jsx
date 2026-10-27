import { useState } from "react";
import GameplayPreview from "./GameplayPreview";
import MobileShowcase from "./MobileShowcase";
import "./ProjectMedia.css";

export default function ProjectCover({ project, index = 0 }) {
  const [broken, setBroken] = useState(false);
  const media = project.media;
  const cover = media.cover || media.poster;
  const screenshot = media.screenshots[0];
  const placeholder = <div className={`project-cover cover-${project.cover || "space"} ${project.category === "android" ? "cover-mobile" : ""}`}>
    <div className="cover-meta"><span>{project.coverLabel || project.categoryLabel || "PROYECTO / CÓDIGO"}</span><span aria-hidden="true">↗</span></div>
    {project.category === "android" ? <MobileShowcase title={project.title} screenshot={screenshot}/> : <><div className="cover-geometry" aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="cover-title">{(project.coverTitle || [project.title]).map(line=><span key={line}>{line}</span>)}</div></>}
    <span className="cover-caption">{screenshot ? "CAPTURA DE APLICACIÓN" : "CONCEPTO VISUAL"} · {String(index + 1).padStart(2,"0")}</span>
  </div>;
  return <div className="project-media" style={{ "--cover-ratio": media.aspectRatio || "16 / 9" }}><GameplayPreview media={media} title={project.title}>{cover && !broken ? <img className="project-cover real-cover" src={cover} alt={project.imageAlt || `Captura de ${project.title}`} loading="lazy" width="960" height="540" onError={()=>setBroken(true)}/> : placeholder}</GameplayPreview></div>;
}
