// Music + three tiny Web Audio sounds (tick, whoosh, tock). Everything very quiet.
import { asset } from '@/lib/assets';

let ctx = null, master = null, noise = null;
let muted = false, audio = null, started = false, ducked = false, fadeTimer = null;
const MUSIC_VOL = 0.32;

export function initSound() {
  if (typeof window === 'undefined') return;
  try { muted = localStorage.getItem('b3_muted') === '1'; } catch (e) {}
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
}

export const isMuted = () => muted;
export const isStarted = () => started;
export function loadPrefs() {
  try { muted = localStorage.getItem('b3_muted') === '1'; } catch (e) {}
}
const emit = () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('b3-music')); };

function getAudio() {
  if (!audio) {
    audio = new Audio(asset('/music/if-you-go.mp3'));
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
  }
  return audio;
}

function fadeTo(v, ms = 1600, then) {
  const a = getAudio();
  clearInterval(fadeTimer);
  const from = a.volume, t0 = performance.now();
  fadeTimer = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    a.volume = Math.max(0, Math.min(1, from + (v - from) * k));
    if (k >= 1) { clearInterval(fadeTimer); if (then) then(); }
  }, 40);
}

const target = () => (muted || ducked ? 0 : MUSIC_VOL);

export async function startMusic() {
  if (typeof window === 'undefined') return false;
  try { muted = localStorage.getItem('b3_muted') === '1'; } catch (e) {}
  const a = getAudio();
  try {
    await a.play();
    started = true;
    fadeTo(target(), 2200);
    emit();
    return true;
  } catch (e) {
    return false;
  }
}

export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('b3_muted', m ? '1' : '0'); } catch (e) {}
  emit();
  if (!started) return;
  const a = getAudio();
  if (m) fadeTo(0, 500, () => a.pause());
  else if (!ducked) { a.play().catch(() => {}); fadeTo(MUSIC_VOL, 900); }
}

// Pause the site music while a project video plays.
export function duckForVideo(on) {
  ducked = on;
  if (!started) return;
  const a = getAudio();
  if (on) fadeTo(0, 500, () => a.pause());
  else if (!muted) { a.play().catch(() => {}); fadeTo(MUSIC_VOL, 1200); }
}

const ok = () => ctx && ctx.state === 'running' && !muted;

function env(g, t, a, d, peak) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

export function tick() {
  if (!ok()) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(2600, t);
  o.frequency.exponentialRampToValueAtTime(1700, t + 0.04);
  env(g, t, 0.003, 0.05, 0.03);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 0.09);
}

export function tock() {
  if (!ok()) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(230, t);
  o.frequency.exponentialRampToValueAtTime(85, t + 0.09);
  env(g, t, 0.004, 0.12, 0.07);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 0.18);
}

export function whoosh() {
  if (!ok()) return;
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noise;
  f.type = 'bandpass';
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(260, t);
  f.frequency.exponentialRampToValueAtTime(2400, t + 0.3);
  f.frequency.exponentialRampToValueAtTime(420, t + 0.7);
  env(g, t, 0.25, 0.45, 0.05);
  s.connect(f).connect(g).connect(master);
  s.start(t); s.stop(t + 0.8);
}

export function boom() {
  if (!ok()) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(90, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.5);
  env(g, t, 0.01, 0.7, 0.11);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 0.85);
}
