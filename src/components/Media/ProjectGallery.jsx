import { useEffect, useRef, useState } from 'react';

export default function ProjectGallery({ project }) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  const gallery = useRef(null);
  const screenshots = project.media.screenshots;
  useEffect(() => {
    const dialog = gallery.current?.closest('dialog');
    if (!dialog) return;
    const navigate = event => {
      if (event.target.closest('video,input,textarea,select')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      setIndex(value => Math.max(0,Math.min(screenshots.length-1,value+direction)));
      setBroken(false);
    };
    dialog.addEventListener('keydown',navigate);
    return () => dialog.removeEventListener('keydown',navigate);
  },[screenshots.length]);
  if (!screenshots.length) return null;
  const image = screenshots[index];
  const change = next => { setIndex(next); setBroken(false); };
  return <section ref={gallery} className={`project-gallery ${project.category === 'android' ? 'gallery-mobile' : ''}`} aria-label={`Galería de ${project.title}`}
    tabIndex="0" onKeyDown={event => {
      if (gallery.current?.closest('dialog')) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); change(Math.max(0,index-1)); }
      if (event.key === 'ArrowRight') { event.preventDefault(); change(Math.min(screenshots.length-1,index+1)); }
    }}>
    {broken ? <p role="status">No se pudo cargar esta captura.</p> : <img className="gallery-main" src={image.src} alt={image.alt || `Captura ${index + 1} de ${project.title}`} loading="lazy" decoding="async" width={project.category === 'android' ? 1080 : 1600} height={project.category === 'android' ? 2340 : 1000} onError={()=>setBroken(true)}/>}
    {image.caption && <p>{image.caption}</p>}
    {screenshots.length > 1 && <>
      <div className="gallery-thumbnails">{screenshots.map((shot,i)=><button key={shot.src} type="button" aria-label={`Mostrar captura ${i+1} de ${project.title}`} aria-pressed={index===i} onClick={()=>change(i)}><img src={shot.src} alt="" width="80" height="60" loading="lazy" decoding="async"/></button>)}</div>
      <div className="gallery-controls"><button type="button" disabled={index === 0} onClick={()=>change(index-1)}>← Anterior</button><span aria-live="polite">{index + 1} / {screenshots.length}</span><button type="button" disabled={index === screenshots.length-1} onClick={()=>change(index+1)}>Siguiente →</button></div>
    </>}
  </section>;
}
