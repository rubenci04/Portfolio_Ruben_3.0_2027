export function siteConfig(env = {}) {
  const hostingPreview = (env.CONTEXT && env.CONTEXT !== 'production')
    || (env.VERCEL_ENV && env.VERCEL_ENV !== 'production')
    || (env.CF_PAGES === '1' && env.CF_PAGES_BRANCH !== (env.SITE_PRODUCTION_BRANCH || 'main'));
  const production = env.SITE_ENV === 'production' && !hostingPreview;
  let url = null;
  if (production) {
    const parsed = new URL(env.SITE_URL);
    if (parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password) throw new Error('SITE_URL debe ser un origen HTTPS público, sin rutas ni credenciales.');
    url = parsed.origin;
  }
  return { production, url };
}
