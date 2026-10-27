import { access } from "node:fs/promises";
import { resolve, sep } from "node:path";

export async function validateProjectMedia(projects, root = process.cwd()) {
  for (const project of projects) {
    const media = project.media;
    if (!media || !Array.isArray(media.screenshots)) throw new Error(`Media inválida: ${project.id}`);
    const files = [media.cover, media.poster, media.previewVideo, media.previewWebm, ...media.screenshots.map(image => image.src)].filter(Boolean);
    for (const source of files) {
      if (!source.startsWith("/") || source.includes("..")) throw new Error(`Usar un medio local: ${project.id}`);
      const path = resolve(root, source.startsWith("/src/") ? `.${source}` : `public${source}`);
      if (!path.startsWith(resolve(root) + sep)) throw new Error(`Medio fuera del proyecto: ${project.id}`);
      try { await access(path); } catch { throw new Error(`Falta el medio ${source} de ${project.id}`); }
    }
  }
}
