// Branching red lightning on a Canvas 2D. Always running: a strike every few seconds, a screen flash event for the page.
// The pointer pulls each bolt a little toward it.
export function startLightning(canvas, { tier = 'mid', reduce = false } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, tier === 'high' ? 1.5 : 1);
  const BRANCHES = tier === 'high' ? 6 : tier === 'mid' ? 4 : 2;
  const GAP = tier === 'low' ? [2800, 3600] : [1500, 2800];
  let W = 1, H = 1, raf = 0, bolts = [], next = 0, mouse = -1, cleared = true;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.ceil(W * dpr); canvas.height = Math.ceil(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  const move = (e) => { mouse = e.clientX / window.innerWidth; };
  window.addEventListener('pointermove', move, { passive: true });

  // midpoint displacement
  function gen(x1, y1, x2, y2, d, pts) {
    if (Math.hypot(x2 - x1, y2 - y1) < 14) { pts.push([x2, y2]); return; }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * d, my = (y1 + y2) / 2 + (Math.random() - 0.5) * d * 0.45;
    gen(x1, y1, mx, my, d / 2, pts); gen(mx, my, x2, y2, d / 2, pts);
  }

  function strike(sx) {
    const startX = sx !== undefined ? sx : W * (0.12 + Math.random() * 0.76);
    let endX = startX + (Math.random() - 0.5) * W * 0.32;
    if (mouse >= 0) endX += (mouse * W - endX) * 0.35;
    const endY = H * (0.55 + Math.random() * 0.4);
    const main = [[startX, -10]];
    gen(startX, -10, endX, endY, Math.max(60, H * 0.22), main);
    const lines = [{ pts: main, w: 1 }];
    for (let i = 0; i < BRANCHES; i++) {
      const j = 3 + Math.floor(Math.random() * (main.length - 6)); if (j < 3) continue;
      const [bx, by] = main[j];
      const dir = Math.random() < 0.5 ? -1 : 1;
      const len = H * (0.12 + Math.random() * 0.28);
      const ex = bx + dir * len * (0.5 + Math.random() * 0.7), ey = by + len * (0.6 + Math.random() * 0.8);
      const bp = [[bx, by]]; gen(bx, by, ex, ey, len * 0.5, bp);
      lines.push({ pts: bp, w: 0.55 });
      if (tier !== 'low' && Math.random() < 0.4) {
        const k = Math.floor(bp.length * 0.5), [cx, cy] = bp[k], sp = [[cx, cy]];
        gen(cx, cy, cx + dir * len * 0.4, cy + len * 0.5, len * 0.3, sp); lines.push({ pts: sp, w: 0.35 });
      }
    }
    bolts.push({ lines, t0: performance.now(), life: reduce ? 700 : 480 + Math.random() * 220 });
    window.dispatchEvent(new CustomEvent('b3-zap'));
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    if (now >= next) {
      strike();
      if (!reduce && Math.random() < 0.3) setTimeout(() => strike(), 130); // double strike
      next = now + (reduce ? 6000 : GAP[0] + Math.random() * (GAP[1] - GAP[0]));
    }
    bolts = bolts.filter((b) => now - b.t0 < b.life);
    if (!bolts.length) { if (!cleared) { ctx.clearRect(0, 0, W, H); cleared = true; } return; }
    cleared = false;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const b of bolts) {
      const age = now - b.t0, u = age / b.life;
      let a = Math.pow(1 - u, 1.6) * (reduce || age < 70 ? 1 : age % 120 < 62 ? 1 : 0.5);
      if (a <= 0.01) continue;
      for (const l of b.lines) {
        const pass = [[11, `rgba(179,0,27,${0.22 * a})`], [4, `rgba(255,50,70,${0.6 * a})`], [1.4, `rgba(255,240,240,${a})`]];
        for (const [w, col] of pass) {
          ctx.lineWidth = w * l.w; ctx.strokeStyle = col; ctx.beginPath();
          l.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
        }
      }
    }
  }
  next = performance.now() + 700;
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
}
