import { useState } from "react";
import GameplayPreview from "./GameplayPreview";
import MobileShowcase from "./MobileShowcase";
import "./ProjectMedia.css";

export default function ProjectCover({ project, index = 0, preview = true }) {
  const [broken, setBroken] = useState(false);
  const media = project.media;
  const cover = media.cover;
  const screenshot = media.screenshots[0];
  const placeholder = <div className={`project-cover cover-${project.cover || "space"} ${project.category === "android" ? "cover-mobile" : ""}`}>
    <div className="cover-meta"><span>{project.coverLabel || project.categoryLabel || "PROYECTO / CÓDIGO"}</span><span aria-hidden="true">↗</span></div>
    {project.category === "android" ? <MobileShowcase title={project.title} screenshot={screenshot}/> : <><div className="cover-geometry" aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="cover-title">{(project.coverTitle || [project.title]).map(line=><span key={line}>{line}</span>)}</div></>}
    <span className="cover-caption">{screenshot ? "CAPTURA DE APLICACIÓN" : "CONCEPTO VISUAL"} · {String(index + 1).padStart(2,"0")}</span>
  </div>;
  const content = cover && !broken ? <img className={`project-cover real-cover ${project.category === 'android' ? `real-mobile mobile-${project.id}` : ''}`} src={cover} alt={project.imageAlt || `Captura de ${project.title}`} loading="lazy" decoding="async" width={project.category === 'android' ? 1080 : 1200} height={project.category === 'android' ? 2340 : 675} onError={()=>setBroken(true)}/> : placeholder;
  return <div className="project-media" style={{ "--cover-ratio": media.aspectRatio || "16 / 9" }}>{preview ? <GameplayPreview media={media} title={project.title}>{content}</GameplayPreview> : content}</div>;
}
