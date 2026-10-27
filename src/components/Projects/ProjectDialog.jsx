import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { categories } from "../../data/projects";
import ProjectCover from "../Media/ProjectCover";
import ProjectGallery from "../Media/ProjectGallery";
import "./ProjectDialog.css";

export default function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    const returnFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector("button")?.focus();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); };
  }, [project]);
  if (!project) return null;
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-detail-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===ref.current)onClose();}}>
    <div className="dialog-content"><button type="button" className="dialog-close" aria-label="Cerrar ficha" onClick={onClose}><FiX/></button>
      <p className="eyebrow">{project.categoryLabel || categories.find(c=>c.id===project.category)?.label}</p><h2 id="project-detail-title">{project.title}</h2>
      <p className="detail-status">{project.statusLabel || (project.status==='published'?'Publicado':project.status==='archived'?'Trabajo anterior':'En desarrollo')}</p>
      <ProjectCover key={project.id} project={project} preview={false}/><p className="detail-description">{project.description}</p>
      {project.features.length > 0 && <><h3>Qué permite hacer</h3><ul>{project.features.map(feature=><li key={feature}>{feature}</li>)}</ul></>}
      <div className="tags">{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div>
      {project.availability && <p className="detail-note">{project.availability}</p>}
      <ProjectGallery key={`gallery-${project.id}`} project={project}/>
      {project.media.videos.length > 0 && <section className={`project-videos ${project.category==='android' ? 'videos-mobile' : ''}`} aria-label={`Videos de ${project.title}`}><h3>Videos del proyecto</h3>{project.media.videos.map((video,index)=><figure key={video.src}><video src={video.src} controls playsInline preload="metadata" poster={video.poster || project.media.poster || undefined} aria-label={`Video ${index+1} de ${project.title}`}/><figcaption>Video {index+1} de {project.title}</figcaption></figure>)}</section>}
      {!project.media.screenshots.length && !project.media.cover && !project.media.poster && !project.media.videos.length && <p className="detail-note">Material visual en preparación. La portada es un concepto gráfico, no una captura del proyecto.</p>}
      {project.category==='android' && <p className="detail-note">Aplicación funcional distribuida mediante APK. Código disponible en GitHub; sin descarga pública ni publicación en Google Play.</p>}
      <div className="detail-actions">{project.demo && <a className="button button-primary" href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || 'Abrir demo'}</a>}{project.repository && <a className="button" href={project.repository} target="_blank" rel="noreferrer">Ver código</a>}{project.privateRepository && <span>Repositorio privado</span>}</div>
    </div>
  </dialog>;
}
