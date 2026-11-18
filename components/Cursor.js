'use client';
import { useEffect, useRef } from 'react';

// Viewfinder cursor: four red corner brackets around a tiny cross. No circle.
// The brackets close in over links, spread wide over the projects and a short label appears under them.
export default function Cursor() {
  const box = useRef(null), label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const el = box.current;
    const move = (e) => {
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      const d = e.target.closest && e.target.closest('[data-dyn]');
      if (d) { label.current.textContent = d.getAttribute('data-cursor') || ''; el.classList.add('lbl'); }
    };
    const over = (e) => {
      const t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      const hot = e.target.closest ? e.target.closest('a,button,[role=button],.key') : null;
      el.classList.toggle('lbl', !!t);
      el.classList.toggle('hot', !!hot);
      label.current.textContent = t ? t.getAttribute('data-cursor') : '';
    };
    const down = () => el.classList.add('down');
    const up = () => el.classList.remove('down');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className="cur" ref={box} aria-hidden="true">
      <div className="cur-in">
        <i className="cb tl" /><i className="cb tr" /><i className="cb bl" /><i className="cb br" /><i className="cx" />
        <span className="cur-lbl" ref={label} />
      </div>
    </div>
  );
}
