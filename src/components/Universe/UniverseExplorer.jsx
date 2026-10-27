import { useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus, FiRotateCcw, FiX, FiArrowRight } from "react-icons/fi";
import { featuredProjects } from "../../data/projects";
import "./UniverseExplorer.css";
import CelPlanet from './CelPlanet';

const planets = [
  { id: "godot", name: "Godot", title: "Mundos para jugar", copy: "Acción 2D, universos 3D y mecánicas que nacen del código.", className: "ringed" },
  { id: "web", name: "Aplicaciones web", title: "Ideas que resuelven", copy: "Educación, gestión y herramientas para problemas reales.", className: "amber" },
  { id: "android", name: "Android", title: "Software que te acompaña", copy: "Organización cotidiana y entrenamiento en aplicaciones móviles.", className: "ice" },
  { id: "site", name: "Sitios web", title: "Historias en la web", copy: "Landing pages y sitios para presentar una idea, un negocio o una identidad.", className: "site" },
];

function Rocket() {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><path className="rocket-flame" d="M24 63L9 91l29-15z" fill="#ffc85b"/><path d="M33 54L17 55l-7 20 24-7M47 69l-2 18 20-9 1-18" fill="#608393" stroke="#a2c8d4" strokeWidth="2"/><path d="M29 65C27 41 51 16 84 12c-3 35-27 58-51 58z" fill="#d9e5df" stroke="#86afbd" strokeWidth="2"/><path d="M65 17l14 15 5-20z" fill="#f6c769"/><circle cx="59" cy="38" r="10" fill="#142a44" stroke="#f6c769" strokeWidth="4"/><path d="M27 67l-7 12 14-6" fill="#fff0c1"/></svg>;
}

export default function UniverseExplorer({ onExploreCategory, onOpenProject, enabled, onEnabledChange }) {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [tour, setTour] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [navigating, setNavigating] = useState(false);
  const drag = useRef(null);
  const dragged = useRef(false);
  const scene = useRef(null);
  const trigger = useRef(null);
  const detail = planets.find(planet => planet.id === selected);
  const project = tour === null ? null : featuredProjects[tour];
  const limitZoom = value => Math.max(.75, Math.min(2, value));
  const resetCamera = () => { setZoom(1); setPan({ x: 0, y: 0 }); resetPointer(); };

  useEffect(() => {
    const element = scene.current;
    const wheel = event => {
      if (!navigating && !element.contains(document.activeElement)) return;
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      setZoom(value => Math.max(.75, Math.min(2, value * Math.exp(-event.deltaY * .0015))));
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [navigating]);

  useEffect(() => {
    const visibility = () => scene.current?.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  const close = () => { setSelected(null); setTour(null); resetCamera(); setNavigating(false); trigger.current?.focus(); };
  const choose = (id, element) => { trigger.current = element; setTour(null); setSelected(id); onExploreCategory(id); };
  const visit = index => {
    setSelected(null); setZoom(1); setTour(index);
    const destination = featuredProjects[index];
    onExploreCategory(destination.category, destination.id);
  };
  const move = event => {
    if (drag.current) {
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      if (Math.hypot(dx, dy) > 6) {
        dragged.current = true;
        if (!scene.current.hasPointerCapture(event.pointerId)) scene.current.setPointerCapture(event.pointerId);
      }
      if (dragged.current) {
        const maxX = scene.current.clientWidth * zoom * .55;
        const maxY = scene.current.clientHeight * zoom * .55;
        setPan({ x: Math.max(-maxX, Math.min(maxX, drag.current.pan.x + dx)), y: Math.max(-maxY, Math.min(maxY, drag.current.pan.y + dy)) });
      }
      return;
    }
    if (!enabled || event.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = scene.current.getBoundingClientRect();
    scene.current.style.setProperty("--look-x", `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 14}px`);
    scene.current.style.setProperty("--look-y", `${(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 10}px`);
  };
  const resetPointer = () => { scene.current?.style.setProperty("--look-x", "0px"); scene.current?.style.setProperty("--look-y", "0px"); };
  return <section className="universe" aria-label="Explorador del universo">
    <div className="universe-heading"><span>RA / UNIVERSO EXPLORABLE</span><button type="button" aria-pressed={!enabled} onClick={() => { onEnabledChange(!enabled); resetPointer(); }}>{enabled ? "Pausar universo" : "Activar universo"}</button></div>
    <p className="universe-help" id="universe-help">Arrastrá para explorar. Activá navegación para mover con el dedo y usar la rueda como zoom. Escape libera la escena.</p>
    <div ref={scene} tabIndex="0" role="group" aria-label="Mapa del universo" aria-describedby="universe-help" className={`universe-scene ${enabled ? "" : "scene-static"} ${navigating ? 'is-navigating' : ''}`}
      onPointerDown={event => {
        if (event.button !== 0 || (event.pointerType === 'touch' && !navigating)) return;
        dragged.current = false;
        drag.current = { x: event.clientX, y: event.clientY, pan };
        if (!event.target.closest('button')) event.currentTarget.focus({ preventScroll: true });
      }} onPointerMove={move} onPointerUp={event => {
        drag.current = null;
        if (scene.current.hasPointerCapture(event.pointerId)) scene.current.releasePointerCapture(event.pointerId);
      }} onPointerCancel={() => { drag.current = null; dragged.current = false; }}
      onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}
      onPointerLeave={() => { if (!drag.current) resetPointer(); }} onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); close(); event.currentTarget.blur(); }
        if (event.target !== scene.current) return;
        const direction = { ArrowLeft: [35,0], ArrowRight: [-35,0], ArrowUp: [0,35], ArrowDown: [0,-35] }[event.key];
        if (direction) { event.preventDefault(); setPan(value => ({ x: Math.max(-400, Math.min(400, value.x + direction[0])), y: Math.max(-400, Math.min(400, value.y + direction[1])) })); }
        if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(value => limitZoom(value + .15)); }
        if (event.key === '-') { event.preventDefault(); setZoom(value => limitZoom(value - .15)); }
        if (event.key === 'Home') { event.preventDefault(); resetCamera(); }
      }}>
      <div className="universe-world" style={{ "--scene-zoom": zoom, '--pan-x': `${pan.x}px`, '--pan-y': `${pan.y}px` }}>
        <div className="universe-orbit orbit-a" aria-hidden="true"/><div className="universe-orbit orbit-b" aria-hidden="true"/>
        {planets.map(planet => <button key={planet.id} type="button" className={`planet-control planet-${planet.className}`} aria-label={`Explorar planeta ${planet.name}`} aria-expanded={selected === planet.id} aria-controls="planet-information" onClick={event => choose(planet.id, event.currentTarget)}><span className="planet-sphere" aria-hidden="true"><CelPlanet palette={planet.className} ringed={planet.id === 'godot'}/></span><span className="planet-label">{planet.name}</span></button>)}
        <button className={`rocket-control ${tour !== null ? "rocket-launched" : ""}`} type="button" aria-label="Iniciar recorrido de proyectos" onClick={event => { trigger.current = event.currentTarget; visit(0); }}><Rocket/><span>Iniciar recorrido</span></button>
      </div>
    </div>
    <div className="universe-toolbar" role="group" aria-label="Controles de la escena"><button className="navigation-toggle" type="button" aria-pressed={navigating} onClick={() => setNavigating(value => !value)}>{navigating ? 'Salir de navegación' : 'Navegar universo'}</button><button type="button" aria-label="Alejar escena" disabled={zoom <= .75} onClick={() => setZoom(value => limitZoom(value - .15))}><FiMinus/></button><output aria-label="Zoom de la escena">{Math.round(zoom * 100)}%</output><button type="button" aria-label="Acercar escena" disabled={zoom >= 2} onClick={() => setZoom(value => limitZoom(value + .15))}><FiPlus/></button><button type="button" aria-label="Restablecer escena" onClick={resetCamera}><FiRotateCcw/></button></div>
    <div id="planet-information" className="universe-information" aria-live="polite">
      {detail && <><div><small>COORDENADA / {detail.name}</small><h3>{detail.title}</h3><p>{detail.copy}</p><button type="button" className="text-link" onClick={() => onExploreCategory(detail.id)}>Ver {detail.name} <FiArrowRight/></button></div><button type="button" className="scene-close" aria-label="Cerrar planeta" onClick={close}><FiX/></button></>}
      {project && <><div><small>RECORRIDO / {tour + 1} DE {featuredProjects.length}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tour-actions"><button type="button" disabled={tour === 0} onClick={() => visit(tour - 1)}>Anterior</button><button type="button" onClick={() => onOpenProject(project)}>Ver ficha</button>{tour < featuredProjects.length - 1 ? <button type="button" onClick={() => visit(tour + 1)}>Siguiente <FiArrowRight/></button> : <button type="button" onClick={close}>Terminar</button>}</div></div><button type="button" className="scene-close" aria-label="Detener recorrido" onClick={close}><FiX/></button></>}
      {!detail && !project && <p className="scene-hint">Cuatro destinos. Un universo de ideas.<br/>Explorá a tu ritmo con el teclado o el cursor.</p>}
    </div>
  </section>;
}
