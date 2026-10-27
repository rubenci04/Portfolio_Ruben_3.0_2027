import { useEffect, useRef } from "react";

// A small foreground layer; CSS keeps the distant star field visible without JS.
export default function SpaceParticles({ enabled = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine)");
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let stars = [];
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let nextMeteor = 8;
    let meteor = null;

    function paint(delta = 0) {
      const interactive = enabled && pointer.active && fine.matches && !reduced.matches;
      context.clearRect(0, 0, width, height);
      let connections = 0;
      for (const star of stars) {
        star.x = (star.x + delta * (star.vx + Math.sin(elapsed * .3 + star.phase) * 2) + width) % width;
        star.y = (star.y - delta * star.speed * .7 + height) % height;
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const force = interactive ? Math.max(0, 1 - distance / 175) : 0;
        const offset = force * 34;
        const easing = reduced.matches ? 1 : 1 - Math.exp(-delta * 8);
        star.ox += ((distance ? dx / distance * offset : 0) - star.ox) * easing;
        star.oy += ((distance ? dy / distance * offset : 0) - star.oy) * easing;
        const x = star.x + star.ox;
        const y = star.y + star.oy;
        context.fillStyle = `rgb(${star.color})`;
        context.beginPath();
        const radius = star.radius + force * 2;
        if (star.sparkle) {
          context.moveTo(x, y - radius * 3);
          context.lineTo(x + radius * .6, y - radius * .6);
          context.lineTo(x + radius * 3, y);
          context.lineTo(x + radius * .6, y + radius * .6);
          context.lineTo(x, y + radius * 3);
          context.lineTo(x - radius * .6, y + radius * .6);
          context.lineTo(x - radius * 3, y);
          context.lineTo(x - radius * .6, y - radius * .6);
          context.closePath();
        } else context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        if (force > .15 && connections < 6) {
          context.strokeStyle = '#658da9';
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(x, y);
          context.stroke();
          connections++;
        }
      }
      if (delta && elapsed >= nextMeteor) {
        meteor = { x: width * .17, y: height * .12, life: 0 };
        nextMeteor = elapsed + 14;
      }
      if (meteor && delta) {
        meteor.life += delta;
        meteor.x += delta * 260;
        meteor.y += delta * 110;
        context.strokeStyle = '#ffe098';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(meteor.x - 70, meteor.y - 30);
        context.lineTo(meteor.x, meteor.y);
        context.stroke();
        if (meteor.life >= 1.4) meteor = null;
      }
    }

    function tick(time) {
      if (!enabled || document.hidden || reduced.matches) { frame = 0; return; }
      if (!previous) previous = time;
      const delta = (time - previous) / 1000;
      // Limit drawing to 30 fps and avoid jumps after resuming the tab.
      if (delta >= 1 / 30) {
        const step = Math.min(delta, .08);
        elapsed += step;
        paint(step);
        previous = time;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (!enabled || reduced.matches) {
        pointer.active = false;
        paint();
      } else if (!document.hidden) frame = requestAnimationFrame(tick);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: width < 600 ? 28 : 58 }, (_, i) => ({
        x: ((i * .61803398875 + .07) % 1) * width,
        y: ((i * .41421356237 + .13) % 1) * height,
        speed: 5 + i % 5 * 2,
        radius: .7 + i % 3 * .35,
        sparkle: i % 7 === 0,
        phase: i * 1.7,
        vx: -2 + i % 5,
        color: ["196,224,255", "249,221,174", "184,218,225"][i % 3],
        ox: 0, oy: 0,
      }));
      paint();
    }

    const move = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.pointerType !== "touch";
    };
    const leave = () => { pointer.active = false; };
    const out = event => { if (!event.relatedTarget) leave(); };
    resize();
    sync();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="space-particles" aria-hidden="true" />;
}
