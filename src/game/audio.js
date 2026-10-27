// Sonido sintetizado con WebAudio. Cero archivos; silenciado hasta que se active.
export function createAudio() {
  let ac = null, out = null, noiseBuf = null, on = false, shots = 0;

  const init = () => {
    if (ac) return true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      ac = new Ctx();
      out = ac.createGain(); out.gain.value = 0.18; out.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.4), ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch { ac = null; return false; }
  };

  const tone = (type, f0, f1, dur, vol = 0.5, delay = 0) => {
    const t = ac.currentTime + delay;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02);
  };
  const noise = (dur, vol, cutoff) => {
    const t = ac.currentTime;
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = 'lowpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + dur);
  };

  const sounds = {
    shoot: () => { if (shots++ % 3 === 0) tone('square', 900, 400, 0.05, 0.12); },
    pop: () => noise(0.12, 0.5, 2400),
    boom: () => noise(0.3, 0.8, 900),
    hit: () => { tone('sawtooth', 300, 60, 0.3, 0.6); noise(0.25, 0.6, 700); },
    item: () => { tone('triangle', 520, 520, 0.08, 0.5); tone('triangle', 780, 780, 0.08, 0.5, 0.08); tone('triangle', 1040, 1040, 0.12, 0.5, 0.16); },
    shield: () => tone('sine', 200, 900, 0.2, 0.6),
    wave: () => { tone('square', 440, 440, 0.1, 0.25); tone('square', 660, 660, 0.14, 0.25, 0.1); },
    over: () => { tone('sawtooth', 400, 80, 0.8, 0.5); },
  };

  return {
    get on() { return on; },
    toggle() {
      if (!on && !init()) return false;
      on = !on;
      if (on && ac.state === 'suspended') ac.resume();
      return on;
    },
    play(name) { if (on && ac) sounds[name]?.(); },
    close() { on = false; ac?.close?.(); ac = null; },
  };
}
