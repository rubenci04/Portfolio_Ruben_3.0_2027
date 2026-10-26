import { useRef, useState, useEffect } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { profile, navigation } from "../../data/profile";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef(null),
    nav = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    navigation.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "keydown" && e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (
        (e.type === "pointerdown" || e.type === "focusin") &&
        !nav.current?.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    document.addEventListener("focusin", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("focusin", close);
    };
  }, [open]);
  return (
    <header className="site-header">
      <nav
        ref={nav}
        className="navbar container"
        aria-label="Navegación principal"
      >
        <a
          href="#home"
          className="navbar-logo"
          aria-label="Rubén Albarracín, inicio"
          onClick={() => setOpen(false)}
        >
          ra<span>.</span>
          <span className="logo-caption">
            SOFTWARE
            <br />
            DEVELOPER
          </span>
        </a>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
        <div
          id="navigation"
          className={"navbar-links " + (open ? "is-open" : "")}
        >
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={"#" + id}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          {profile.cvUrl && (
            <a href={profile.cvUrl} download>
              Descargar CV
            </a>
          )}
        </div>
        <a
          className="nav-github text-link"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub <FiArrowUpRight />
        </a>
      </nav>
    </header>
  );
}
