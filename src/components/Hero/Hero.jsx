import UniverseExplorer from '../Universe/UniverseExplorer';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import './Hero.css';
export default function Hero({ onExploreCategory, onOpenProject, spaceEnabled, onSpaceEnabledChange }) {
 return <section id="home" className="hero container">
  <div className="hero-copy"><div className="hero-intro"><span className="status-dot"/> CÓDIGO / CREATIVIDAD / UNIVERSO</div>
  <p className="hero-name">Rubén Albarracín <span>↗</span></p>
  <h1>Las ideas<br/>se vuelven<br/><span>realidad.</span></h1>
  <p className="hero-role">Software Developer —<br/> Web Applications &amp; Game Development</p>
  <p className="hero-description">Desarrollo aplicaciones web y videojuegos, combinando programación, creatividad y diseño para convertir ideas en proyectos reales.</p>
  <div className="hero-actions"><a className="button button-primary" href="#projects">Explorar proyectos <FiArrowUpRight/></a><a className="button" href="#about">Sobre mí <FiArrowDown/></a></div></div>
  <UniverseExplorer onExploreCategory={onExploreCategory} onOpenProject={onOpenProject} enabled={spaceEnabled} onEnabledChange={onSpaceEnabledChange}/>
  <div className="hero-bottom"><span>UN UNIVERSO DE IDEAS, LÍNEA A LÍNEA.</span><a href="#projects">Seguí explorando <FiArrowDown/></a></div>
 </section>;
}
