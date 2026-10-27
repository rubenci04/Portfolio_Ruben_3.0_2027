import { useId } from 'react';

// Flat inks only: no gradients, filters, raster assets or WebGL.
export default function CelPlanet({ palette = 'blue', ringed = false }) {
  const id = useId().replace(/:/g, '');
  const clip = `${id}-disc`;
  const dots = `${id}-dots`;
  const shadow = 'M125 18Q88 110 174 190L225 225V0Z';
  return <svg className={`cel-planet cel-${palette}`} viewBox="-10 -10 240 240" aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><circle cx="110" cy="110" r="77"/></clipPath><pattern id={dots} width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="var(--ink)"/></pattern></defs>
    {ringed && <g transform="rotate(-26 110 110)" fill="none"><ellipse cx="110" cy="110" rx="108" ry="25" stroke="var(--ink)" strokeWidth="18"/><ellipse cx="110" cy="110" rx="108" ry="25" stroke="var(--planet-ring)" strokeWidth="10"/></g>}
    <circle cx="115" cy="116" r="79" fill="var(--ink)"/>
    <g clipPath={`url(#${clip})`}><circle cx="110" cy="110" r="77" fill="var(--planet-base)"/><path d={shadow} fill="var(--planet-dark)"/><path d={shadow} fill={`url(#${dots})`}/><path d="M25 115Q27 30 117 29Q62 49 57 115Z" fill="var(--planet-light)"/><ellipse cx="73" cy="62" rx="18" ry="7" transform="rotate(-38 73 62)" fill="#fff5d9"/></g>
    <circle cx="110" cy="110" r="77" fill="none" stroke="var(--ink)" strokeWidth="4"/>
    {ringed && <g transform="rotate(-26 110 110)" fill="none"><path d="M2 110a108 25 0 0 0 216 0" stroke="var(--ink)" strokeWidth="18"/><path d="M2 110a108 25 0 0 0 216 0" stroke="var(--planet-ring)" strokeWidth="10"/></g>}
  </svg>;
}
