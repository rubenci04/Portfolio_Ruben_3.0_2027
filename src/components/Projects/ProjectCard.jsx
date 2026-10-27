import { FiArrowUpRight, FiGithub, FiLock } from 'react-icons/fi';
import { categories } from '../../data/projects';
import ProjectCover from '../Media/ProjectCover';
export default function ProjectCard({project,index,onOpen,compact=false}) {
 const category=project.categoryLabel || categories.find(item=>item.id===project.category)?.label;
 return <article className={`project-card ${compact?'featured-card':''}`} data-project={project.id}>
  <ProjectCover project={project} index={index}/>
  <div className="project-body">
   <div className="project-meta"><span>{category}</span>{!compact && <span className={`project-status ${project.status}`}><i/>{project.statusLabel || (project.status==='published'?'Publicado':project.status==='archived'?'Trabajo anterior':'En desarrollo')}</span>}</div>
   <h4>{project.title}</h4>
   {!compact && <><p>{project.description}</p><div className="tags">{project.technologies.map(tech=><span key={tech}>{tech}</span>)}</div>{project.availability && <p className="availability">{project.availability}</p>}</>}
   <div className="project-links">
    <button type="button" className="project-detail-button" aria-label={`Ver ficha de ${project.title}`} onClick={()=>onOpen(project)}>Ver ficha <FiArrowUpRight/></button>
    {!compact && <>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${project.demoLabel || 'Ver demo'} de ${project.title}`}>{project.demoLabel || 'Abrir demo'} <FiArrowUpRight/></a>}{project.repository && <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`Ver código de ${project.title}`}><FiGithub/> Código</a>}{project.privateRepository && <span><FiLock/> Repositorio privado</span>}{!project.demo && !project.repository && !project.privateRepository && <span>Sin demo pública</span>}</>}
   </div>
  </div>
 </article>;
}
