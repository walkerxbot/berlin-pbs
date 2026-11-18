// Spiral Flux for B3RL1N: cards ride a vertical helix seen from outside, drawn on one Canvas 2D.
// Original implementation. Each card is cut into thin vertical strips; every strip is projected at its own angle
// around a cylinder, so the card bends round it. Each card stays level and sits one step below the one before it.
// Near the cylinder's silhouette cards flare taller and pick up a thin red rim; the far half shows faded between the rows.

const TAU = Math.PI * 2;
const mod = (n, d) => ((n % d) + d) % d;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createSpiral(canvas, o) {
  const ctx = canvas.getContext('2d');
  const N = o.count, tier = o.tier || 'mid';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const STRIPS = tier === 'high' ? 40 : tier === 'mid' ? 28 : 18;
  const CFG = { arcDeg: 47, gapDeg: 2.5, depth: 4.7, turns: 3.6, flare: 0.6, edgeDeg: 26, fringe: 0.75, tilt: 1, backAlpha: 0.62, auto: 0.11, smooth: 9, wave: tier === 'low' ? 0.5 : 1 };
  const arc = CFG.arcDeg * Math.PI / 180, slot = (CFG.arcDeg + CFG.gapDeg) * Math.PI / 180;
  const D = CFG.depth, horizon = Math.acos(1 / D), cardH = arc / (16 / 9), rise = cardH * CFG.turns / TAU;
  const edgeZone = Math.min(CFG.edgeDeg * Math.PI / 180, horizon * 0.9, (Math.PI - horizon) * 0.9);

  let W = 1, H = 1, f = 1, pos = o.startPos || 0, target = pos, wave = 0, raf = 0, last = 0, lastInput = 0;
  let drag = null, destroyed = false, visible = true, active = -1, hit = [], dprUsed = 1;
  const cleanups = [];
  const on = (el, t, fn, opt) => { el.addEventListener(t, fn, opt); cleanups.push(() => el.removeEventListener(t, fn, opt)); };
  const proj = (th) => f * Math.sin(th) / (D - Math.cos(th));

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    dprUsed = Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5);
    canvas.width = Math.ceil(W * dprUsed); canvas.height = Math.ceil(H * dprUsed);
    ctx.setTransform(dprUsed, 0, 0, dprUsed, 0, 0);
    const half = Math.min(W * (W < 600 ? 0.42 : 0.3), H * 0.5);
    f = half * Math.sqrt(D * D - 1);
    wake();
  }
  const running = () => visible && !document.hidden && !destroyed;
  function wake() { if (!raf && running()) { last = performance.now(); raf = requestAnimationFrame(draw); } }

  const near = (th) => { const k = Math.max(0, (edgeZone - Math.abs(Math.abs(th) - horizon)) / edgeZone); return k * k; };

  function draw(now) {
    raf = 0; if (!running()) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (o.tick) o.tick(now);
    const idle = now - lastInput > 1400 && !drag && !(o.paused && o.paused());
    if (idle && !motion.matches) target += CFG.auto * dt;
    const prev = pos;
    pos += (target - pos) * (motion.matches ? 1 : 1 - Math.exp(-CFG.smooth * dt));
    const vel = (pos - prev) / Math.max(dt, 0.001);                       // radians per second
    const amp = motion.matches ? 0 : clamp(vel * f * 0.00028, -1, 1) * H * 0.05 * CFG.wave;
    wave += (amp - wave) * (1 - Math.exp(-10 * dt)); if (motion.matches) wave = 0;

    ctx.clearRect(0, 0, W, H);
    hit = [];
    const cx = W / 2, cy = H / 2, growth = CFG.flare;
    // which cards can reach the stage
    const yMax = (H / 2) * (D + 1) / f + cardH * (1 + growth) / 2;
    const span = yMax / rise;
    const j0 = Math.floor((pos - span - arc / 2) / slot), j1 = Math.ceil((pos + span - arc / 2) / slot);
    const rims = [];
    const edgeX = proj(horizon);

    const pass = (front) => {
      for (let j = j0; j <= j1; j++) {
        const tex = o.texture(mod(j, N)); if (!tex) continue;
        const c = j * slot + arc / 2, Y = rise * (c - pos);
        const level = CFG.tilt;                                          // 1: each card level at its own height
        let rim = null;
        for (let m = 0; m < STRIPS; m++) {
          const psi = j * slot + arc * m / STRIPS, a = psi - pos, d0 = arc / STRIPS;
          const th0 = mod(a + Math.PI, TAU) - Math.PI, thm = th0 + d0 / 2, th1 = th0 + d0;
          const isFront = Math.abs(thm) < horizon;
          if (isFront !== front) { rim = null; continue; }
          const k = near(thm), dep = D - Math.cos(thm), s = f / dep;
          const x0 = proj(th0), x1 = proj(th1), xm = cx + (x0 + x1) / 2;
          const wPx = Math.abs(x1 - x0) + 1.4, left = cx + Math.min(x0, x1) - 0.35;
          const phase = xm / W * TAU + pos * 1.5;
          const h = s * cardH * (1 + k * growth) * (1 + Math.cos(phase) * Math.abs(wave) / H * 0.15);
          const yc = cy + s * Y * level + Math.sin(phase) * wave;
          if (yc - h / 2 > H || yc + h / 2 < 0) { rim = null; continue; }
          const fade = clamp((edgeX - Math.abs(xm - cx) - 0.75) / 6, 0, 1);
          if (fade <= 0) { rim = null; continue; }
          const u = front ? m / STRIPS : 1 - (m + 1) / STRIPS;
          ctx.globalAlpha = fade * (front ? 1 : CFG.backAlpha);
          ctx.drawImage(tex, u * tex.width, 0, tex.width / STRIPS + 0.3, tex.height, left, yc - h / 2, wPx, h);
          if (front) hit.push({ l: left, w: wPx, t: yc - h / 2, h, i: mod(j, N), d: Math.abs(thm) });
          if (k > 0.02) { if (!rim) rims.push(rim = { front, p: [] }); rim.p.push(xm, yc - h / 2, yc + h / 2, k * fade); } else rim = null;
        }
      }
      ctx.globalAlpha = 1;
    };
    pass(false);
    pass(true);

    if (rims.length) {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [rgb, lw, off] of [['224,18,47', 3, 1.5], ['255,214,214', 1.1, -1]]) {
        ctx.lineWidth = lw;
        for (const r of rims) {
          const p = r.p, base = (r.front ? 1 : 0.5) * CFG.fringe;
          for (let i = 4; i < p.length; i += 4) {
            ctx.strokeStyle = `rgba(${rgb},${base * p[i + 3]})`;
            ctx.beginPath(); ctx.moveTo(p[i - 4], p[i - 3] - off); ctx.lineTo(p[i], p[i + 1] - off); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p[i - 4], p[i - 2] + off); ctx.lineTo(p[i], p[i + 2] + off); ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    const idx = mod(Math.round((pos - arc / 2) / slot), N);
    if (idx !== active) { active = idx; o.onActive && o.onActive(idx); }
    wake(); // keeps rotating gently (and the covers keep playing)
  }

  // ---- hit test: front-most strip under the pointer ----
  function cardAt(x, y) {
    for (let i = hit.length - 1; i >= 0; i--) {
      const q = hit[i];
      if (x >= q.l - 1 && x <= q.l + q.w + 1 && y >= q.t && y <= q.t + q.h) return q.i;
    }
    return null;
  }
  const setLabel = (x, y) => canvas.setAttribute('data-cursor', cardAt(x, y) === null ? 'DRAG' : 'PLAY');

  // ---- input ----
  const bump = () => { lastInput = performance.now(); wake(); };
  const step = (d) => { target = (Math.round((target - arc / 2) / slot) + d) * slot + arc / 2; bump(); };
  on(canvas, 'wheel', (e) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!d) return; e.preventDefault();
    const u = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? H : 1;
    target += clamp(d * u, -600, 600) * 0.0022; bump();
  }, { passive: false });
  on(canvas, 'pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t0: target, moved: false, cap: e.pointerType !== 'touch', both: e.pointerType !== 'touch', time: performance.now() };
    if (drag.cap) canvas.setPointerCapture(e.pointerId);
    canvas.toggleAttribute('data-dragging', drag.cap);
  });
  on(canvas, 'pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    if (!drag) { setLabel(e.clientX - r.left, e.clientY - r.top); return; }
    if (e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.cap) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag = null; return; }
      if (Math.abs(dx) < 8) return;
      drag.cap = true; canvas.setPointerCapture(e.pointerId); canvas.toggleAttribute('data-dragging', true);
    }
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    target = drag.t0 - (dx + (drag.both ? dy : 0)) * (slot / (f / (D - 1) * arc)) ; bump();
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; canvas.removeAttribute('data-dragging');
    if (canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (e.type === 'pointerup' && !d.moved && performance.now() - d.time < 600) {
      const r = canvas.getBoundingClientRect(), i = cardAt(e.clientX - r.left, e.clientY - r.top);
      if (i !== null) o.onOpen && o.onOpen(i);
    }
    bump();
  };
  ['pointerup', 'pointercancel'].forEach((t) => on(canvas, t, release));
  on(canvas, 'keydown', (e) => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); step(1); }
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); o.onOpen && o.onOpen(active < 0 ? 0 : active); }
  });
  on(document, 'visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake(); });
  on(motion, 'change', wake);
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver((en) => { visible = en.some((x) => x.isIntersecting); if (visible) wake(); }); io.observe(canvas);
  resize();

  return {
    step,
    destroy() { destroyed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cleanups.forEach((fn) => fn()); },
  };
}
