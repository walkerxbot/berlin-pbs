'use client';
import { useEffect } from 'react';

// Adds .in to every [data-rv] element inside ref when it scrolls into view.
export function useReveal(ref) {
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const els = root.querySelectorAll('[data-rv]');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((en) => {
      en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ref]);
}
