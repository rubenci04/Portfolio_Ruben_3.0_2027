import { useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { categories, filterProjects, allProjects } from '../../data/projects';
import { profile } from '../../data/profile';
import ProjectCard from './ProjectCard';
import './Projects.css';
export default function Projects() {
 const [category,setCategory] = useState('all');
 const visible = filterProjects(category);
 const featured = visible.filter(p => p.category !== 'archive');
 const archive = visible.filter(p => p.category === 'archive');
 return <section id="projects" className="section container">
 <div className="section-heading"><div><div className="eyebrow">01 / Coordenadas creativas</div><h2>De la idea a la interacción<span className="accent-period">.</span></h2></div><p>Aplicaciones que resuelven problemas.<br/>Videojuegos que invitan a explorar.</p></div>
 <div className="filter-bar"><div className="project-filters" role="group" aria-label="Filtrar proyectos">{categories.map(item=><button key={item.id} type="button" aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}>{item.label}{item.id==='all' && <span>{allProjects.length}</span>}</button>)}</div><span className="project-count" role="status" aria-live="polite">{visible.length} proyectos</span></div>
 {featured.length>0 && <div className="featured-projects"><h3 className="catalog-heading">Proyectos destacados</h3><div className="projects-grid">{featured.map((p,i)=><ProjectCard project={p} index={i} key={p.id}/>)}</div></div>}
 {archive.length>0 && <div className="previous-projects"><h3 className="catalog-heading">Otros trabajos y colaboraciones</h3><p className="catalog-intro">Sitios para emprendimientos, proyectos académicos y primeras exploraciones. Cada trabajo es parte del recorrido.</p><div className="projects-grid">{archive.map((p,i)=><ProjectCard project={p} index={i} key={p.id}/>)}</div></div>}
 <a className="text-link all-repositories" href={profile.github} target="_blank" rel="noreferrer">Más código e ideas en GitHub <FiArrowUpRight/></a>
 </section>;
}
