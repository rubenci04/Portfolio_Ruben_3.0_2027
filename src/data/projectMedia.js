// Optional assets are discovered at build time; missing files are never imported directly.
const assets = import.meta.glob('../assets/media/*/*.{webp,mp4}', { eager: true, query: '?url', import: 'default' });
const metadata = import.meta.glob('../assets/media/*/metadata.json', { eager: true, import: 'default' });
const naturalOrder = (a, b) => a.localeCompare(b, undefined, { numeric: true });

export function discoverMedia(id, title) {
  const prefix = `../assets/media/${id}/`;
  const entries = Object.entries(assets).filter(([path]) => path.startsWith(prefix)).sort(([a], [b]) => naturalOrder(a, b));
  const lookup = name => assets[`${prefix}${name}`] || null;
  const cover = lookup('card.webp');
  const poster = lookup('poster.webp') || cover;
  const screenshots = entries.filter(([path]) => /\/shot-\d+\.webp$/.test(path)).map(([, src], index) => ({ src, alt: `Captura ${index + 1} de ${title}` }));
  if (!screenshots.length && cover) screenshots.push({ src: cover, alt: `Captura 1 de ${title}` });
  const videoBytes = metadata[`${prefix}metadata.json`]?.videoBytes || {};
  const videos = entries.filter(([path]) => /\/video-\d+\.mp4$/.test(path)).map(([path, src]) => ({
    src, bytes: videoBytes[path.slice(prefix.length)] || null,
    poster: lookup(path.slice(prefix.length).replace('.mp4', '-poster.webp')) || poster,
  }));
  return { cover, poster, screenshots, videos };
}
