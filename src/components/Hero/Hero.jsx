import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import './Hero.css';
export default function Hero() {
 return <section id="home" className="hero container">
  <div className="hero-copy"><div className="hero-intro"><span className="status-dot"/> CÓDIGO / CREATIVIDAD / UNIVERSO</div>
  <p className="hero-name">Rubén Albarracín <span>↗</span></p>
  <h1>Las ideas<br/>se vuelven<br/><span>realidad.</span></h1>
  <p className="hero-role">Software Developer —<br/> Web Applications &amp; Game Development</p>
  <p className="hero-description">Desarrollo aplicaciones web y videojuegos, combinando programación, creatividad y diseño para convertir ideas en proyectos reales.</p>
  <div className="hero-actions"><a className="button button-primary" href="#projects">Explorar proyectos <FiArrowUpRight/></a><a className="button" href="#about">Sobre mí <FiArrowDown/></a></div></div>
  <div className="studio-art" aria-hidden="true"><div className="art-topline"><span>RA / UNIVERSO DIGITAL</span><span>01 — ∞</span></div><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-planet core-object"><div className="planet-ring"/></div><div className="planet-coordinate">CREAR. CONSTRUIR. EXPLORAR.</div><div className="art-bottomline"><span>WEB + GAMES</span><span>TUCUMÁN · ARGENTINA</span></div></div>
  <div className="hero-bottom"><span>UN UNIVERSO DE IDEAS, LÍNEA A LÍNEA.</span><a href="#projects">Seguí explorando <FiArrowDown/></a></div>
 </section>;
}
