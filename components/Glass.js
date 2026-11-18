'use client';
import Link from 'next/link';
import { useShell } from '@/lib/shell-context';

// The red light inside glass follows the pointer.
export function glassLight(e) {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty('--lx', e.clientX - r.left + 'px');
  el.style.setProperty('--ly', e.clientY - r.top + 'px');
}

export function GlassLink({ href, children, cursor = 'OPEN', className = '' }) {
  const { go } = useShell();
  return (
    <Link href={href} className={'glass glass-btn ' + className} data-cursor={cursor}
       onPointerMove={glassLight} onClick={(e) => { e.preventDefault(); go(href); }}>
      <span>{children}</span>
    </Link>
  );
}

// Thin-line icon inside a glass circle.
export function GlassIcon({ children, className = '', style }) {
  return <div className={'glass glass-ic ' + className} style={style} onPointerMove={glassLight}>{children}</div>;
}
