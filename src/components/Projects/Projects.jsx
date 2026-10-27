import { FiArrowUpRight } from 'react-icons/fi';
import { categories, filterProjects, projects, featuredProjects } from '../../data/projects';
import { profile } from '../../data/profile';
import ProjectCard from './ProjectCard';
import './Projects.css';
export default function Projects({category,onCategoryChange,onOpenProject}) {
 const visible=filterProjects(category);
 return <section id="projects" className="section container">
  <div className="section-heading"><div><div className="eyebrow">01 / Coordenadas creativas</div><h2>De la idea a la interacción<span className="accent-period">.</span></h2></div><p>Videojuegos, aplicaciones y sitios web.<br/>Cada proyecto, una forma de construir.</p></div>
  <section className="featured-projects" aria-labelledby="featured-heading"><h3 id="featured-heading" className="catalog-heading">Proyectos destacados</h3><p className="catalog-intro">Seis puntos de partida para explorar mi trabajo.</p><div className="projects-grid featured-grid">{featuredProjects.map((project,index)=><ProjectCard key={project.id} project={project} index={index} compact onOpen={onOpenProject}/>)}</div></section>
  <section id="catalog" className="catalog-section" aria-labelledby="catalog-heading"><div className="catalog-title"><h3 id="catalog-heading" className="catalog-heading" tabIndex="-1">Catálogo completo</h3><span>{projects.length} proyectos / todas las coordenadas</span></div>
   <div className="filter-bar"><div className="project-filters" role="group" aria-label="Filtrar catálogo">{categories.map(item=><button key={item.id} type="button" aria-pressed={category===item.id} onClick={event=>{onCategoryChange(item.id);event.currentTarget.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}}>{item.label}<span>{filterProjects(item.id).length}</span></button>)}</div><span className="project-count" role="status" aria-live="polite">{visible.length} proyectos</span></div>
   <div className="projects-grid catalog-grid">{visible.map((project,index)=><ProjectCard key={project.id} project={project} index={index} onOpen={onOpenProject}/>)}</div>
  </section>
  <a className="text-link all-repositories" href={profile.github} target="_blank" rel="noreferrer">Más código e ideas en GitHub <FiArrowUpRight/></a>
 </section>;
}
