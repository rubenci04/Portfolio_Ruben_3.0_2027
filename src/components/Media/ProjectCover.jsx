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
    {project.category === "android" && screenshot ? <MobileShowcase title={project.title} screenshot={screenshot}/> : <><svg className="fallback-scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path fill="var(--scene-base)" d="M0 0h320v180H0z"/><circle cx="248" cy="58" r="37" fill="var(--scene-light)" stroke="var(--ink)" strokeWidth="4"/><path d="m0 155 95-68 53 54 56-25 116 45v19H0Z" fill="var(--scene-dark)" stroke="var(--ink)" strokeWidth="4"/><path d="m0 170 103-29 81 23 58-17 78 27v6H0Z" fill="var(--scene-base)" stroke="var(--ink)" strokeWidth="4"/><path d="m167 19 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill="var(--scene-light)" stroke="var(--ink)" strokeWidth="3"/></svg><div className="cover-title">{(project.coverTitle || [project.title]).map(line=><span key={line}>{line}</span>)}</div></>}
    <span className="cover-caption">{screenshot ? "CAPTURA DE APLICACIÓN" : "CONCEPTO VISUAL"} · {String(index + 1).padStart(2,"0")}</span>
  </div>;
  const content = cover && !broken ? <img className={`project-cover real-cover ${project.category === 'android' ? `real-mobile mobile-${project.id}` : ''}`} src={cover} alt={project.imageAlt || `Captura de ${project.title}`} loading="lazy" decoding="async" width={project.category === 'android' ? 1080 : 1200} height={project.category === 'android' ? 2340 : 675} onError={()=>setBroken(true)}/> : placeholder;
  return <div className="project-media" style={{ "--cover-ratio": media.aspectRatio || "16 / 9" }}>{preview ? <GameplayPreview media={media} title={project.title}>{content}</GameplayPreview> : content}</div>;
}
