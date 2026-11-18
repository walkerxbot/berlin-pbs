// Designed covers: one original 16:9 poster per project, drawn in code in the site's palette (black, dark red, white).
// Poster style: big title + tagline from lib/projects.js, a faint motif behind. No video frames on the cover.
const TW = 640, TH = 360, RED = '#e0122f', DEEP = '#7a0a1a';

function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const pad2 = (n) => String(n).padStart(2, '0');

const MOTIFS = [
  // 01 timeline: stacked clips sliding along tracks, red playhead
  (x, t, r) => {
    for (let k = 0; k < 6; k++) {
      let px = -((t * (14 + k * 6)) % 220);
      while (px < TW) {
        const w = 60 + r() * 150; x.fillStyle = k % 3 === 1 ? 'rgba(224,18,47,.55)' : `rgba(242,242,242,${0.06 + r() * 0.1})`;
        x.fillRect(px, 44 + k * 34, w, 24); px += w + 8 + r() * 14;
      }
      r = rng(11 + k);
    }
    const ph = 250 + Math.sin(t * 0.6) * 70;
    x.fillStyle = RED; x.fillRect(ph, 24, 2, 250); x.beginPath(); x.moveTo(ph - 7, 24); x.lineTo(ph + 9, 24); x.lineTo(ph + 1, 36); x.fill();
  },
  // 02 waveform: mirrored audio bars
  (x, t) => {
    const n = 64, bw = TW / n;
    for (let i = 0; i < n; i++) {
      const a = (Math.sin(i * 0.37 + t * 2.1) + Math.sin(i * 0.11 - t * 1.3) * 1.2 + Math.sin(i * 0.9 + t * 3)) / 3.2;
      const h = 18 + Math.abs(a) * 120;
      x.fillStyle = i % 9 === 0 ? RED : 'rgba(242,242,242,.5)';
      x.fillRect(i * bw + 1, 130 - h / 2, bw - 3, h);
      x.fillStyle = 'rgba(224,18,47,.25)'; x.fillRect(i * bw + 1, 130 + h / 2 + 4, bw - 3, h * 0.35);
    }
  },
  // 03 curves: keyframe graph with bezier handles
  (x, t) => {
    x.strokeStyle = 'rgba(242,242,242,.07)'; x.lineWidth = 1;
    for (let i = 1; i < 12; i++) { x.beginPath(); x.moveTo(i * 54, 30); x.lineTo(i * 54, 280); x.stroke(); }
    for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(0, 30 + i * 42); x.lineTo(TW, 30 + i * 42); x.stroke(); }
    const pts = [[30, 250], [170, 110 + Math.sin(t) * 14], [330, 220], [470, 70 + Math.cos(t * 0.8) * 12], [610, 160]];
    x.strokeStyle = RED; x.lineWidth = 3; x.shadowColor = RED; x.shadowBlur = 12; x.beginPath(); x.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, d] = pts[i], m = (a + c) / 2; x.bezierCurveTo(m, b, m, d, c, d); }
    x.stroke(); x.shadowBlur = 0;
    pts.forEach(([a, b], i) => { x.fillStyle = '#fff'; x.save(); x.translate(a, b); x.rotate(0.785); x.fillRect(-5, -5, 10, 10); x.restore();
      if (i && i < pts.length - 1) { x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(a - 36, b); x.lineTo(a + 36, b); x.stroke(); } });
  },
  // 04 film: scrolling film strip with sprocket holes and frames
  (x, t) => {
    const off = (t * 40) % 150;
    x.save(); x.translate(0, 0); x.rotate(-0.12); x.translate(-40, 40);
    for (let k = 0; k < 2; k++) {
      const y = k * 130; x.fillStyle = 'rgba(242,242,242,.07)'; x.fillRect(0, y, TW + 160, 108);
      for (let i = -1; i < 7; i++) {
        const fx = i * 150 - off + 10; x.fillStyle = (i + k) % 3 === 0 ? 'rgba(224,18,47,.5)' : 'rgba(5,5,5,.7)'; x.fillRect(fx, y + 16, 130, 76);
        x.strokeStyle = 'rgba(242,242,242,.3)'; x.strokeRect(fx, y + 16, 130, 76);
        for (let h = 0; h < 6; h++) { x.fillStyle = 'rgba(5,5,5,.9)'; x.fillRect(fx + h * 24 + 4, y + 3, 10, 8); x.fillRect(fx + h * 24 + 4, y + 97, 10, 8); }
      }
    }
    x.restore();
  },
  // 05 viewfinder: focus brackets, grid, crosshair
  (x, t) => {
    x.strokeStyle = 'rgba(242,242,242,.12)'; x.lineWidth = 1;
    for (let i = 1; i < 3; i++) { x.beginPath(); x.moveTo(i * TW / 3, 0); x.lineTo(i * TW / 3, TH); x.moveTo(0, i * TH / 3); x.lineTo(TW, i * TH / 3); x.stroke(); }
    const s = 70 + Math.sin(t * 1.6) * 8, cx = TW / 2, cy = 150;
    x.strokeStyle = RED; x.lineWidth = 3; x.shadowColor = RED; x.shadowBlur = 10;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { x.beginPath(); x.moveTo(cx + a * s, cy + b * (s - 28)); x.lineTo(cx + a * s, cy + b * s); x.lineTo(cx + a * (s - 28), cy + b * s); x.stroke(); });
    x.shadowBlur = 0; x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx - 12, cy); x.lineTo(cx + 12, cy); x.moveTo(cx, cy - 12); x.lineTo(cx, cy + 12); x.stroke();
  },
  // 06 rings: radial timecode dial
  (x, t) => {
    const cx = TW * 0.62, cy = 150;
    for (let k = 0; k < 4; k++) {
      const rr = 40 + k * 32; x.strokeStyle = k === 2 ? RED : 'rgba(242,242,242,.22)'; x.lineWidth = k === 2 ? 3 : 1.2;
      x.setLineDash(k % 2 ? [3, 7] : []); x.beginPath(); x.arc(cx, cy, rr, t * (k % 2 ? -0.5 : 0.35) + k, t * (k % 2 ? -0.5 : 0.35) + k + 4.4 + k * 0.3); x.stroke();
    }
    x.setLineDash([]);
    for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; x.strokeStyle = 'rgba(242,242,242,.35)'; x.lineWidth = i % 5 ? 1 : 2; x.beginPath(); x.moveTo(cx + Math.cos(a) * 158, cy + Math.sin(a) * 158); x.lineTo(cx + Math.cos(a) * (i % 5 ? 164 : 170), cy + Math.sin(a) * (i % 5 ? 164 : 170)); x.stroke(); }
    const a = t * 1.2; x.strokeStyle = RED; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * 150, cy + Math.sin(a) * 150); x.stroke();
  },
];

export function createCovers(list, { tier = 'mid', fontTitle = 'Impact, sans-serif', fontMono = 'monospace' } = {}) {
  const items = list.map((p, i) => {
    const c = document.createElement('canvas'); c.width = TW; c.height = TH;
    return { p, i, canvas: c, ctx: c.getContext('2d'), n: 0 };
  });
  const FPS = tier === 'low' ? 12 : tier === 'mid' ? 30 : 60;
  let lastDraw = -1e9;

  function paint(it, now) {
    const x = it.ctx, t = now / 1000 + it.i * 3;
    const bg = x.createLinearGradient(0, 0, TW, TH); bg.addColorStop(0, '#120406'); bg.addColorStop(0.55, '#0a0a0a'); bg.addColorStop(1, '#1b0509');
    x.fillStyle = bg; x.fillRect(0, 0, TW, TH);
    const glow = x.createRadialGradient(TW * 0.75, TH * 0.3, 0, TW * 0.75, TH * 0.3, 280);
    glow.addColorStop(0, 'rgba(179,0,27,.38)'); glow.addColorStop(1, 'rgba(179,0,27,0)'); x.fillStyle = glow; x.fillRect(0, 0, TW, TH);
    x.save(); x.globalAlpha = 0.34; MOTIFS[it.i % MOTIFS.length](x, t, rng(it.i + 5)); x.restore();
    // darken the left so the words read first
    const sh = x.createLinearGradient(0, 0, TW, 0); sh.addColorStop(0, 'rgba(5,5,5,.88)'); sh.addColorStop(0.62, 'rgba(5,5,5,.45)'); sh.addColorStop(1, 'rgba(5,5,5,0)'); x.fillStyle = sh; x.fillRect(0, 0, TW, TH);
    const g1 = x.createLinearGradient(0, TH, 0, TH * 0.6); g1.addColorStop(0, 'rgba(5,5,5,.9)'); g1.addColorStop(1, 'rgba(5,5,5,0)'); x.fillStyle = g1; x.fillRect(0, TH * 0.6, TW, TH * 0.4);
    // frame corners
    x.strokeStyle = 'rgba(242,242,242,.55)'; x.lineWidth = 1.5; const m = 14, L = 20;
    [[m, m, 1, 1], [TW - m, m, -1, 1], [m, TH - m, 1, -1], [TW - m, TH - m, -1, -1]].forEach(([px, py, sx, sy]) => { x.beginPath(); x.moveTo(px + sx * L, py); x.lineTo(px, py); x.lineTo(px, py + sy * L); x.stroke(); });
    // top row
    const blink = Math.floor(now / 500) % 2 === 0;
    x.fillStyle = blink ? RED : 'rgba(224,18,47,.25)'; x.beginPath(); x.arc(34, 34, 5, 0, 6.283); x.fill();
    x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillStyle = '#f2f2f2'; x.font = `600 13px ${fontMono}`; x.fillText('A B3RL1N EDIT', 46, 35);
    x.textAlign = 'right'; x.font = `500 13px ${fontMono}`; x.fillStyle = 'rgba(242,242,242,.85)'; x.fillText(`FILM ${it.p.id}  \u00B7  ${it.p.dur}`, TW - 32, 35);
    // title, auto-fitted
    const lines = (it.p.title || '').split('|');
    let fs = 84; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    while (fs > 40) { x.font = `400 ${fs}px ${fontTitle}`; if (Math.max(...lines.map((l) => x.measureText(l).width)) < TW * 0.82) break; fs -= 4; }
    const lh = fs * 0.92, top = 150 - (lines.length * lh) / 2;
    lines.forEach((l, k) => { x.fillStyle = k === lines.length - 1 ? RED : '#fff'; x.fillText(l, 32, top + (k + 1) * lh); });
    const ty = top + lines.length * lh + 22;
    x.fillStyle = RED; x.fillRect(32, ty - 12, 34, 3);
    x.fillStyle = 'rgba(242,242,242,.82)'; x.font = `500 13px ${fontMono}`; x.fillText(it.p.line || '', 32, ty + 12);
    // bottom row
    x.fillStyle = 'rgba(242,242,242,.5)'; x.font = `500 11px ${fontMono}`; x.fillText('AFTER EFFECTS \u00B7 PREMIERE PRO', 32, TH - 30);
    x.textAlign = 'right'; x.fillStyle = RED; x.font = `600 14px ${fontMono}`; x.fillText('\u25B6  WATCH THE FILM', TW - 32, TH - 30);
    x.textAlign = 'left';
  }

  return {
    texture: (i) => items[i].canvas,
    tick(now) {
      if (now - lastDraw < 1000 / FPS - 1) return;
      lastDraw = now;
      for (const it of items) paint(it, now);
    },
    setPlaying() {},
    destroy() {},
  };
}
