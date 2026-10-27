import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

let activeVideo = null;
const previewQuery = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const subscribe = listener => {
  const preference = matchMedia(previewQuery);
  preference.addEventListener('change', listener);
  return () => preference.removeEventListener('change', listener);
};
const sizeCache = new Map();
const limit = 4_000_000;

export default function GameplayPreview({ media, title, children }) {
  const video = useRef(null);
  const host = useRef(null);
  const wantsPlayback = useRef(false);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const finePointer = useSyncExternalStore(subscribe, () => matchMedia(previewQuery).matches, () => false);
  const source = media.previewVideo || media.previewWebm;
  const eligible = Boolean(finePointer && source && !failed && (!media.previewBytes || media.previewBytes <= limit));
  const pause = () => { wantsPlayback.current = false; video.current?.pause(); };

  useEffect(() => {
    const current = video.current;
    if (!current) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) { wantsPlayback.current = false; current.pause(); }
    });
    observer.observe(host.current);
    if (wantsPlayback.current) current.play().catch(() => {});
    const hidden = () => { if (document.hidden) { wantsPlayback.current = false; current.pause(); } };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      current.pause();
      if (activeVideo === current) activeVideo = null;
      observer.disconnect();
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [armed, eligible]);

  const play = async () => {
    if (!eligible) return;
    wantsPlayback.current = true;
    let bytes = media.previewBytes || sizeCache.get(source);
    if (!bytes) {
      // A HEAD request verifies future videos before downloading; no code edit is needed.
      try {
        const response = await fetch(source, { method: 'HEAD' });
        bytes = response.ok ? Number(response.headers.get('content-length')) : 0;
        if (bytes > 0) sizeCache.set(source, bytes);
      } catch { return; }
    }
    if (!(bytes > 0 && bytes <= limit) || !wantsPlayback.current || !matchMedia(previewQuery).matches) return;
    setArmed(true);
    video.current?.play().catch(() => {});
  };

  if (!eligible) return <>{children}</>;
  return <div ref={host} className={`gameplay-preview ${playing ? 'is-playing' : ''}`} tabIndex="0" aria-label={`Preview de ${title}`}
    onPointerEnter={event => { if (event.pointerType !== 'touch') play(); }} onPointerLeave={pause}
    onFocus={play} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) pause(); }}>
    {children}
    {armed && <video ref={video} muted playsInline loop preload="none" poster={media.poster || undefined}
      aria-label={`Video preview de ${title}`} src={source}
      onPlay={() => {
        if (!wantsPlayback.current) { video.current.pause(); return; }
        if (activeVideo && activeVideo !== video.current) activeVideo.pause();
        activeVideo = video.current; setPlaying(true);
      }} onPause={() => setPlaying(false)} onError={() => { pause(); setFailed(true); }}/ >}
    <button className="preview-toggle" type="button" aria-label={`${playing ? 'Pausar' : 'Reproducir'} preview de ${title}`} onClick={() => playing ? pause() : play()}>{playing ? 'Ⅱ Pausar' : '▷ Ver preview'}</button>
  </div>;
}
