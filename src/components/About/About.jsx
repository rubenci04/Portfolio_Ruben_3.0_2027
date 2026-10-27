import { FiArrowUpRight } from "react-icons/fi";
import profilePic from "../../assets/profile.webp";
import { profile } from "../../data/profile";
import "./About.css";
export default function About() {
  return (
    <section id="about" className="section container about-section">
      <div className="about-portrait">
        <div className="portrait-frame">
          <img src={profilePic} alt="Rubén Albarracín junto a su computadora y su gato" width="900" height="1200" loading="lazy" decoding="async" />
        </div>
        <span>DESDE ARGENTINA, CON CREATIVIDAD.</span>
      </div>
      <div className="about-copy">
        <div className="eyebrow">03 / Detrás del código</div>
        <h2>
          Curiosidad para imaginar.
          <br />
          Código para hacerlo real.
        </h2>
        <p>
          Soy Rubén, desarrollador de software en Tucumán, Argentina. Creo aplicaciones web,
          plataformas educativas y videojuegos: distintas formas de convertir
          una idea en algo que se puede usar, explorar o jugar.
        </p>
        <p>
          Curso la etapa final de la Tecnicatura Universitaria en Programación
          en la UTN. Esa formación acompaña una práctica enfocada en resolver
          problemas y construir experiencias interactivas.
        </p>
        <p>Trabajo con React, JavaScript, TypeScript, Vue.js y Python para crear interfaces y aplicaciones que resuelvan problemas reales. En Godot y GDScript exploro mecánicas de juego y mundos 2D y 3D, combinando programación y creatividad.</p>
        <p>Me interesa entender cómo funcionan las cosas y aprender construyendo. Integro Codex y Claude Code en mi flujo de trabajo: planifico, implemento, reviso el código y valido el resultado. Las herramientas acompañan mis decisiones técnicas y mi formación continua.</p>
        <div className="education">
          <span>UTN</span>
          <div>
            Tecnicatura Universitaria en Programación
            <small>Etapa final de la carrera</small>
          </div>
        </div>
        <a
          className="text-link"
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          Conectemos en LinkedIn <FiArrowUpRight />
        </a>
      </div>
    </section>
  );
}
