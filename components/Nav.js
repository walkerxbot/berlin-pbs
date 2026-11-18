'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShell } from '@/lib/shell-context';

export const PAGES = [
  { href: '/', label: 'HOME' },
  { href: '/projects/', label: 'PROJECTS' },
  { href: '/about/', label: 'ABOUT' },
  { href: '/contact/', label: 'CONTACT' },
];
export const normPath = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);

export default function Nav() {
  const pathname = usePathname();
  const { go } = useShell();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  const click = (e, href) => { e.preventDefault(); setOpen(false); go(href); };

  return (
    <>
      <header className="nav glass">
        <Link href="/" className="wordmark" onClick={(e) => click(e, '/')} data-cursor="HOME">B3RL1N</Link>
        <nav className="nav-links" aria-label="Main">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} className={'nav-link' + (normPath(pathname) === normPath(p.href) ? ' on' : '')} onClick={(e) => click(e, p.href)}>
              {p.label}
            </Link>
          ))}
        </nav>
        <span className="nav-sp" aria-hidden="true" />
        <button className="nav-burger glass-ic" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <i /><i />
        </button>
      </header>
      <div className={'menu glass' + (open ? ' open' : '')} aria-hidden={!open}>
        {PAGES.map((p, i) => (
          <Link key={p.href} href={p.href} className={normPath(pathname) === normPath(p.href) ? 'on' : ''} onClick={(e) => click(e, p.href)} style={{ '--i': i }}>
            <small>0{i + 1}</small>{p.label}
          </Link>
        ))}
      </div>
    </>
  );
}
