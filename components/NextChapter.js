'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShell } from '@/lib/shell-context';
import { PAGES, normPath } from '@/components/Nav';

// A small glass link that appears at the bottom of a page. No fill bar, no scroll-triggered jump.
export default function NextChapter() {
  const pathname = usePathname();
  const { go, ready } = useShell();
  const el = useRef(null);
  const idx = Math.max(0, PAGES.findIndex((p) => normPath(p.href) === normPath(pathname)));
  const next = PAGES[(idx + 1) % PAGES.length];
  const isLoop = idx === PAGES.length - 1;

  useEffect(() => {
    const node = el.current;
    if (!node || !ready) return;
    const vis = () => node.classList.toggle('on', window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 160);
    vis();
    window.addEventListener('scroll', vis, { passive: true });
    window.addEventListener('resize', vis);
    const poll = setInterval(vis, 600); // content height can change after load
    return () => { clearInterval(poll); window.removeEventListener('scroll', vis); window.removeEventListener('resize', vis); };
  }, [pathname, ready]);

  return (
    <Link ref={el} href={next.href} className="nc glass" onClick={(e) => { e.preventDefault(); go(next.href); }} data-cursor="NEXT">
      <span className="nc-txt">{isLoop ? 'BACK TO START' : 'NEXT'} <b>{next.label}</b> <em>→</em></span>
    </Link>
  );
}
