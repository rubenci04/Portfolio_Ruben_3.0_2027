import { useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus, FiRotateCcw, FiX, FiArrowRight } from "react-icons/fi";
import { featuredProjects } from "../../data/projects";
import "./UniverseExplorer.css";

const planets = [
  { id: "godot", name: "Godot", title: "Mundos para jugar", copy: "Acción 2D, universos 3D y mecánicas que nacen del código.", className: "ringed" },
  { id: "web", name: "Aplicaciones web", title: "Ideas que resuelven", copy: "Educación, gestión y herramientas para problemas reales.", className: "amber" },
  { id: "android", name: "Android", title: "Software que te acompaña", copy: "Organización cotidiana y entrenamiento en aplicaciones móviles.", className: "ice" },
];

function Rocket() {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><path className="rocket-flame" d="M24 63L9 91l29-15z" fill="#ffc85b"/><path d="M33 54L17 55l-7 20 24-7M47 69l-2 18 20-9 1-18" fill="#608393" stroke="#a2c8d4" strokeWidth="2"/><path d="M29 65C27 41 51 16 84 12c-3 35-27 58-51 58z" fill="#d9e5df" stroke="#86afbd" strokeWidth="2"/><path d="M65 17l14 15 5-20z" fill="#f6c769"/><circle cx="59" cy="38" r="10" fill="#142a44" stroke="#f6c769" strokeWidth="4"/><path d="M27 67l-7 12 14-6" fill="#fff0c1"/></svg>;
}

export default function UniverseExplorer({ onExploreCategory, onOpenProject, enabled, onEnabledChange }) {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [tour, setTour] = useState(null);
  const scene = useRef(null);
  const trigger = useRef(null);
  const detail = planets.find(planet => planet.id === selected);
  const project = tour === null ? null : featuredProjects[tour];

  useEffect(() => {
    const visibility = () => scene.current?.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  const close = () => { setSelected(null); setTour(null); setZoom(1); trigger.current?.focus(); };
  const choose = (id, element) => { trigger.current = element; setTour(null); setSelected(id); setZoom(1.15); };
  const move = event => {
    if (!enabled || event.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = scene.current.getBoundingClientRect();
    scene.current.style.setProperty("--look-x", `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14}px`);
    scene.current.style.setProperty("--look-y", `${(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 10}px`);
  };
  const resetPointer = () => { scene.current?.style.setProperty("--look-x", "0px"); scene.current?.style.setProperty("--look-y", "0px"); };
  return <section className="universe" aria-label="Explorador del universo">
    <div className="universe-heading"><span>RA / UNIVERSO EXPLORABLE</span><button type="button" aria-pressed={!enabled} onClick={() => { onEnabledChange(!enabled); resetPointer(); }}>{enabled ? "Pausar universo" : "Activar universo"}</button></div>
    <div ref={scene} className={`universe-scene ${enabled ? "" : "scene-static"}`} onPointerMove={move} onPointerLeave={resetPointer} onKeyDown={event => { if (event.key === "Escape") close(); }}>
      <div className="universe-world" style={{ "--scene-zoom": zoom }}>
        <div className="universe-orbit orbit-a" aria-hidden="true"/><div className="universe-orbit orbit-b" aria-hidden="true"/>
        {planets.map(planet => <button key={planet.id} type="button" className={`planet-control planet-${planet.className}`} aria-label={`Explorar planeta ${planet.name}`} aria-expanded={selected === planet.id} aria-controls="planet-information" onClick={event => choose(planet.id, event.currentTarget)}><span className="planet-sphere" aria-hidden="true"><i className="planet-texture"/>{planet.id === "godot" && <i className="explorer-ring"/>}</span><span className="planet-label">{planet.name}</span></button>)}
        <button className={`rocket-control ${tour !== null ? "rocket-launched" : ""}`} type="button" aria-label="Iniciar recorrido de proyectos" onClick={event => { trigger.current = event.currentTarget; setSelected(null); setZoom(1); setTour(0); }}><Rocket/><span>Iniciar recorrido</span></button>
      </div>
    </div>
    <div className="universe-toolbar" role="group" aria-label="Controles de la escena"><span>Seleccioná un planeta</span><button type="button" aria-label="Alejar escena" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, +(value - .15).toFixed(2)))}><FiMinus/></button><output aria-label="Zoom de la escena">{Math.round(zoom * 100)}%</output><button type="button" aria-label="Acercar escena" disabled={zoom >= 1.6} onClick={() => setZoom(value => Math.min(1.6, +(value + .15).toFixed(2)))}><FiPlus/></button><button type="button" aria-label="Restablecer escena" onClick={() => { setZoom(1); resetPointer(); }}><FiRotateCcw/></button></div>
    <div id="planet-information" className="universe-information" aria-live="polite">
      {detail && <><div><small>COORDENADA / {detail.name}</small><h3>{detail.title}</h3><p>{detail.copy}</p><button type="button" className="text-link" onClick={() => onExploreCategory(detail.id)}>Ver {detail.name} <FiArrowRight/></button></div><button type="button" className="scene-close" aria-label="Cerrar planeta" onClick={close}><FiX/></button></>}
      {project && <><div><small>RECORRIDO / {tour + 1} DE {featuredProjects.length}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tour-actions"><button type="button" disabled={tour === 0} onClick={() => setTour(value => value - 1)}>Anterior</button><button type="button" onClick={() => onOpenProject(project)}>Ver ficha</button>{tour < featuredProjects.length - 1 ? <button type="button" onClick={() => setTour(value => value + 1)}>Siguiente <FiArrowRight/></button> : <button type="button" onClick={close}>Terminar</button>}</div></div><button type="button" className="scene-close" aria-label="Detener recorrido" onClick={close}><FiX/></button></>}
      {!detail && !project && <p className="scene-hint">Tres destinos. Un universo de ideas.<br/>Explorá a tu ritmo con el teclado o el cursor.</p>}
    </div>
  </section>;
}
