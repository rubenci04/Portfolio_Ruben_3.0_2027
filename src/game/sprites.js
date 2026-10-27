// Gráficos provisionales dibujados por código (3 tonos + contorno --ink).
// Interfaz: createSprites(scale) -> { draw(ctx, name, x, y, rot, alpha) }.
// Para usar un atlas WebP basta con reemplazar este módulo manteniendo esa interfaz.
const INK = '#050b17';
const TAU = Math.PI * 2;

function cel(c, path, tones, box, lw = 2.5) {
  const [x, y, w, h] = box;
  c.beginPath(); path(c); c.fillStyle = tones[1]; c.fill();
  c.save(); c.clip();
  c.fillStyle = tones[2];
  c.beginPath(); c.moveTo(x + w, y + h * 0.35); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.lineTo(x, y + h * 0.72); c.closePath(); c.fill();
  c.fillStyle = tones[0];
  c.beginPath(); c.ellipse(x + w * 0.3, y + h * 0.25, w * 0.16, h * 0.11, -0.6, 0, TAU); c.fill();
  c.restore();
  c.lineWidth = lw; c.lineJoin = 'round'; c.strokeStyle = INK;
  c.beginPath(); path(c); c.stroke();
}

const ROCK = [1, 0.86, 0.95, 0.8, 1, 0.88, 0.94, 0.82, 0.97];
const rock = (r) => (c) => {
  ROCK.forEach((k, i) => {
    const a = (i / ROCK.length) * TAU;
    c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r * k, Math.sin(a) * r * k);
  });
  c.closePath();
};

function asteroid(r) {
  return {
    w: r * 2.2, h: r * 2.2,
    draw(c) {
      cel(c, rock(r), ['#d9cabb', '#9a8878', '#5d5149'], [-r, -r, r * 2, r * 2], 2.5);
      if (r > 15) {
        cel(c, (k) => k.arc(-r * 0.28, -r * 0.2, r * 0.2, 0, TAU), ['#9a8878', '#6f6054', '#5d5149'], [-r * 0.5, -r * 0.4, r * 0.4, r * 0.4], 1.8);
        cel(c, (k) => k.arc(r * 0.32, r * 0.3, r * 0.14, 0, TAU), ['#9a8878', '#6f6054', '#5d5149'], [r * 0.18, r * 0.16, r * 0.28, r * 0.28], 1.8);
      }
    },
  };
}

function badge(label, color, shape) {
  return {
    w: 36, h: 36,
    draw(c) {
      c.fillStyle = '#fff6e4';
      c.beginPath(); c.arc(0, 0, 16, 0, TAU); c.fill();
      c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
      if (shape === 'atom') {
        c.lineWidth = 2; c.strokeStyle = color;
        for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(0, 0, 11, 4.2, (i * Math.PI) / 3, 0, TAU); c.stroke(); }
        c.fillStyle = color; c.beginPath(); c.arc(0, 0, 2.6, 0, TAU); c.fill();
      } else {
        c.fillStyle = color;
        c.beginPath(); c.arc(0, 0, 11, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.font = '800 12px "Segoe UI",Arial,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(label, 0, 1);
      }
    },
  };
}

function planet(r, tones, ring) {
  return {
    w: r * 3, h: r * 2.4,
    draw(c) {
      if (ring) { c.lineWidth = 6; c.strokeStyle = INK; c.beginPath(); c.ellipse(0, 0, r * 1.45, r * 0.4, -0.35, 0, TAU); c.stroke(); }
      cel(c, (k) => k.arc(0, 0, r, 0, TAU), tones, [-r, -r, r * 2, r * 2], 3);
      if (ring) { c.lineWidth = 3; c.strokeStyle = tones[0]; c.beginPath(); c.ellipse(0, 0, r * 1.45, r * 0.4, -0.35, 0.15, Math.PI - 0.15); c.stroke(); }
    },
  };
}

const DEFS = {
  bee: {
    w: 56, h: 64,
    draw(c) {
      const wing = (sx) => cel(c, (k) => k.ellipse(sx * 16, -2, 12, 7, sx * -0.6, 0, TAU), ['#f4fdff', '#bfeaff', '#8cc6e8'], [sx * 16 - 12, -9, 24, 14], 2);
      wing(-1); wing(1);
      const body = (k) => k.ellipse(0, 8, 13, 17, 0, 0, TAU);
      cel(c, body, ['#fff0a8', '#ffd166', '#e69f2e'], [-13, -9, 26, 34], 2.5);
      c.save(); c.beginPath(); body(c); c.clip(); c.fillStyle = INK;
      c.fillRect(-14, 7, 28, 5); c.fillRect(-14, 16, 28, 5); c.restore();
      cel(c, (k) => k.arc(0, -10, 8, 0, TAU), ['#fff0a8', '#ffd166', '#e69f2e'], [-8, -18, 16, 16], 2);
      c.fillStyle = INK; c.fillRect(-4.5, -12, 2.4, 4); c.fillRect(2.1, -12, 2.4, 4);
      c.globalAlpha = 0.5; c.fillStyle = '#9fdcff'; c.beginPath(); c.arc(0, -10, 13, 0, TAU); c.fill(); c.globalAlpha = 1;
      c.lineWidth = 3; c.strokeStyle = INK; c.beginPath(); c.arc(0, -10, 13, 0, TAU); c.stroke();
      c.lineWidth = 2.2; c.strokeStyle = '#fff'; c.beginPath(); c.arc(0, -10, 9, Math.PI * 1.15, Math.PI * 1.55); c.stroke();
    },
  },
  scout: {
    w: 40, h: 40,
    draw(c) {
      cel(c, (k) => { k.moveTo(0, 16); k.lineTo(16, -9); k.lineTo(9, -15); k.lineTo(0, -7); k.lineTo(-9, -15); k.lineTo(-16, -9); k.closePath(); }, ['#ffb0bd', '#e5486b', '#9c2a52'], [-16, -15, 32, 31], 2.5);
      cel(c, (k) => k.arc(0, -2, 5, 0, TAU), ['#fff0a8', '#ffd166', '#e69f2e'], [-5, -7, 10, 10], 2);
    },
  },
  ast0: asteroid(12),
  ast1: asteroid(20),
  ast2: asteroid(30),
  bullet: { w: 10, h: 22, draw(c) { cel(c, (k) => k.roundRect(-3, -9, 6, 18, 3), ['#ffffff', '#fff0a8', '#ffd166'], [-3, -9, 6, 18], 2); } },
  ebullet: { w: 14, h: 14, draw(c) { cel(c, (k) => k.arc(0, 0, 5, 0, TAU), ['#ffd0ec', '#ff5fbf', '#a62f86'], [-5, -5, 10, 10], 2); } },
  'item-0': badge('', '#1c9fc4', 'atom'),
  'item-1': badge('G', '#478cbf'),
  'item-2': badge('TS', '#3178c6'),
  planet0: planet(40, ['#c7a3ff', '#8a63d2', '#57399b'], true),
  planet1: planet(24, ['#ffb48a', '#e0703f', '#9b3f2a'], false),
};

export function createSprites(scale) {
  const cache = {};
  for (const name in DEFS) {
    const d = DEFS[name];
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(d.w * scale); cv.height = Math.ceil(d.h * scale);
    const k = cv.getContext('2d');
    k.scale(scale, scale); k.translate(d.w / 2, d.h / 2);
    d.draw(k);
    cache[name] = { cv, w: d.w, h: d.h };
  }
  return {
    draw(c, name, x, y, rot = 0, alpha = 1) {
      const s = cache[name];
      if (alpha !== 1) c.globalAlpha = alpha;
      if (rot) {
        c.save(); c.translate(x, y); c.rotate(rot);
        c.drawImage(s.cv, -s.w / 2, -s.h / 2, s.w, s.h); c.restore();
      } else c.drawImage(s.cv, x - s.w / 2, y - s.h / 2, s.w, s.h);
      if (alpha !== 1) c.globalAlpha = 1;
    },
  };
}
