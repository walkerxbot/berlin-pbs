'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShellCtx } from '@/lib/shell-context';
import { detectTier } from '@/lib/quality';
import { initSound, startMusic, whoosh, tick, tock } from '@/lib/sound';
import Intro from '@/components/Intro';
import Nav, { PAGES } from '@/components/Nav';
import Cursor from '@/components/Cursor';
import MouseFX from '@/components/MouseFX';
import SoundButton from '@/components/SoundButton';
import NextChapter from '@/components/NextChapter';
import ScrollNav from '@/components/ScrollNav';
import PageIndicator from '@/components/PageIndicator';

const norm = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);

export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(null); // null until mounted
  const [ready, setReady] = useState(false);
  const [curtain, setCurtain] = useState('idle');
  const [target, setTarget] = useState({ n: '01 / 04', l: 'HOME' });
  const busy = useRef(false);

  // quality tier + intro decision
  useEffect(() => {
    document.documentElement.dataset.tier = detectTier();
    let seen = false;
    try { seen = sessionStorage.getItem('b3_seen') === '1'; } catch (e) {}
    if (seen) {
      setShowIntro(false); setReady(true);
      initSound(); startMusic();
    } else setShowIntro(true);
  }, []);

  useEffect(() => { document.body.dataset.ready = ready ? '1' : '0'; }, [ready]);

  // Music starts by itself. If the browser blocks autoplay, the first click / key / tap starts it (no visible button).
  useEffect(() => {
    let done = false;
    const evs = ['pointerdown', 'keydown', 'touchend', 'click'];
    const off = () => evs.forEach((e) => window.removeEventListener(e, go));
    async function go(e) {
      if (done) return;
      if (e.target && e.target.closest && e.target.closest('.sound-btn')) return;
      initSound();
      const ok = await startMusic();
      if (ok) { done = true; off(); }
    }
    evs.forEach((e) => window.addEventListener(e, go));
    return off;
  }, []);

  // tiny UI sounds (delegated)
  useEffect(() => {
    const SEL = '.glass-btn, .nav-link, .glass-ic, .key, [data-tick]';
    let lastEl = null;
    const over = (e) => {
      const el = e.target.closest && e.target.closest(SEL);
      if (el && el !== lastEl) { lastEl = el; tick(); }
      if (!el) lastEl = null;
    };
    const down = (e) => { if (e.target.closest && e.target.closest(SEL)) tock(); };
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerdown', down);
    return () => { document.removeEventListener('pointerover', over); document.removeEventListener('pointerdown', down); };
  }, []);

  const go = useCallback((href) => {
    if (busy.current || norm(href) === norm(pathname)) return;
    busy.current = true;
    const i = PAGES.findIndex((p) => norm(p.href) === norm(href));
    setTarget({ n: `0${i + 1} / 04`, l: i >= 0 ? PAGES[i].label : '' });
    whoosh();
    setCurtain('in');
    setTimeout(() => { router.push(href); }, 850);
  }, [pathname, router]);

  // when the route actually changes, lift the curtain
  useEffect(() => {
    if (!busy.current) return;
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => setCurtain('out'), 200);
    const t2 = setTimeout(() => { setCurtain('idle'); busy.current = false; }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]);

  const onIntroDone = () => {
    try { sessionStorage.setItem('b3_seen', '1'); } catch (e) {}
    setShowIntro(false);
  };

  return (
    <ShellCtx.Provider value={{ go, ready }}>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <PageIndicator />
      <main className="page" key={pathname}>{children}</main>
      <NextChapter />
      <ScrollNav />
      <SoundButton />
      <MouseFX />
      <Cursor />
      <div className="curtain" data-s={curtain} aria-hidden="true">
        <i className="cp cp1" /><i className="cp cp2" /><i className="cp cp3" />
        <div className="ct"><small>{target.n}</small><b>{target.l}</b></div>
      </div>
      {showIntro === true && <Intro onOpen={() => setReady(true)} onDone={onIntroDone} />}
    </ShellCtx.Provider>
  );
}
