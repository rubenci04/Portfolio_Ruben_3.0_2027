import { useState } from "react";
import MobileShowcase from "./MobileShowcase";

export default function ProjectGallery({ project }) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  const screenshots = project.media.screenshots;
  if (!screenshots.length) return null;
  const image = screenshots[index];
  const change = next => { setIndex(next); setBroken(false); };
  return <section className="project-gallery" aria-label={`Galería de ${project.title}`}>
    {broken ? <p role="status">No se pudo cargar esta captura.</p> : project.category === "android" ? <MobileShowcase key={image.src} screenshot={image} title={project.title} onError={()=>setBroken(true)}/> : <img src={image.src} alt={image.alt || `Captura ${index + 1} de ${project.title}`} loading="lazy" onError={()=>setBroken(true)}/>}
    {image.caption && <p>{image.caption}</p>}
    {screenshots.length > 1 && <div className="gallery-controls"><button type="button" disabled={index === 0} onClick={()=>change(index-1)}>Anterior</button><span aria-live="polite">{index + 1} / {screenshots.length}</span><button type="button" disabled={index === screenshots.length-1} onClick={()=>change(index+1)}>Siguiente</button></div>}
  </section>;
}
