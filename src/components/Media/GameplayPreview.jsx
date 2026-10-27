import { useEffect, useRef, useState, useSyncExternalStore } from "react";

let activeVideo = null;
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = listener => {
  const preference = matchMedia(reducedQuery);
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
};

export default function GameplayPreview({ media, title, children }) {
  const video = useRef(null);
  const host = useRef(null);
  const wantsPlayback = useRef(false);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia(reducedQuery).matches, () => true);
  const available = Boolean(media.previewVideo || media.previewWebm);
  const pause = () => { wantsPlayback.current = false; video.current?.pause(); };

  useEffect(() => {
    const current = video.current;
    if (!current) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) { wantsPlayback.current = false; current.pause(); }
    });
    observer.observe(host.current);
    // The first interaction mounts the video. Start loading only after that mount.
    if (wantsPlayback.current) current.play().catch(() => setPlaying(false));
    const hidden = () => { if (document.hidden) { wantsPlayback.current = false; current.pause(); } };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      current.pause();
      if (activeVideo === current) activeVideo = null;
      observer.disconnect();
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [armed, failed]);

  useEffect(() => { if (reduced) { wantsPlayback.current = false; video.current?.pause(); } }, [reduced]);

  const play = () => {
    if (!available || failed) return;
    wantsPlayback.current = true;
    setArmed(true);
    if (video.current) video.current.play().catch(() => {
      // Autoplay can be denied; the explicit play control remains available.
      setPlaying(false);
    });
  };
  const loaded = () => { if (wantsPlayback.current) video.current?.play().catch(() => setPlaying(false)); };
  if (!available || failed) return <>{children}</>;
  return <div ref={host} className={`gameplay-preview ${playing ? "is-playing" : ""}`}
    onPointerEnter={event => { if (event.pointerType === "mouse" && !reduced && matchMedia("(hover: hover)").matches) play(); }}
    onPointerLeave={pause}>
    {children}
    {armed && <video ref={video} muted playsInline loop preload="none" poster={media.poster || undefined}
      aria-label={`Preview de ${title}`} onLoadedData={loaded}
      onPlay={() => { if (activeVideo && activeVideo !== video.current) activeVideo.pause(); activeVideo = video.current; setPlaying(true); }}
      onPause={() => setPlaying(false)} onError={() => { pause(); setFailed(true); }}>
      {media.previewWebm && <source src={media.previewWebm} type="video/webm"/>}
      {media.previewVideo && <source src={media.previewVideo} type="video/mp4"/>}
    </video>}
    <button className="preview-toggle" type="button" aria-label={`${playing ? "Pausar" : "Reproducir"} preview de ${title}`} onClick={() => playing ? pause() : play()}>{playing ? "Ⅱ Pausar" : "▷ Ver preview"}</button>
  </div>;
}
