// About hero particles on one Canvas 2D: embers rising, smoke drifting, red petals falling like sparks.
// The pointer pushes everything aside. Counts depend on the quality tier.
export function startBurnFX(canvas, { tier = 'mid' } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const C = { high: [110, 10, 28], mid: [60, 6, 16], low: [0, 0, 8] }[tier] || [60, 6, 16];
  let W = 1, H = 1, raf = 0, last = performance.now();
  const m = { x: -999, y: -999 };

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.ceil(W * dpr); canvas.height = Math.ceil(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  const move = (e) => { const r = canvas.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
  window.addEventListener('pointermove', move, { passive: true });

  const R = Math.random;
  const ember = (init) => ({ x: R() * W, y: init ? R() * H : H + 10, r: 0.6 + R() * 1.9, vy: -(0.25 + R() * 0.8), vx: (R() - 0.5) * 0.3, ph: R() * 6.28, a: 0.35 + R() * 0.6 });
  const smoke = (init) => ({ x: R() * W, y: init ? H * (0.3 + R() * 0.7) : H + 140, r: 130 + R() * 200, vy: -(0.1 + R() * 0.16), vx: (R() - 0.5) * 0.14, a: 0.035 + R() * 0.05, ph: R() * 6.28 });
  const petal = (init) => ({ x: R() * W, y: init ? R() * H : -20, s: 3 + R() * 5, vy: 0.5 + R() * 1.1, ph: R() * 6.28, rot: R() * 6.28, vr: (R() - 0.5) * 0.05, a: 0.55 + R() * 0.4 });
  const E = Array.from({ length: C[0] }, () => ember(true));
  const S = Array.from({ length: C[1] }, () => smoke(true));
  const P = Array.from({ length: C[2] }, () => petal(true));

  const push = (p, rad, str) => {
    const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
    if (d < rad && d > 0.1) { const f = (1 - d / rad) * str; p.x += dx / d * f; p.y += dy / d * f; }
  };

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = t; return; }
    const dt = Math.min(50, t - last); last = t; const k = dt / 16.7;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of S) {
      p.x += p.vx * k; p.y += p.vy * k; p.ph += 0.004 * k; push(p, 220, 2.2);
      if (p.y < -p.r) Object.assign(p, smoke(false));
      const a = p.a * (0.7 + Math.sin(p.ph) * 0.3);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(179,0,27,${a})`); g.addColorStop(1, 'rgba(179,0,27,0)');
      ctx.fillStyle = g; ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    for (const p of E) {
      p.ph += 0.03 * k; p.x += (p.vx + Math.sin(p.ph) * 0.25) * k; p.y += p.vy * k; push(p, 130, 3);
      if (p.y < -10) Object.assign(p, ember(false));
      ctx.fillStyle = `rgba(255,${60 + (p.r * 40) | 0},60,${p.a * (0.6 + Math.sin(p.ph * 2) * 0.4)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const p of P) {
      p.ph += 0.025 * k; p.x += Math.sin(p.ph) * 0.9 * k + 0.25 * k; p.y += p.vy * k; p.rot += p.vr * k; push(p, 140, 3.5);
      if (p.y > H + 20 || p.x > W + 30) Object.assign(p, petal(false));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.62 + Math.abs(Math.sin(p.ph)) * 0.38);
      ctx.fillStyle = `rgba(224,18,47,${p.a})`;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.62, 0, 0, 6.283); ctx.fill();
      ctx.restore();
    }
  }
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
}
