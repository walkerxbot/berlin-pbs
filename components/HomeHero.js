'use client';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/assets';
import { COUNTS } from '@/lib/quality';
import { startAmbient } from '@/lib/particles';
import { GlassLink } from '@/components/Glass';
import AppIcon from '@/components/AppIcon';

export default function HomeHero() {
  const root = useRef(null), jw = useRef(null), red = useRef(null), cv = useRef(null);

  useEffect(() => {
    const tier = document.documentElement.dataset.tier || 'mid';
    const fine = window.matchMedia('(pointer: fine)').matches;
    let tx = 0.5, ty = 0.45, x = 0.5, y = 0.45, raf, mouseSeen = false, rad = 250, ox = 0.5, oy = 0.45;
    const move = (e) => {
      mouseSeen = true;
      tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', move);

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (!mouseSeen && !fine) { // touch devices: the reveal drifts by itself
        tx = 0.5 + Math.sin(t / 1800) * 0.22; ty = 0.4 + Math.cos(t / 2300) * 0.2;
      }
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      const sp = Math.hypot(x - ox, y - oy) * 60; ox = x; oy = y;
      rad += (Math.min(520, 230 + sp * 900) - rad) * 0.08;
      const el = root.current, box = jw.current, r = red.current;
      if (!el || !box || !r) return;
      el.style.setProperty('--px', (x - 0.5).toFixed(4));
      el.style.setProperty('--py', (y - 0.5).toFixed(4));
      const b = box.getBoundingClientRect();
      r.style.setProperty('--r', rad.toFixed(0) + 'px');
      r.style.setProperty('--mx', (x * window.innerWidth - b.left).toFixed(1) + 'px');
      r.style.setProperty('--my', (y * window.innerHeight - b.top).toFixed(1) + 'px');
    };
    raf = requestAnimationFrame(loop);

    const c = COUNTS[tier] || COUNTS.mid;
    const stop = startAmbient(cv.current, c);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); stop(); };
  }, []);

  return (
    <section className="hero home" ref={root}>
      <div className="h-street" style={{ backgroundImage: `url(${asset('/jw/jw-street-red.webp')})` }} />

      <h1 className="h-type" aria-label="Every frame tells a story.">
        <span className="ln l1"><i className="red" aria-hidden="true">EVERY FRAME</i><b>EVERY FRAME</b></span>
        <span className="ln l2"><i className="red" aria-hidden="true">TELLS A</i><b>TELLS A</b></span>
        <span className="ln l3"><i className="red" aria-hidden="true">STORY.</i><b>STORY.</b></span>
      </h1>

      <div className="h-jw" ref={jw}>
        <img className="jw-bw" src={asset('/jw/jw-main-bw.webp')} alt="" draggable="false" />
        <img className="jw-red" ref={red} src={asset('/jw/jw-main-red.webp')} alt="" draggable="false" />
      </div>

      <AppIcon app="ae" className="ic ic-ae" />
      <AppIcon app="pr" className="ic ic-pr" />

      <canvas className="h-fx" ref={cv} aria-hidden="true" />
      <div className="h-vig" aria-hidden="true" />

      <div className="h-copy">
        <p className="kicker">VIDEO EDITOR</p>
        <p className="lead">Cinematic edits, cut frame by frame for creators who care how the story lands.</p>
        <div className="h-btns">
          <GlassLink href="/projects/" cursor="VIEW">VIEW PROJECTS</GlassLink>
          <GlassLink href="/contact/" cursor="OPEN" className="alt">START A PROJECT</GlassLink>
        </div>
      </div>
    </section>
  );
}
