'use client';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/assets';

// A character layer like the John Wick one: black-and-white base, red version revealed around the pointer,
// soft parallax, faded edges and a faint flicker. `name` matches public/chars/<name>-bw.webp / -red.webp.
export default function Character({ name, className = '' }) {
  const root = useRef(null), red = useRef(null);
  useEffect(() => {
    const el = root.current, r = red.current;
    if (!el || !r) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, raf = 0, seen = false;
    const move = (e) => { seen = true; tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };
    window.addEventListener('pointermove', move, { passive: true });
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (!seen && !fine) { tx = 0.5 + Math.sin(t / 1900) * 0.25; ty = 0.45 + Math.cos(t / 2500) * 0.2; }
      x += (tx - x) * 0.07; y += (ty - y) * 0.07;
      const b = el.getBoundingClientRect();
      el.style.setProperty('--px', (x - 0.5).toFixed(4));
      el.style.setProperty('--py', (y - 0.5).toFixed(4));
      r.style.setProperty('--mx', (x * window.innerWidth - b.left).toFixed(1) + 'px');
      r.style.setProperty('--my', (y * window.innerHeight - b.top).toFixed(1) + 'px');
      if (!still) el.style.setProperty('--fl', (0.92 + (Math.sin(t / 130) * Math.sin(t / 370) * 0.5 + 0.5) * 0.08).toFixed(3));
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);
  return (
    <div className={'chr ' + className} ref={root} aria-hidden="true">
      <img className="chr-bw" src={asset(`/chars/${name}-bw.webp`)} alt="" draggable="false" />
      <img className="chr-red" ref={red} src={asset(`/chars/${name}-red.webp`)} alt="" draggable="false" />
    </div>
  );
}
