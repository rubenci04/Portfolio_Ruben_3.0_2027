import { createGame } from './engine.js';
import { createAudio } from './audio.js';

const BEST_KEY = 'bee-space-best';
const CSS = `
.sg{padding:0;margin:auto;max-width:none;max-height:none;width:min(calc(92vh*9/16),100vw);width:min(calc(92dvh*9/16),100vw);height:92vh;height:92dvh;border:4px solid #050b17;background:#0a1124;color:#fff6e4;font:600 15px/1.35 "Segoe UI",Arial,sans-serif;overflow:hidden;box-shadow:8px 8px 0 #050b17}
.sg[open]{display:flex;flex-direction:column}
.sg::backdrop{background:rgba(5,11,23,.85)}
@media(max-width:640px){.sg{width:100vw;height:100vh;height:100dvh;border:0;box-shadow:none}}
.sg *{box-sizing:border-box}
.sg-bar{display:flex;align-items:center;gap:8px;padding:6px 8px;background:#101b30;border-bottom:3px solid #050b17}
.sg-stats{flex:1;display:flex;gap:12px;align-items:center;font:700 15px "Space Mono",Consolas,monospace;white-space:nowrap}
.sg-lives{color:#ff8fa3;letter-spacing:2px}
.sg-combo{color:#ffd166}
.sg-btn{min-height:44px;min-width:44px;padding:6px 12px;border:3px solid #050b17;border-radius:8px;background:#1b2c46;color:#fff6e4;font:800 14px "Segoe UI",Arial,sans-serif;box-shadow:3px 3px 0 #050b17;cursor:pointer}
.sg-btn.sg-primary{background:#ffd166;color:#050b17}
.sg-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #050b17}
.sg button:focus-visible{outline:3px solid #fff;outline-offset:3px}
.sg-stage{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0a1124}
.sg-stage canvas{display:block;touch-action:none;cursor:crosshair}
.sg-over{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center;background:rgba(5,11,23,.8)}
.sg-over[hidden]{display:none}
.sg-over h2{margin:0;font-size:30px;line-height:1.1}
.sg-over p{margin:0;max-width:280px}
.sg-over .sg-btn{width:min(260px,100%)}
.sg-score-big{font:800 44px "Space Mono",Consolas,monospace;color:#ffd166}
.sg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
`;

function injectStyle() {
  if (document.getElementById('sg-style')) return;
  const s = document.createElement('style');
  s.id = 'sg-style'; s.textContent = CSS;
  document.head.append(s);
}

const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };
const writeBest = (n) => { try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* sin almacenamiento */ } };

let opened = false;

export function openGame(trigger) {
  if (opened) return;
  opened = true;
  injectStyle();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audio = createAudio();
  const dialog = document.createElement('dialog');
  dialog.className = 'sg';
  dialog.setAttribute('aria-label', 'Minijuego espacial de Bee');
  dialog.innerHTML = `
    <div class="sg-bar">
      <div class="sg-stats"><span class="sg-score" aria-hidden="true">0</span><span class="sg-lives" role="img" aria-label="3 vidas">♥♥♥</span><span class="sg-combo" aria-hidden="true"></span></div>
      <button type="button" class="sg-btn sg-sound" aria-pressed="false" aria-label="Activar sonido">Sonido: no</button>
      <button type="button" class="sg-btn sg-close" aria-label="Cerrar minijuego">✕</button>
    </div>
    <div class="sg-stage">
      <canvas role="img" aria-label="Zona de juego: Bee astronauta esquiva asteroides y naves"></canvas>
      <div class="sg-over"></div>
    </div>
    <p class="sg-sr" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);

  const $ = (q) => dialog.querySelector(q);
  const overlay = $('.sg-over'), live = $('.sg-sr'), score = $('.sg-score'), lives = $('.sg-lives'), combo = $('.sg-combo'), soundBtn = $('.sg-sound');
  let best = readBest(), game = null, shareMsg = '';

  const showOverlay = (html, focusSel) => {
    overlay.innerHTML = html; overlay.hidden = false;
    overlay.querySelector(focusSel)?.focus();
  };
  const menuHtml = `<h2>Bee en el espacio</h2><p>Arrastrá o usá las flechas para moverte. El disparo es automático.</p><p>Récord: <strong>${best}</strong></p><button type="button" class="sg-btn sg-primary" data-a="play">Jugar</button>`;
  const overHtml = () => `<h2>Game over</h2><div class="sg-score-big">${game.score}</div><p>${game.score >= best && game.score > 0 ? '¡Nuevo récord!' : `Récord: ${best}`}</p><button type="button" class="sg-btn sg-primary" data-a="play">Jugar de nuevo</button><button type="button" class="sg-btn" data-a="share">Compartir</button><button type="button" class="sg-btn" data-a="projects">Ver proyectos</button><p class="sg-share" role="status"></p>`;

  const hooks = {
    hud(s, l, m) {
      score.textContent = s;
      lives.textContent = '♥'.repeat(Math.max(l, 0)) || '–';
      lives.setAttribute('aria-label', `${l} ${l === 1 ? 'vida' : 'vidas'}`);
      combo.textContent = m > 1 ? `x${m}` : '';
    },
    say(t) { live.textContent = t; },
    state(s) {
      if (s === 'play') overlay.hidden = true;
      else if (s === 'paused') showOverlay('<h2>Pausa</h2><button type="button" class="sg-btn sg-primary" data-a="resume">Continuar</button>', '[data-a]');
      else if (s === 'over') {
        if (game.score > best) { best = game.score; writeBest(best); }
        live.textContent = `Game over. Puntaje final ${game.score}.`;
        showOverlay(overHtml(), '[data-a="play"]');
      }
    },
  };

  const close = () => {
    if (!opened) return;
    opened = false;
    game?.pause(); game?.destroy(); audio.close();
    if (dialog.open) dialog.close();
    dialog.remove();
    trigger?.focus?.();
  };

  async function share() {
    const text = `Hice ${game.score} puntos en el minijuego espacial de Rubén Albarracín 🐝🚀 ¿Me superás?`;
    const url = location.origin + location.pathname;
    const out = overlay.querySelector('.sg-share');
    try {
      if (navigator.share) { await navigator.share({ title: 'Bee en el espacio', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      shareMsg = 'Texto y enlace copiados.';
    } catch (e) {
      if (e?.name === 'AbortError') return;
      shareMsg = 'No se pudo compartir. Copiá el enlace: ' + url;
    }
    if (out) out.textContent = shareMsg;
  }

  overlay.addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a === 'play') game.start();
    else if (a === 'resume') game.resume();
    else if (a === 'share') share();
    else if (a === 'projects') {
      close();
      document.getElementById('projects')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  });
  $('.sg-close').addEventListener('click', close);
  soundBtn.addEventListener('click', () => {
    const on = audio.toggle();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Silenciar sonido' : 'Activar sonido');
    soundBtn.textContent = on ? 'Sonido: sí' : 'Sonido: no';
  });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); game?.pause(); close(); });
  dialog.addEventListener('close', close);

  dialog.showModal();
  game = createGame({ canvas: $('canvas'), stage: $('.sg-stage'), root: dialog, reduced, audio, hooks });
  showOverlay(menuHtml, '[data-a="play"]');
}
