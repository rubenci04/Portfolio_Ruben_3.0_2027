import { createSprites } from './sprites.js';

const H = 640, STEP = 1 / 60, TAU = Math.PI * 2;
const RADIUS = [12, 20, 30], POINTS = [50, 35, 20];
const FINGER_OFFSET = 60, SPEED = 330;
const ITEM_TEXT = ['¡React: disparo triple!', 'Godot: escudo', 'TypeScript: disparo rápido'];
const ITEM_COLORS = ['#35e7ff', '#8df58a', '#c18aff'];
const SHIPS = ['scout', 'sweeper', 'dart', 'interceptor', 'bomber'];
const rand = (a, b) => a + Math.random() * (b - a);
const mk = (n, extra) => Array.from({ length: n }, () => ({ on: false, ...extra }));
const take = (pool) => { for (let i = 0; i < pool.length; i++) if (!pool[i].on) { pool[i].on = true; return pool[i]; } return null; };
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createGame({ canvas, stage, root, reduced, audio, hooks }) {
  const c = canvas.getContext('2d', { alpha: false });
  let W = 360, bsx = 1, bsy = 1, spr = null, raf = 0, last = 0, acc = 0, dirty = true, padA = false, padStart = false;
  const diff = reduced ? 0.7 : 1, par = reduced ? 0.25 : 1;

  const pb = mk(48, { x: 0, y: 0, vx: 0, vy: 0 });
  const eb = mk(140, { x: 0, y: 0, vx: 0, vy: 0 });
  const ast = mk(40, { x: 0, y: 0, vx: 0, vy: 0, size: 0, rot: 0, vr: 0 });
  const sc = mk(12, { x: 0, y: 0, x0: 0, t: 0, hp: 0, kind: 0, fire: 0, dir: 1 });
  const it = mk(6, { x: 0, y: 0, type: 0 });
  const pt = mk(80, { x: 0, y: 0, vx: 0, vy: 0, life: 0, s: 3, col: '#fff' });
  const tx = mk(6, { x: 0, y: 0, t: 0, s: '' });
  const B = { on: false, x: 0, y: -80, hp: 0, max: 1, t: 0, a: 0, b: 0, lvl: 0 };
  const pools = [pb, eb, ast, sc, it, pt, tx];

  const stars = Array.from({ length: 84 }, (_, i) => ({ x: rand(0, 420), y: rand(0, H), l: i % 3 }));
  const STAR_V = [14, 38, 80], STAR_C = ['#5c6f95', '#a8b8d8', '#fff6e4'];
  const planets = [{ n: 'planet0', x: 90, y: 160, v: 5 }, { n: 'planet1', x: 290, y: 430, v: 8 }];

  const g = { state: 'menu', score: 0, lives: 3, wave: 0, combo: 0, comboT: 0, inv: 0, shield: 0, triple: 0, fast: 0, fireT: 0, spawnT: 0, waveDelay: 0, banner: 0, bannerText: '', left: { ast: 0, sc: 0 }, shake: 0, time: 0, say: 500 };
  const P = { x: 180, y: 520, tx: 180, ty: 520 };
  const keys = { l: 0, r: 0, u: 0, d: 0 };

  const mult = () => Math.min(1 + (g.combo >> 2), 5);
  const sp = () => Math.min(2.6, diff * (1 + 0.07 * (g.wave - 1)));
  const setState = (s) => { g.state = s; hooks.state(s); };

  function resize() {
    const r = stage.getBoundingClientRect();
    const sw = Math.max(200, r.width), sh = Math.max(300, r.height);
    W = clamp(Math.round((H * sw) / sh), 300, 420);
    const k = Math.min(sw / W, sh / H), cw = Math.floor(W * k), ch = Math.floor(H * k);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`;
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    bsx = canvas.width / W; bsy = canvas.height / H;
    spr = createSprites(bsx);
    P.x = clamp(P.x, 20, W - 20); P.tx = clamp(P.tx, 20, W - 20);
  }

  function reset() {
    pools.forEach((p) => p.forEach((o) => { o.on = false; })); B.on = false;
    Object.assign(g, { score: 0, lives: 3, wave: 0, combo: 0, comboT: 0, inv: 0, shield: 0, triple: 0, fast: 0, fireT: 0, waveDelay: 0, shake: 0, time: 0, say: 500 });
    P.x = P.tx = W / 2; P.y = P.ty = H - 130;
    dirty = true;
  }

  function startWave(n) {
    g.wave = n;
    g.left.ast = Math.min(4 + n * 2, 24);
    g.left.sc = Math.min(n + 1, 9);
    if (n % 5 === 0) {
      g.left.ast = 5; g.left.sc = 0;
      B.on = true; B.lvl = n / 5; B.max = B.hp = 28 + 16 * B.lvl; B.x = W / 2; B.y = -80; B.t = 0; B.a = 1.5; B.b = 3;
      g.bannerText = '¡Mini jefe!'; hooks.say('¡Mini jefe!');
    }
    g.spawnT = 1.2; g.banner = 2; if (n % 5) g.bannerText = `Oleada ${n}`;
    if (n > 1) { g.score += n * 50; dirty = true; hooks.say(`Oleada ${n}`); audio.play('wave'); }
  }

  function start() {
    reset(); startWave(1); setState('play'); last = 0;
  }

  const addScore = (p) => {
    g.combo++; g.comboT = 1.6; g.score += p * mult(); dirty = true;
    if (g.score >= g.say) { hooks.say(`Puntaje ${g.score}`); g.say = g.score - (g.score % 500) + 500; }
  };

  function boom(x, y, col, n) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const p = take(pt); if (!p) return;
      const a = rand(0, TAU), v = rand(40, 160);
      p.x = x; p.y = y; p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v; p.life = rand(0.3, 0.6); p.s = rand(2, 4.5); p.col = col;
    }
  }

  function text(x, y, s) {
    const t = take(tx); if (!t) return;
    t.x = clamp(x, 70, W - 70); t.y = y; t.t = 1.4; t.s = s;
  }

  function drop(x, y, chance) {
    if (Math.random() > chance) return;
    const i = take(it); if (!i) return;
    i.x = x; i.y = y; i.type = Math.floor(rand(0, 3));
  }

  function frag(a, dir) {
    const n = take(ast); if (!n) return;
    n.x = a.x; n.y = a.y; n.size = a.size - 1; n.rot = rand(0, TAU); n.vr = rand(-2, 2);
    n.vx = dir * rand(40, 90) * sp() + a.vx * 0.3; n.vy = a.vy * rand(0.8, 1.1);
  }

  function breakAst(a) {
    addScore(POINTS[a.size]);
    boom(a.x, a.y, '#c9b8a6', a.size ? 8 : 5);
    audio.play(a.size ? 'boom' : 'pop');
    if (a.size > 0) { frag(a, -1); frag(a, 1); } else drop(a.x, a.y, 0.1);
    a.on = false;
  }

  function hurtBoss() {
    if (--B.hp > 0) { if (B.hp % 3 === 0) audio.play('pop'); return; }
    B.on = false; addScore(1000 * B.lvl); audio.play('boom'); boom(B.x, B.y, '#8a4fd6', 30);
    for (let k = 0; k < 2; k++) drop(B.x + k * 30 - 15, B.y, 1);
    hooks.say('Mini jefe derrotado');
  }

  function bossFire(n, spread, speed, aim) {
    const base = aim ? Math.atan2(P.y - B.y, P.x - B.x) : Math.PI / 2;
    for (let k = 0; k < n; k++) {
      const a = base + (n === 1 ? 0 : (k / (n - 1) - 0.5) * spread);
      shoot(B.x, B.y + 30, Math.cos(a) * speed, Math.sin(a) * speed, eb);
    }
  }

  function updateBoss(dt) {
    B.t += dt;
    B.y += (110 - B.y) * Math.min(1, dt * 2);
    B.x = W / 2 + Math.sin(B.t * (0.7 + 0.08 * B.lvl)) * (W / 2 - 70);
    const k = 1 + 0.15 * B.lvl, hard = B.hp < B.max / 2 ? 1.3 : 1;
    if (B.t < 1.5) return;
    if ((B.a -= dt) <= 0) { B.a = 1.5 / (k * hard); bossFire(Math.min(3 + B.lvl, 9), 0.9, 200 + 12 * B.lvl, true); }
    if ((B.b -= dt) <= 0) { B.b = 3.4 / hard; bossFire(Math.min(10 + 2 * B.lvl, 22), TAU, 130 + 8 * B.lvl, false); }
    if (hit(P.x, P.y, 9, B.x, B.y, 38)) damage();
  }

  function hurtScout(s) {
    if (--s.hp > 0) { audio.play('pop'); return; }
    addScore(s.kind === 4 ? 180 : s.kind === 3 ? 150 : 100); boom(s.x, s.y, '#e5486b', 10); audio.play('boom'); drop(s.x, s.y, 0.4); s.on = false;
  }

  function damage() {
    if (g.inv > 0) return false;
    if (g.shield > 0) { g.shield = 0; g.inv = 0.8; audio.play('shield'); return true; }
    g.lives--; g.combo = 0; g.inv = 1.8; g.shake = reduced ? 0 : 0.3; dirty = true;
    boom(P.x, P.y, '#ffd166', 12); audio.play('hit');
    if (g.lives <= 0) { audio.play('over'); setState('over'); }
    return true;
  }

  function shoot(x, y, vx, vy, pool, kind = 0) {
    const b = take(pool); if (!b) return;
    b.x = x; b.y = y; b.vx = vx; b.vy = vy; b.kind = kind;
  }

  function spawnAst() {
    const a = take(ast); if (!a) return;
    const size = g.wave > 2 && Math.random() < 0.3 ? 1 : 2;
    a.size = size; a.x = rand(30, W - 30); a.y = -40; a.rot = rand(0, TAU); a.vr = rand(-1.5, 1.5);
    a.vx = rand(-30, 30); a.vy = rand(60, 110) * sp();
    g.left.ast--;
  }

  function spawnScout() {
    const s = take(sc); if (!s) return;
    s.kind = Math.floor(rand(0, SHIPS.length)); s.x = s.x0 = rand(50, W - 50); s.y = -30; s.t = 0;
    s.hp = (s.kind === 4 ? 4 : s.kind === 2 ? 1 : 2) + (g.wave >= 5 ? 1 : 0);
    s.fire = rand(1.2, 1.8); s.dir = Math.random() < 0.5 ? -1 : 1;
    g.left.sc--;
  }

  const hit = (ax, ay, ar, bx, by, br) => { const dx = ax - bx, dy = ay - by, r = ar + br; return dx * dx + dy * dy < r * r; };

  function pollPad() {
    const pads = navigator.getGamepads?.();
    if (!pads) return;
    let gp = null;
    for (let i = 0; i < pads.length; i++) if (pads[i]?.connected && pads[i].mapping === 'standard') { gp = pads[i]; break; }
    if (!gp) { padA = padStart = false; return; }
    const a = gp.buttons[0]?.pressed, s = gp.buttons[9]?.pressed;
    if (a && !padA) {
      if (g.state === 'play') { /* el disparo es automático */ } else if (g.state === 'paused') resume(); else start();
    }
    if (s && !padStart) { if (g.state === 'play') pause(); else if (g.state === 'paused') resume(); }
    padA = a; padStart = s;
    if (g.state !== 'play') return;
    let dx = gp.axes[0] || 0, dy = gp.axes[1] || 0;
    if (gp.buttons[14]?.pressed) dx = -1; else if (gp.buttons[15]?.pressed) dx = 1;
    if (gp.buttons[12]?.pressed) dy = -1; else if (gp.buttons[13]?.pressed) dy = 1;
    if (Math.hypot(dx, dy) > 0.2) { padDX = dx; padDY = dy; } else { padDX = padDY = 0; }
  }
  let padDX = 0, padDY = 0;

  function update(dt) {
    if (g.state === 'paused') return;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]; s.y += STAR_V[s.l] * par * dt;
      if (s.y > H) { s.y = -2; s.x = rand(0, 420); }
    }
    for (let i = 0; i < planets.length; i++) {
      const p = planets[i]; p.y += p.v * par * dt;
      if (p.y > H + 90) { p.y = -90; p.x = rand(60, Math.max(70, W - 60)); }
    }
    if (g.state !== 'play') return;
    g.time += dt;

    let dx = keys.r - keys.l + padDX, dy = keys.d - keys.u + padDY;
    if (dx || dy) {
      const len = Math.hypot(dx, dy); if (len > 1) { dx /= len; dy /= len; }
      P.x += dx * SPEED * dt; P.y += dy * SPEED * dt; P.tx = P.x; P.ty = P.y;
    } else {
      const k = Math.min(1, dt * 16), mx = SPEED * 2.6 * dt;
      P.x += clamp((P.tx - P.x) * k, -mx, mx); P.y += clamp((P.ty - P.y) * k, -mx, mx);
    }
    P.x = clamp(P.x, 20, W - 20); P.y = clamp(P.y, 60, H - 40);

    g.inv -= dt; g.shield -= dt; g.triple -= dt; g.fast -= dt; g.banner -= dt; g.shake -= dt;
    if (g.comboT > 0 && (g.comboT -= dt) <= 0 && g.combo) { g.combo = 0; dirty = true; }

    if ((g.fireT -= dt) <= 0) {
      g.fireT = g.fast > 0 ? 0.11 : 0.2;
      shoot(P.x, P.y - 24, 0, -580, pb);
      if (g.triple > 0) { shoot(P.x - 10, P.y - 16, -90, -560, pb); shoot(P.x + 10, P.y - 16, 90, -560, pb); }
      audio.play('shoot');
    }

    if (g.left.ast + g.left.sc > 0) {
      if ((g.spawnT -= dt) <= 0) {
        g.spawnT = Math.max(0.45, (1.3 - 0.06 * g.wave) / diff);
        if (g.left.sc > 0 && (g.left.ast === 0 || Math.random() < 0.35)) spawnScout(); else spawnAst();
      }
    } else if (g.waveDelay > 0) {
      if ((g.waveDelay -= dt) <= 0) startWave(g.wave + 1);
    } else {
      let alive = B.on;
      for (let i = 0; i < ast.length; i++) if (ast[i].on) alive = true;
      for (let i = 0; i < sc.length; i++) if (sc[i].on) alive = true;
      if (!alive) g.waveDelay = 1.5;
    }

    for (let i = 0; i < pb.length; i++) {
      const b = pb[i]; if (!b.on) continue;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y < -20 || b.x < -10 || b.x > W + 10) { b.on = false; continue; }
      for (let j = 0; j < ast.length && b.on; j++) {
        const a = ast[j];
        if (a.on && hit(b.x, b.y, 4, a.x, a.y, RADIUS[a.size] * 0.9)) { b.on = false; breakAst(a); }
      }
      if (B.on && b.on && hit(b.x, b.y, 4, B.x, B.y, 40)) { b.on = false; hurtBoss(); }
      for (let j = 0; j < sc.length && b.on; j++) {
        const s = sc[j];
        if (s.on && hit(b.x, b.y, 4, s.x, s.y, s.kind === 4 ? 21 : 15)) { b.on = false; hurtScout(s); }
      }
    }

    for (let i = 0; i < ast.length; i++) {
      const a = ast[i]; if (!a.on) continue;
      a.x += a.vx * dt; a.y += a.vy * dt; a.rot += a.vr * dt;
      const r = RADIUS[a.size];
      if (a.y > H + r + 10 || a.x < -r - 40 || a.x > W + r + 40) { a.on = false; continue; }
      if (hit(P.x, P.y, 9, a.x, a.y, r * 0.8)) { if (damage()) breakAst(a); }
    }

    for (let i = 0; i < sc.length; i++) {
      const s = sc[i]; if (!s.on) continue;
      s.t += dt;
      if (s.kind === 0) { s.y += 70 * sp() * dt; s.x = s.x0 + Math.sin(s.t * 2) * 60; }
      else if (s.kind === 1) {
        if (s.y < 90) s.y += 90 * dt; else s.x += s.dir * 110 * dt;
        if (s.x < 30 || s.x > W - 30) s.dir = -s.dir;
        if (s.t > 7) s.y += 120 * dt;
      } else if (s.kind === 2) { s.y += 115 * sp() * dt; s.x = s.x0 + Math.sin(s.t * 3) * 25; }
      else if (s.kind === 3) { s.y += 82 * sp() * dt; s.x = s.x0 + s.dir * Math.sin(s.t * 1.8) * 70; }
      else { s.y += 44 * sp() * dt; s.x = s.x0 + Math.sin(s.t * 1.2) * 35; }
      s.x = clamp(s.x, 27, W - 27);
      if (s.y > H + 30) { s.on = false; continue; }
      if ((s.fire -= dt) <= 0 && s.y > 10 && s.y < H - 200) {
        s.fire = rand(2, 2.8) / Math.min(sp(), 1.6);
        if (s.kind === 3) {
          // Aim once at firing time: the shot never follows the player afterwards.
          const angle = Math.atan2(Math.max(80, P.y - s.y), P.x - s.x);
          shoot(s.x, s.y + 18, Math.cos(angle) * 175, Math.sin(angle) * 175, eb, 1);
        } else if (s.kind === 4 || (g.wave >= 4 && s.kind === 1)) {
          for (const vx of [-65, 0, 65]) shoot(s.x, s.y + 20, vx, 145, eb, 2);
        } else shoot(s.x, s.y + 16, 0, 175, eb, 1);
      }
      if (hit(P.x, P.y, 9, s.x, s.y, s.kind === 4 ? 21 : 13)) { if (damage()) hurtScout(s); }
    }

    if (B.on) updateBoss(dt);
    for (let i = 0; i < eb.length; i++) {
      const b = eb[i]; if (!b.on) continue;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.y > H + 10 || b.y < -20 || b.x < -10 || b.x > W + 10) { b.on = false; continue; }
      if (hit(P.x, P.y, 7, b.x, b.y, 5)) { b.on = false; damage(); }
    }

    for (let i = 0; i < it.length; i++) {
      const o = it[i]; if (!o.on) continue;
      o.y += 75 * dt;
      if (o.y > H + 20) { o.on = false; continue; }
      if (hit(P.x, P.y, 14, o.x, o.y, 16)) {
        o.on = false; audio.play('item');
        if (o.type === 0) g.triple = 8; else if (o.type === 1) g.shield = 10; else g.fast = 8;
        text(o.x, o.y - 20, ITEM_TEXT[o.type]); hooks.say(ITEM_TEXT[o.type]);
        boom(P.x, P.y, ITEM_COLORS[o.type], 14);
      }
    }

    for (let i = 0; i < pt.length; i++) {
      const p = pt[i]; if (!p.on) continue;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if ((p.life -= dt) <= 0) p.on = false;
    }
    for (let i = 0; i < tx.length; i++) {
      const t = tx[i]; if (!t.on) continue;
      t.y -= 22 * dt;
      if ((t.t -= dt) <= 0) t.on = false;
    }
    if (dirty) { dirty = false; hooks.hud(g.score, g.lives, mult()); }
  }

  function outlined(s, x, y, size) {
    c.font = `800 ${size}px "Segoe UI",Arial,sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 4; c.strokeStyle = '#050b17'; c.lineJoin = 'round'; c.strokeText(s, x, y);
    c.fillStyle = '#fff6e4'; c.fillText(s, x, y);
  }

  function draw() {
    c.setTransform(bsx, 0, 0, bsy, 0, 0);
    c.fillStyle = '#0a1124'; c.fillRect(0, 0, W, H);
    if (g.shake > 0 && !reduced) c.translate(rand(-3, 3), rand(-3, 3));
    c.globalAlpha = 0.9;
    for (let i = 0; i < planets.length; i++) spr.draw(c, planets[i].n, planets[i].x, planets[i].y, 0, 0.85);
    c.globalAlpha = 1;
    for (let l = 0; l < 3; l++) {
      c.fillStyle = STAR_C[l];
      for (let i = l; i < stars.length; i += 3) { const s = stars[i]; c.fillRect(s.x, s.y, l + 1, l + 1); }
    }
    if (g.state === 'menu') { spr.draw(c, 'bee', W / 2, H * 0.55 + Math.sin(performance.now() / 500) * (reduced ? 0 : 6)); return; }

    for (let i = 0; i < ast.length; i++) { const a = ast[i]; if (a.on) spr.draw(c, `ast${a.size}`, a.x, a.y, a.rot); }
    for (let i = 0; i < sc.length; i++) {
      const s = sc[i]; if (!s.on) continue;
      spr.draw(c, SHIPS[s.kind], s.x, s.y);
      if (s.fire < .4 && s.y > 10 && s.y < H - 200) {
        c.lineWidth = 2; c.strokeStyle = '#ffac73'; c.beginPath(); c.arc(s.x, s.y + 19, 7, 0, TAU); c.stroke();
      }
    }
    if (B.on) {
      spr.draw(c, 'boss', B.x, B.y);
      c.fillStyle = '#050b17'; c.fillRect(W / 2 - 62, 66, 124, 10);
      c.fillStyle = '#ff5fbf'; c.fillRect(W / 2 - 60, 68, 120 * (B.hp / B.max), 6);
    }
    for (let i = 0; i < it.length; i++) {
      const o = it[i]; if (!o.on) continue;
      c.strokeStyle = ITEM_COLORS[o.type]; c.lineWidth = 2;
      c.beginPath(); c.arc(o.x, o.y, reduced ? 23 : 23 + Math.sin(g.time * 4) * 2, 0, TAU); c.stroke();
      spr.draw(c, `item-${o.type}`, o.x, o.y);
    }
    for (let i = 0; i < pb.length; i++) { const b = pb[i]; if (b.on) spr.draw(c, 'bullet', b.x, b.y, b.vx * 0.0008); }
    for (let i = 0; i < eb.length; i++) { const b = eb[i]; if (b.on) spr.draw(c, b.kind === 2 ? 'bomb' : b.kind === 1 ? 'enemy-shot' : 'ebullet', b.x, b.y); }
    for (let i = 0; i < pt.length; i++) { const p = pt[i]; if (p.on) { c.fillStyle = p.col; c.fillRect(p.x, p.y, p.s, p.s); } }

    if (g.state !== 'over') {
      const blink = g.inv > 0 && !reduced && Math.floor(g.inv * 12) % 2 === 0;
      if (!blink) {
        const f = reduced ? 12 : 12 + Math.sin(g.time * 50) * 4;
        c.fillStyle = '#ff9d3c'; c.beginPath(); c.moveTo(P.x - 6, P.y + 24); c.lineTo(P.x + 6, P.y + 24); c.lineTo(P.x, P.y + 24 + f); c.closePath(); c.fill();
        c.lineWidth = 2.5; c.strokeStyle = '#050b17'; c.stroke();
        spr.draw(c, 'bee', P.x, P.y, 0, g.inv > 0 && reduced ? 0.55 : 1);
      }
      if (g.shield > 0) {
        c.lineWidth = 6; c.strokeStyle = '#050b17'; c.beginPath(); c.arc(P.x, P.y, 34, 0, TAU); c.stroke();
        c.lineWidth = 3; c.strokeStyle = !reduced && g.shield < 2 && Math.floor(g.shield * 6) % 2 ? '#fff6e4' : ITEM_COLORS[1]; c.stroke();
      }
    }
    for (let i = 0; i < tx.length; i++) { const t = tx[i]; if (t.on) outlined(t.s, t.x, t.y, 15); }
    if (g.banner > 0 && g.state === 'play') outlined(g.bannerText, W / 2, H * 0.3, 28);
    const effects = [[g.triple, 'TRIPLE', ITEM_COLORS[0]], [g.shield, 'ESCUDO', ITEM_COLORS[1]], [g.fast, 'RÁPIDO', ITEM_COLORS[2]]];
    let slot = 0;
    for (const [remaining, label, color] of effects) {
      if (remaining <= 0) continue;
      const x = 8 + slot++ * 96;
      c.fillStyle = '#050b17'; c.fillRect(x, H - 29, 91, 23);
      c.fillStyle = color; c.fillRect(x + 2, H - 27, 87, 19);
      c.fillStyle = '#050b17'; c.font = '800 10px "Segoe UI",Arial,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(`${label} ${Math.ceil(remaining)}s`, x + 45, H - 17);
    }
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (!last) last = t;
    acc += Math.min(t - last, 100) / 1000; last = t;
    pollPad();
    while (acc >= STEP) { update(STEP); acc -= STEP; }
    draw();
  }

  function pause() { if (g.state === 'play') { setState('paused'); keys.l = keys.r = keys.u = keys.d = 0; } }
  function resume() { if (g.state === 'paused') { last = 0; acc = 0; setState('play'); } }

  const toGame = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const onPointer = (e) => {
    if (g.state !== 'play') return;
    if (e.type === 'pointermove' && e.pointerType !== 'mouse' && !e.buttons) return;
    const p = toGame(e), off = e.pointerType === 'mouse' ? 0 : FINGER_OFFSET;
    P.tx = clamp(p.x, 20, W - 20); P.ty = clamp(p.y - off, 60, H - 40);
    padDX = padDY = 0;
  };
  const onDown = (e) => { canvas.setPointerCapture?.(e.pointerId); onPointer(e); };
  const KEYMAP = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 'd', S: 'd' };
  const onKey = (e) => {
    const k = KEYMAP[e.key];
    if (k && g.state === 'play') { keys[k] = e.type === 'keydown' ? 1 : 0; e.preventDefault(); }
    else if (e.type === 'keydown' && (e.key === 'p' || e.key === 'P')) { if (g.state === 'play') pause(); else resume(); }
  };
  const onHide = () => { if (document.hidden) pause(); };
  const onBlur = () => pause();

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onPointer);
  root.addEventListener('keydown', onKey);
  root.addEventListener('keyup', onKey);
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('blur', onBlur);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    start, pause, resume,
    get state() { return g.state; },
    get score() { return g.score; },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onPointer);
      root.removeEventListener('keydown', onKey);
      root.removeEventListener('keyup', onKey);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
    },
  };
}
