import kiosco from "../assets/cards_images/kiosco.webp";
import esteticars from "../assets/cards_images/esteticars.webp";
import donenrique from "../assets/cards_images/donenrique.webp";
import portfolio from "../assets/cards_images/portfolio.webp";
import barGestion from "../assets/cards_images/bar-gestion-login.webp";

export const categories = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Aplicaciones web" },
  { id: "web-game", label: "Videojuegos web" },
  { id: "godot", label: "Godot Engine" },
  { id: "archive", label: "Trabajos anteriores" },
];
// Demo links confirm publication. Other release states remain conservative until owner confirmation.
// image and video are optional real assets; null selects an explicitly abstract CSS cover.
export const projects = [
  {
    id: "edu-app",
    title: "Edu App Contable",
    category: "web",
    description:
      "Plataforma educativa de contabilidad con simulación de documentos comerciales, actividades de aprendizaje y funcionalidades de aula virtual.",
    technologies: ["React", "TypeScript", "Supabase", "PWA"],
    status: "development",
    privateRepository: true,
    cover: "edu",
    coverLabel: "EDUCACIÓN / PRODUCTO DIGITAL",
    coverTitle: ["Aprender.", "Simular.", "Comprender."],
    image: null,
    video: null,
    demo: null,
    repository: null,
  },
  {
    id: "bar-gestion",
    title: "Don Enrique · Gestión del bar",
    category: "web",
    description:
      "Aplicación para administrar mesas, pedidos, productos, stock y caja de Don Enrique. Acceso con usuarios y permisos para las tareas de administración y atención del bar.",
    technologies: ["Python", "Flask", "SQLAlchemy", "Jinja2", "Tailwind CSS"],
    status: "published",
    statusLabel: "Acceso privado",
    availability: "Requiere usuario y contraseña. La captura muestra la pantalla pública de acceso.",
    image: barGestion,
    imageAlt: "Pantalla pública de inicio de sesión de Don Enrique Bar-Gestión",
    demo: "https://bar-app-web.onrender.com/",
    demoLabel: "Abrir acceso",
    repository: "https://github.com/rubenci04/bar_app_web",
  },
  {
    id: "reclutador",
    title: "Reclutador",
    category: "web-game",
    description:
      "Subastas futbolísticas, gestión de presupuestos y tácticas. Armá tu equipo y llevá tu estrategia a la simulación de partidos.",
    technologies: ["Tecnologías web", "Lógica de juegos"],
    status: "published",
    cover: "football",
    coverLabel: "ESTRATEGIA / FÚTBOL",
    coverTitle: ["Tu equipo.", "Tus reglas."],
    image: null,
    video: null,
    demo: "https://reclutador-app.rea-04.workers.dev/",
    repository: "https://github.com/rubenci04/reclutador_app",
  },
  {
    id: "bee-alien",
    title: "Bee Alien 3D",
    category: "godot",
    description:
      "Acción y disparos sobre rieles en un universo tridimensional, con enemigos, combate y escenarios desarrollados en Godot.",
    technologies: ["Godot Engine", "3D", "Gameplay"],
    status: "development",
    cover: "bee",
    coverLabel: "RAIL SHOOTER / 3D",
    coverTitle: ["Una pequeña abeja.", "Un gran universo."],
    image: null,
    video: null,
    demo: null,
    repository: "https://github.com/rubenci04/bee-vs-aliens-",
  },
  {
    id: "tucuman-rush",
    title: "Tucumán Rush",
    category: "godot",
    description:
      "Arcade de acción ambientado en Tucumán. Desplazamiento lateral, combate y progresión de niveles con identidad local.",
    technologies: ["Godot Engine", "2D", "Gameplay"],
    status: "development",
    cover: "rush",
    coverLabel: "ACCIÓN / IDENTIDAD LOCAL",
    coverTitle: ["TUCUMÁN", "RUSH"],
    image: null,
    video: null,
    demo: null,
    repository: "https://github.com/rubenci04/heroe-tucumano-2d",
  },
  {
    id: "crochet-match",
    title: "Crochet Match",
    category: "godot",
    description:
      "Un gato, un universo artesanal y muchos desafíos. Videojuego casual Match-3 ambientado en el mundo del crochet.",
    technologies: ["Godot Engine", "Match-3", "2D"],
    status: "development",
    cover: "crochet",
    coverLabel: "CASUAL / MATCH-3",
    coverTitle: ["Un mundo", "tejido para jugar."],
    image: null,
    video: null,
    demo: null,
    repository: null,
  },
  {
    id: "ricota-quiz",
    title: "Ricota Quiz",
    category: "web-game",
    description:
      "La música se vuelve juego: trivias, sopas de letras, crucigramas y desafíos interactivos para poner a prueba tus conocimientos.",
    technologies: ["Tecnologías web", "Minijuegos"],
    status: "published",
    cover: "music",
    coverLabel: "MÚSICA / MINIJUEGOS",
    coverTitle: ["¿Cuánto hay", "de rock en vos?"],
    image: null,
    video: null,
    demo: "https://ricota-quiz.rea-04.workers.dev/",
    repository: "https://github.com/rubenci04/ricota_quiz",
  },
];
export const archivedProjects = [
  {
    id: "kiosco",
    title: "App Ventas y Gestión de Kiosco",
    description: "Gestión comercial, inventario y seguimiento de ventas.",
    technologies: ["React", "Node.js", "MongoDB"],
    image: kiosco,
    demo: null,
    previousDemo: "https://buchigestionkiosco.onrender.com/auth/login",
    availability: "Servidor sin respuesta en la revisión",
  },
  {
    id: "esteticars",
    title: "Estéticars Monteros",
    description: "Sitio responsive para un centro de estética vehicular.",
    technologies: ["React", "JavaScript", "CSS"],
    image: esteticars,
    demo: "https://esteticars-monteros.vercel.app/",
  },
  {
    id: "don-enrique",
    title: "Bar Don Enrique",
    description: "Sitio web para Bar Don Enrique: presentación de su propuesta gastronómica, pizzas y cervezas artesanales.",
    technologies: ["Vue.js", "JavaScript", "Sass"],
    image: donenrique,
    demo: "https://donenriqueweb.netlify.app",
  },
  {
    id: "portfolio",
    title: "Portfolio anterior",
    description: "La versión anterior de este portfolio profesional.",
    technologies: ["React", "Vite", "CSS", "Framer Motion"],
    image: portfolio,
    demo: null,
    previousDemo: "https://portfoliorubenweb.netlify.app",
    availability: "Publicación anterior no disponible (404)",
    repository: "https://github.com/rubenci04/portfolio_web",
  },
];
archivedProjects.push({
 id: 'traidores-no', title: 'Traidores No', category: 'archive',
 description: 'Sitio para una banda de rock argentino. Proyecto universitario colaborativo con Shaiel Ferreyra y Delfina Diaz.',
 technologies: ['React', 'JavaScript', 'CSS'], image: null, demo: 'https://traidoresno.vercel.app/',
 cover: 'music', coverLabel: 'COLABORACIÓN / ROCK', coverTitle: ['Traidores', 'NO'],
});
archivedProjects.forEach(project => {
 project.category = 'archive';
 project.status = 'archived';
 project.availability ??= project.demo ? 'Enlace público' : 'Sin demo pública';
});
export const allProjects = [...projects, ...archivedProjects];
// Optional future media: screenshots, gameplay, gallery, detailUrl, windowsBuild, html5Build.
allProjects.forEach(project => { project.media = { screenshots: [], gameplay: null, gallery: [], detailUrl: null, windowsBuild: null, html5Build: null }; });
export function filterProjects(category) {
  return category === "all"
    ? allProjects
    : allProjects.filter((project) => project.category === category);
}
