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

function badge(label, tones, shape) {
  return {
    w: 44, h: 44,
    draw(c) {
      cel(c, k => k.roundRect(-18, -18, 36, 36, 9), tones, [-18,-18,36,36], 3);
      c.strokeStyle = '#fff6e4'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-13,-7); c.lineTo(-13,-12); c.lineTo(-8,-12); c.stroke();
      if (shape === 'atom') {
        c.lineWidth = 2.2; c.strokeStyle = INK;
        for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(0, 0, 11, 4.2, (i * Math.PI) / 3, 0, TAU); c.stroke(); }
        c.fillStyle = INK; c.beginPath(); c.arc(0, 0, 2.6, 0, TAU); c.fill();
      } else {
        c.fillStyle = INK; c.font = '900 16px "Segoe UI",Arial,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(label, 0, 1);
      }
    },
  };
}

function enemy(shape, tones) {
  const outlines = {
    sweeper: [[-21,-9],[-10,-13],[0,-5],[10,-13],[21,-9],[15,10],[5,6],[0,18],[-5,6],[-15,10]],
    dart: [[0,21],[13,-13],[4,-7],[0,-19],[-4,-7],[-13,-13]],
    interceptor: [[0,20],[7,5],[24,-12],[14,-17],[0,-6],[-14,-17],[-24,-12],[-7,5]],
    bomber: [[-24,-11],[-13,-18],[13,-18],[24,-11],[24,14],[12,10],[0,19],[-12,10],[-24,14]],
  };
  return { w: 56, h: 52, draw(c) {
    const hull = k => { outlines[shape].forEach(([x,y],i)=>k[i?'lineTo':'moveTo'](x,y)); k.closePath(); };
    cel(c, hull, tones, [-24,-18,48,39], 3);
    cel(c, k=>k.ellipse(0,-2,6,8,0,0,TAU), ['#fff6e4','#ffd166','#e69f2e'], [-6,-10,12,16], 2);
    c.fillStyle = INK;
    if (shape === 'bomber') { c.fillRect(-17,8,6,13); c.fillRect(11,8,6,13); }
    else { c.fillRect(-3,10,6,8); }
  } };
}

function planet(r, tones, ring) {
  return {
    w: r * 3, h: r * 2.4,
    draw(c) {
      if (ring) { c.lineWidth = 6; c.strokeStyle = INK; c.beginPath(); c.ellipse(0, 0, r * 1.45, r * 0.4, -0.35, 0, TAU); c.stroke(); }
      cel(c, (k) => k.arc(0, 0, r, 0, TAU), tones, [-r, -r, r * 2, r * 2], 3);
      c.save(); c.beginPath(); c.arc(0, 0, r - 1.5, 0, TAU); c.clip(); c.rotate(-0.35);
      if (ring) {
        c.fillStyle = tones[2];
        c.fillRect(-r, -r * 0.55, r * 2, r * 0.16); c.fillRect(-r, -r * 0.05, r * 2, r * 0.26); c.fillRect(-r, r * 0.5, r * 2, r * 0.12);
        c.fillStyle = tones[0]; c.fillRect(-r, -r * 0.3, r * 2, r * 0.08);
      } else {
        c.fillStyle = tones[2];
        for (const [x, y, k] of [[-0.35, -0.3, 0.26], [0.3, 0.1, 0.2], [-0.1, 0.5, 0.15]]) { c.beginPath(); c.arc(x * r, y * r, k * r, 0, TAU); c.fill(); c.lineWidth = 1.5; c.strokeStyle = INK; c.stroke(); }
      }
      c.restore();
      if (ring) { c.lineWidth = 3; c.strokeStyle = tones[0]; c.beginPath(); c.ellipse(0, 0, r * 1.45, r * 0.4, -0.35, 0.15, Math.PI - 0.15); c.stroke(); }
    },
  };
}

const DEFS = {
  bee: {
    w: 56, h: 74,
    draw(c) {
      const wing = (sx) => cel(c, (k) => k.ellipse(sx * 16, -2, 12, 7, sx * -0.6, 0, TAU), ['#f4fdff', '#bfeaff', '#8cc6e8'], [sx * 16 - 12, -9, 24, 14], 2);
      wing(-1); wing(1);
      c.lineWidth = 2.5; c.strokeStyle = INK; c.fillStyle = '#ffd166';
      for (const sx of [-1, 1]) {
        c.beginPath(); c.moveTo(sx * 4, -21); c.quadraticCurveTo(sx * 8, -33, sx * 15, -31); c.stroke();
        c.beginPath(); c.arc(sx * 15, -31, 3.2, 0, TAU); c.fill(); c.stroke();
      }
      const body = (k) => k.ellipse(0, 8, 13, 17, 0, 0, TAU);
      cel(c, body, ['#fff0a8', '#ffd166', '#e69f2e'], [-13, -9, 26, 34], 2.5);
      c.save(); c.beginPath(); body(c); c.clip(); c.fillStyle = INK;
      c.fillRect(-14, 7, 28, 5); c.fillRect(-14, 16, 28, 5); c.restore();
      cel(c, (k) => k.arc(0, -10, 8, 0, TAU), ['#fff0a8', '#ffd166', '#e69f2e'], [-8, -18, 16, 16], 2);
      c.fillStyle = INK;
      c.beginPath(); c.ellipse(-3.6, -11, 2.2, 3.2, 0, 0, TAU); c.ellipse(3.6, -11, 2.2, 3.2, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.fillRect(-4.2, -12.6, 1.1, 1.1); c.fillRect(3, -12.6, 1.1, 1.1);
      c.lineWidth = 1.5; c.strokeStyle = INK; c.beginPath(); c.arc(0, -8, 2.6, 0.2, Math.PI - 0.2); c.stroke();
      c.globalAlpha = 0.28; c.fillStyle = '#9fdcff'; c.beginPath(); c.arc(0, -10, 13, 0, TAU); c.fill(); c.globalAlpha = 1;
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
  sweeper: enemy('sweeper', ['#b8caff','#6879e8','#3b3e8d']),
  dart: enemy('dart', ['#ffe2aa','#ff9a49','#bd4b35']),
  interceptor: enemy('interceptor', ['#c0fff2','#37c5ae','#23797d']),
  bomber: enemy('bomber', ['#dbffad','#83bc4e','#476335']),
  ast0: asteroid(12),
  ast1: asteroid(20),
  ast2: asteroid(30),
  bullet: {
    w: 16, h: 28,
    draw(c) {
      cel(c, (k) => { k.moveTo(0, -13); k.lineTo(4.5, 2); k.arc(0, 4, 5.5, -0.5, Math.PI + 0.5); k.closePath(); }, ['#d6fbff', '#4fe0ff', '#2a8fd6'], [-6, -13, 12, 24], 2.2);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 4, 2.6, 0, TAU); c.fill();
    },
  },
  boss: {
    w: 120, h: 92,
    draw(c) {
      cel(c, (k) => { k.moveTo(0, 42); k.lineTo(34, 18); k.lineTo(56, 28); k.lineTo(50, -12); k.lineTo(26, -36); k.lineTo(0, -28); k.lineTo(-26, -36); k.lineTo(-50, -12); k.lineTo(-56, 28); k.lineTo(-34, 18); k.closePath(); }, ['#d9b3ff', '#8a4fd6', '#4d2a8f'], [-56, -36, 112, 78], 3.5);
      for (const sx of [-1, 1]) cel(c, (k) => k.roundRect(sx * 38 - 7, 14, 14, 26, 4), ['#ffb0bd', '#e5486b', '#9c2a52'], [sx * 38 - 7, 14, 14, 26], 2.5);
      cel(c, (k) => k.arc(0, -4, 16, 0, TAU), ['#fff6e4', '#ffd166', '#e69f2e'], [-16, -20, 32, 32], 3);
      c.fillStyle = INK; c.beginPath(); c.ellipse(0, -4, 5, 9, 0, 0, TAU); c.fill();
      c.fillStyle = '#ff5fbf'; c.fillRect(-2, -9, 4, 4);
    },
  },
  ebullet: { w: 14, h: 14, draw(c) { cel(c, (k) => k.arc(0, 0, 5, 0, TAU), ['#ffd0ec', '#ff5fbf', '#a62f86'], [-5, -5, 10, 10], 2); } },
  'enemy-shot': { w: 16, h: 20, draw(c) { cel(c, k=>{k.moveTo(0,8);k.lineTo(5,-3);k.lineTo(0,-8);k.lineTo(-5,-3);k.closePath();}, ['#ffddd0','#ff7967','#b82f53'], [-5,-8,10,16], 2); } },
  bomb: { w: 18, h: 18, draw(c) { cel(c, k=>k.arc(0,0,6,0,TAU), ['#fff2ba','#ffba52','#be6638'], [-6,-6,12,12], 2);c.fillStyle=INK;c.fillRect(-2,-2,4,4); } },
  'item-0': badge('', ['#c6fbff','#35e7ff','#239db9'], 'atom'),
  'item-1': badge('G', ['#ddffbf','#8df58a','#42ae71']),
  'item-2': badge('TS', ['#f1d5ff','#c18aff','#8658c7']),
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
