import python from "../assets/cards_images/app-python.webp";
import tejido from "../assets/cards_images/tejido.webp";
import kiosco from "../assets/cards_images/kiosco.webp";
import esteticars from "../assets/cards_images/esteticars.webp";
import donenrique from "../assets/cards_images/donenrique.webp";
import portfolio from "../assets/cards_images/portfolio.webp";
import barGestion from "../assets/cards_images/bar-gestion-login.webp";
import { discoverMedia } from './projectMedia';

export const categories = [
 { id: 'all', label: 'Todos' },
 { id: 'godot', label: 'Godot' },
 { id: 'web-game', label: 'Juegos web' },
 { id: 'web', label: 'Aplicaciones web' },
 { id: 'android', label: 'Android' },
 { id: 'site', label: 'Sitios web' },
];
// Demo links confirm publication. Other release states remain conservative until owner confirmation.
// image and video are optional real assets; null selects an explicitly abstract CSS cover.
const currentProjects = [
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
    demo: "https://edu-app-contable.rea-04.workers.dev/",
    demoLabel: "Abrir app",
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
    statusLabel: "Uso privado",
    availability: "Aplicación de uso privado, sin demo pública. Mira el video y las capturas.",
    image: barGestion,
    imageAlt: "Dashboard de administración de Don Enrique · Gestión del bar",
    demo: null,
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
const legacyProjects = [
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
    hidden: true,
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
legacyProjects.push({
 id: 'traidores-no', title: 'Traidores No', category: 'archive',
 description: 'Sitio para una banda de rock argentino. Proyecto universitario colaborativo con Shaiel Ferreyra y Delfina Diaz.',
 technologies: ['React', 'JavaScript', 'CSS'], image: null, demo: 'https://traidoresno.vercel.app/',
 cover: 'music', coverLabel: 'COLABORACIÓN / ROCK', coverTitle: ['Traidores', 'NO'],
});

const androidProjects = [
 { id:'ostoappar', title:'OstoAppAR', category:'android',
   description:'Aplicación Android orientada al registro de cuidados de ostomía y al control del inventario de insumos. Una herramienta para organizar una necesidad cotidiana real.',
   technologies:['React Native','Expo','AsyncStorage'], status:'functional', statusLabel:'Funcional · APK',
   editorial:{releaseStatus:'functional-apk',confirmationRequired:false,confirmedBy:'owner',confirmedOn:'2026-10-27'},
   cover:'android-osto', coverLabel:'ANDROID / ORGANIZACIÓN PERSONAL', coverTitle:['Cuidar.','Registrar.','Organizar.'],
   repository:'https://github.com/rubenci04/OstoAppAR', demo:null,
   features:['Inventario de bolsas y discos con persistencia local.','Registros diarios e historial.','Recordatorios y exportación de reportes PDF.'],
   sourceNotes:['package.json','src/screens/TrackerScreen.js','src/utils/pdfGenerator.js'],
 },
 { id:'gym-scientific',title:'Gym Scientific App',category:'android',
   description:'Aplicación Android para planificar rutinas, registrar entrenamientos y consultar el progreso. Incluye biblioteca de ejercicios y recordatorios de hidratación.',
   technologies:['Flutter','Dart','Hive'],status:'functional',statusLabel:'Funcional · APK',
   editorial:{releaseStatus:'functional-apk',confirmationRequired:false,confirmedBy:'owner',confirmedOn:'2026-10-27'},
   cover:'android-gym',coverLabel:'ANDROID / ENTRENAMIENTO',coverTitle:['Planificar.','Entrenar.','Progresar.'],
   repository:'https://github.com/rubenci04/gym_scientific_app', demo:null,
   features:['Rutinas editables y biblioteca de ejercicios.','Registro de sesiones e historial de progreso.','Persistencia local y notificaciones de hidratación.'],
   sourceNotes:['pubspec.yaml','lib/screens/workout_screen.dart','lib/screens/progress_screen.dart','lib/services/notification_service.dart'],
 },
];
legacyProjects.push(
 {id:'python',title:'App Python',hidden:true,description:'Aplicación de escritorio desarrollada con Python y Tkinter. Trabajo conservado del catálogo original.', technologies:['Python','Tkinter'],image:python,demo:null,status:'archived',category:'desktop',categoryLabel:'Aplicación de escritorio',availability:'Sin demo pública verificada.'},
 {id:'tejido',title:'Emprendimiento de Tejido',hidden:true,description:'Proyecto de comercio electrónico para un emprendimiento de tejidos a crochet, en desarrollo.',technologies:['React','Node.js','Express','MongoDB'],image:tejido,demo:null,status:'development',category:'web'},
);
const defaultMedia = {cover:null,poster:null,screenshots:[],previewVideo:null,previewWebm:null,aspectRatio:'16 / 9',mediaStatus:'pending'};
function normalize(project) {
 const category = project.category === 'archive' || !project.category ? (project.id==='kiosco'?'web':'site') : project.category;
 const status=project.status || 'archived';
 const discovered=discoverMedia(project.id, project.title);
 const cover=discovered.cover || project.media?.cover || project.image || null;
 const screenshots=discovered.screenshots.length ? discovered.screenshots : project.media?.screenshots || (cover ? [{src:cover,alt:`Captura 1 de ${project.title}`}] : []);
 const videos=discovered.videos.length ? discovered.videos : project.media?.videos || [];
 const media={...defaultMedia,...project.media,cover,poster:discovered.poster || project.media?.poster || cover,screenshots,videos};
 media.previewVideo=videos[0]?.src || media.previewVideo;
 media.previewBytes=videos[0]?.bytes || null;
 media.mediaStatus=cover || screenshots.length || videos.length ? 'available' : 'pending';
 return {...project,image:cover,category,categories:[category],status,
  features:project.features || [],
  media,
 };
}
export const allProjects = [...currentProjects,...androidProjects,...legacyProjects].map(normalize);
export const featuredIds = ['bee-alien','tucuman-rush','reclutador','crochet-match','ricota-quiz','edu-app'];
export const featuredProjects = featuredIds.map(id=>allProjects.find(project=>project.id===id)).filter(project=>project && !project.hidden);
export const projects = allProjects.filter(project=>!project.hidden);
export function filterProjects(category) {
 return projects.filter(project=>category==='all' || project.categories.includes(category));
}
