import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { profile } from "../../data/profile";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footer-container container">
      <div>
        <a className="footer-logo" href="#home">
          ra<span>.</span>
        </a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
      <span>HECHO CON CÓDIGO Y CURIOSIDAD.</span>
      <div className="footer-social-links">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub de Rubén Albarracín"
        >
          <FaGithub />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn de Rubén Albarracín"
        >
          <FaLinkedin />
        </a>
        <a
          href={profile.whatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
}
