# Material real de proyectos
Cada subcarpeta usa el id de src/data/projects.js.
card.webp es la portada (ancho máximo 1200 px, WebP calidad 80, sin EXIF).
shot-1.webp, shot-2.webp… forman la galería (ancho máximo 1600 px).
video-1.mp4, video-2.mp4… aparecen completos en la ficha, sin autoplay.
poster.webp es el poster común; video-1-poster.webp permite uno por video.
metadata.json puede registrar videoBytes por nombre para evitar consultas HEAD.
import.meta.glob descubre nuevos archivos al compilar: no hay que editar componentes.
Solo el primer video de hasta 4 MB admite preview con puntero fino y movimiento habilitado.
Los originales están en ../proyects_media, ignorados por Git; nunca se modifican.
