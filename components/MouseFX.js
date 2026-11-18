'use client';
import { useEffect, useRef } from 'react';

// Mouse motion drawn on the page itself: a soft red light that follows the pointer,
// a glowing streak that fades behind it, and sparks that fly off when you move fast.
export default function MouseFX() {
  const cv = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const tier = document.documentElement.dataset.tier || 'mid';
    if (!fine || tier === 'low') return;
    const c = cv.current, ctx = c.getContext('2d');
    let W = 0, H = 0;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const m = { x: -999, y: -999, gx: -999, gy: -999, v: 0, act: 0 };
    const trail = [], sparks = [];
    const LIFE = 560, MAXSP = tier === 'high' ? 5 : 2;

    const move = (e) => {
      const first = m.x < -900;
      const dx = e.clientX - m.x, dy = e.clientY - m.y, d = first ? 0 : Math.hypot(dx, dy);
      if (first) { m.gx = e.clientX; m.gy = e.clientY; }
      m.x = e.clientX; m.y = e.clientY;
      m.v = Math.min(1, m.v + d / 90);
      m.act = performance.now();
      trail.push({ x: m.x, y: m.y, t: m.act });
      if (trail.length > 70) trail.shift();
      const n = Math.min(MAXSP, Math.floor(d / 14));
      for (let i = 0; i < n; i++) {
        sparks.push({ x: m.x, y: m.y, vx: (Math.random() - 0.5) * 1.8 - dx * 0.02, vy: (Math.random() - 0.5) * 1.8 - dy * 0.02 - 0.25, r: 0.6 + Math.random() * 1.6, t: m.act, l: 500 + Math.random() * 600 });
      }
    };
    window.addEventListener('pointermove', move, { passive: true });

    let raf, cleared = true;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const idle = now - m.act > 4000 && !trail.length && !sparks.length;
      if (idle) { if (!cleared) { ctx.clearRect(0, 0, W, H); cleared = true; } return; }
      cleared = false;
      ctx.clearRect(0, 0, W, H);
      m.gx += (m.x - m.gx) * 0.12; m.gy += (m.y - m.gy) * 0.12; m.v *= 0.92;
      ctx.globalCompositeOperation = 'lighter';

      if (m.x > -900) { // soft light that trails the pointer
        const fade = Math.max(0, 1 - Math.max(0, now - m.act - 2500) / 1500);
        const r = 180 + m.v * 170;
        const g = ctx.createRadialGradient(m.gx, m.gy, 0, m.gx, m.gy, r);
        g.addColorStop(0, `rgba(224,18,47,${(0.14 + m.v * 0.12) * fade})`);
        g.addColorStop(1, 'rgba(224,18,47,0)');
        ctx.fillStyle = g;
        ctx.fillRect(m.gx - r, m.gy - r, r * 2, r * 2);
      }

      while (trail.length && now - trail[0].t > LIFE) trail.shift();
      ctx.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) { // glowing streak
        const a = trail[i - 1], b = trail[i], al = 1 - (now - b.t) / LIFE;
        if (al <= 0 || Math.hypot(b.x - a.x, b.y - a.y) > 220) continue;
        ctx.strokeStyle = `rgba(224,18,47,${al * 0.55})`;
        ctx.lineWidth = 1 + al * 6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.strokeStyle = `rgba(255,205,210,${al * 0.5})`;
        ctx.lineWidth = 0.8 + al * 1.2;
        ctx.stroke();
      }

      for (let i = sparks.length - 1; i >= 0; i--) { // sparks
        const p = sparks[i], age = (now - p.t) / p.l;
        if (age >= 1) { sparks.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy; p.vy -= 0.004; p.vx *= 0.985;
        ctx.fillStyle = `rgba(255,${70 + (p.r * 40) | 0},70,${(1 - age) * 0.85})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - age * 0.5), 0, 6.283); ctx.fill();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas className="mfx" ref={cv} aria-hidden="true" />;
}
