import { useEffect, useRef } from 'react';
import SpaceParticles from './SpaceParticles';
import './Background.css';
export default function Background({ enabled = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const move = (e) => {
      if (!enabled || media.matches || !matchMedia('(pointer: fine)').matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--px', `${(e.clientX / innerWidth - .5) * 42}px`);
        node.style.setProperty('--py', `${(e.clientY / innerHeight - .5) * 30}px`);
      });
    };
    const visibility = () => node.classList.toggle('paused', document.hidden || !enabled);
    const reset = () => { cancelAnimationFrame(frame); node.style.setProperty('--px','0px'); node.style.setProperty('--py','0px'); };
    if (!enabled) reset();
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', reset);
    visibility();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', reset); };
  }, [enabled]);
  return <div ref={ref} className="background" aria-hidden="true"><div className="star-parallax">{[0,1,2].map(layer => <div className={`stars stars-${layer}`} key={layer}>{Array.from({length: layer === 0 ? 65 : 28}, (_,i) => <i key={i} style={{left: `${(i * 73.137 + layer * 19) % 100}%`, top: `${(i * 37.719 + layer * 23) % 100}%`, opacity: .3 + (i % 6) / 10}} />)}</div>)}<div className="distant-planet planet-blue"/><div className="distant-planet planet-gold"/></div><SpaceParticles enabled={enabled}/></div>;
}
