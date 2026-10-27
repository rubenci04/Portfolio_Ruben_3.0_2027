import { useState } from "react";
export default function MobileShowcase({ screenshot, title, children, onError }) {
  const [broken, setBroken] = useState(false);
  return <div className="mobile-showcase"><div className="phone-frame">
    <span className="phone-speaker" aria-hidden="true"/>
    {screenshot && !broken ? <img src={screenshot.src} alt={screenshot.alt || `Pantalla de ${title}`} loading="lazy" width="360" height="780" onError={()=>{setBroken(true);onError?.();}}/> : <div className="phone-concept" aria-label={`Concepto gráfico de ${title}; sin captura disponible`}><span aria-hidden="true">✦</span><b>{title === "OstoAppAR" ? "OA" : "GS"}</b><small>CONCEPTO VISUAL</small>{children}</div>}
  </div></div>;
}
