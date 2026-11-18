// Ambient embers + smoke on a Canvas 2D. Self-adjusts if the device is slow.
export function startAmbient(canvas, { embers = 60, smoke = 10 } = {}) {
  if (!canvas || (!embers && !smoke)) return () => {};
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0, h = 0, raf = 0, last = performance.now(), slow = 0, scale = 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.max(1, w * dpr);
    canvas.height = Math.max(1, h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const mkEmber = (init) => ({
    x: Math.random() * w, y: init ? Math.random() * h : h + 10,
    r: 0.6 + Math.random() * 1.8, vy: -(0.15 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * 0.25, ph: Math.random() * 6.28, a: 0.3 + Math.random() * 0.6,
  });
  const mkSmoke = (init) => ({
    x: Math.random() * w, y: init ? h * (0.35 + Math.random() * 0.65) : h + 120,
    r: 120 + Math.random() * 180, vy: -(0.08 + Math.random() * 0.14),
    vx: (Math.random() - 0.5) * 0.12, a: 0.03 + Math.random() * 0.045, ph: Math.random() * 6.28,
  });
  const E = Array.from({ length: embers }, () => mkEmber(true));
  const S = Array.from({ length: smoke }, () => mkSmoke(true));

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = t; return; }
    const dt = Math.min(50, t - last); last = t;
    slow += dt > 34 ? 1 : -0.5;
    slow = Math.max(0, slow);
    if (slow > 40 && scale > 0.35) { scale *= 0.6; slow = 0; }
    const k = dt / 16.7;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const sn = Math.floor(S.length * scale);
    for (let i = 0; i < sn; i++) {
      const p = S[i];
      p.x += p.vx * k; p.y += p.vy * k; p.ph += 0.004 * k;
      if (p.y < -p.r) Object.assign(p, mkSmoke(false));
      const a = p.a * (0.7 + Math.sin(p.ph) * 0.3);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(179,0,27,${a})`);
      g.addColorStop(1, 'rgba(179,0,27,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    const en = Math.floor(E.length * scale);
    for (let i = 0; i < en; i++) {
      const p = E[i];
      p.ph += 0.03 * k;
      p.x += (p.vx + Math.sin(p.ph) * 0.2) * k; p.y += p.vy * k;
      if (p.y < -10) Object.assign(p, mkEmber(false));
      const a = p.a * (0.6 + Math.sin(p.ph * 2) * 0.4);
      ctx.fillStyle = `rgba(255,${60 + (p.r * 40) | 0},60,${a})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
  }
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
}
