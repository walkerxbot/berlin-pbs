'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useShell } from '@/lib/shell-context';
import { PAGES, normPath } from '@/components/Nav';

// Keep scrolling past the end of a page (or past the top) and the next (or previous) page opens.
// Needs a deliberate push, so a normal scroll never triggers it. Not used on Projects, where the wheel moves the strip.
export default function ScrollNav() {
  const pathname = usePathname();
  const { go, ready } = useShell();

  useEffect(() => {
    if (!ready) return;
    const idx = Math.max(0, PAGES.findIndex((p) => normPath(p.href) === normPath(pathname)));
    if (PAGES[idx].href === '/projects/') return;
    const next = PAGES[(idx + 1) % PAGES.length], prev = idx > 0 ? PAGES[idx - 1] : null;
    const root = document.documentElement;
    const LIMIT = 520;
    let acc = 0, lastT = 0, cool = performance.now() + 1300, ty = null;

    const atBottom = () => window.scrollY + window.innerHeight >= root.scrollHeight - 3;
    const atTop = () => window.scrollY <= 2;
    const glow = (v) => root.style.setProperty('--ov', Math.min(1, Math.abs(v) / LIMIT).toFixed(3));
    const fire = (dir) => { acc = 0; glow(0); cool = performance.now() + 2000; go(dir > 0 ? next.href : prev.href); };
    const push = (dy, now, limit) => {
      if (now < cool || document.body.dataset.modal) return;
      if (now - lastT > 380) acc = 0;
      lastT = now;
      if (dy > 0 && atBottom()) acc = Math.max(0, acc) + dy;
      else if (dy < 0 && atTop() && prev) acc = Math.min(0, acc) + dy;
      else { acc = 0; glow(0); return; }
      root.dataset.ovd = acc > 0 ? 'b' : 't';
      glow(acc * (LIMIT / limit));
      if (Math.abs(acc) >= limit) fire(acc);
    };

    const wheel = (e) => push(e.deltaY * (e.deltaMode === 1 ? 16 : 1), performance.now(), LIMIT);
    const ts = (e) => { ty = e.touches[0].clientY; };
    const tm = (e) => { if (ty === null) return; const y = e.touches[0].clientY, dy = ty - y; ty = y; push(dy * 4, performance.now(), LIMIT * 1.6); };
    const te = () => { ty = null; acc = 0; glow(0); };
    window.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('touchstart', ts, { passive: true });
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('touchend', te, { passive: true });
    const decay = setInterval(() => { if (acc && performance.now() - lastT > 380) { acc = 0; glow(0); } }, 200);
    return () => {
      clearInterval(decay); glow(0);
      window.removeEventListener('wheel', wheel); window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchmove', tm); window.removeEventListener('touchend', te);
    };
  }, [pathname, ready, go]);

  return <div className="ovglow" aria-hidden="true" />;
}
