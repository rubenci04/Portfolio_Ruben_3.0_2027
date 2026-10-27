import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { siteConfig } from './site-config.mjs';
import { validateProjectMedia } from './validate-media.mjs';
const config = siteConfig(process.env);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { default: App } = await server.ssrLoadModule('/src/App.jsx');
 const { allProjects } = await server.ssrLoadModule('/src/data/projects.js');
 await validateProjectMedia(allProjects);
 let markup = renderToString(createElement(App));
 const manifest = JSON.parse(await fs.readFile('dist/.vite/manifest.json','utf8'));
 for (const [source, asset] of Object.entries(manifest)) markup = markup.replaceAll('/'+source, '/'+asset.file);
 // Vite dev asset paths must never escape into the static build.
 if (/src="\/src\//.test(markup)) throw new Error('Unresolved static asset');
 let html = await fs.readFile('dist/index.html','utf8');
 html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
 const schema = { '@context':'https://schema.org', '@type':'Person', name:'Rubén Albarracín', jobTitle:'Software Developer', sameAs:['https://github.com/rubenci04','https://www.linkedin.com/in/rubenalbarra/'], ...(config.url ? {url:config.url} : {}) };
 html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script>${config.url ? `<link rel="canonical" href="${config.url}/"><meta property="og:url" content="${config.url}/">` : ''}</head>`);
 if(config.production) html=html.replace('content="noindex, follow"','content="index, follow"');
 if (/^[a-f0-9]{40}$/i.test(process.env.COMMIT_REF || '')) html=html.replace('</head>', `<meta name="build-revision" content="${process.env.COMMIT_REF}"></head>`);
 await fs.writeFile('dist/index.html',html);
 await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${config.url ? `Sitemap: ${config.url}/sitemap.xml\n` : ''}`);
 await fs.writeFile('dist/_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${config.production ? '' : '  X-Robots-Tag: noindex, follow\n'}`);
 if(config.url) await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${config.url}/</loc></url></urlset>`);
 console.log(`Static HTML generated: ${config.production ? config.url : 'preview / noindex'}`);
} finally { await server.close(); }
