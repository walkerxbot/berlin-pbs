'use client';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/assets';
import { PROJECTS } from '@/lib/projects';
import { createSpiral } from '@/lib/spiral';
import { createCovers } from '@/lib/covers';
import Character from '@/components/Character';
import { duckForVideo, tock, whoosh } from '@/lib/sound';
import { GlassLink } from '@/components/Glass';

const pad = (n) => String(n + 1).padStart(2, '0');

function VideoModal({ index, onClose, onGo }) {
  const box = useRef(null), vid = useRef(null);
  const [full, setFull] = useState(false);
  const p = PROJECTS[index];

  useEffect(() => {
    duckForVideo(true); tock();
    document.body.dataset.modal = '1';
    return () => { duckForVideo(false); delete document.body.dataset.modal; };
  }, []);

  useEffect(() => {
    const v = vid.current; if (!v) return;
    v.currentTime = 0; v.play().catch(() => {});
  }, [index]);

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
      else if (e.key === 'ArrowRight') onGo(1);
      else if (e.key === 'ArrowLeft') onGo(-1);
    };
    const fs = () => setFull(!!document.fullscreenElement);
    window.addEventListener('keydown', key);
    document.addEventListener('fullscreenchange', fs);
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('fullscreenchange', fs); };
  }, [onClose, onGo]);

  const toggleFull = () => {
    const b = box.current, v = vid.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (b && b.requestFullscreen) b.requestFullscreen().catch(() => {});
    else if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone
  };

  return (
    <div className="vm" onClick={onClose} role="dialog" aria-label={`Project ${p.id}`}>
      <div className={'vm-panel glass' + (full ? ' full' : '')} ref={box} onClick={(e) => e.stopPropagation()}>
        <div className="vm-bar">
          <span className="vm-id">{p.id} <i>/ {pad(PROJECTS.length - 1)}</i></span>
          <span className="vm-sp" />
          <button className="vm-b" onClick={() => onGo(-1)} aria-label="Previous project" data-cursor="PREV">←</button>
          <button className="vm-b" onClick={() => onGo(1)} aria-label="Next project" data-cursor="NEXT">→</button>
          <button className="vm-b" onClick={toggleFull} aria-label="Fullscreen" data-cursor="FULL">⤢</button>
          <button className="vm-b" onClick={onClose} aria-label="Close" data-cursor="CLOSE">✕</button>
        </div>
        <video ref={vid} key={p.id} className="vm-video" src={asset(p.video)} poster={asset(p.cover)} controls playsInline autoPlay preload="auto" />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const cv = useRef(null), sp = useRef(null), covers = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(-1);
  const openRef = useRef(-1);
  openRef.current = open;

  useEffect(() => {
    const tier = document.documentElement.dataset.tier || 'mid';
    const cs = getComputedStyle(document.documentElement);
    const cov = createCovers(PROJECTS, { tier, fontTitle: cs.getPropertyValue('--f-title') || 'Impact', fontMono: cs.getPropertyValue('--f-mono') || 'monospace' });
    covers.current = cov;
    const N = PROJECTS.length;
    const playAround = (i) => {
      const set = new Set();
      if (openRef.current >= 0) { cov.setPlaying(set); return; } // covers rest while a video is open
      const reach = tier === 'high' ? N : tier === 'mid' ? 2 : 0;
      for (let d = -reach; d <= reach; d++) set.add(((i + d) % N + N) % N);
      cov.setPlaying(set);
    };
    playAround(0);
    const r = createSpiral(cv.current, {
      count: N, tier, texture: cov.texture, tick: cov.tick, paused: () => openRef.current >= 0,
      onActive: (i) => { setActive(i); playAround(i); },
      onOpen: (i) => { whoosh(); setOpen(i); },
    });
    sp.current = r;
    return () => { r.destroy(); cov.destroy(); };
  }, []);

  useEffect(() => { // pause the covers while a video is open, resume after
    const cov = covers.current; if (!cov) return;
    if (open >= 0) cov.setPlaying(new Set());
    else cov.setPlaying(new Set([active, (active + 1) % PROJECTS.length, (active + PROJECTS.length - 1) % PROJECTS.length]));
  }, [open, active]);

  const go = (d) => setOpen((o) => (o + d + PROJECTS.length) % PROJECTS.length);

  return (
    <section className="hero reel">
      <Character name="tyler" className="ch-tyler" />
      <canvas ref={cv} className="rf-canvas" tabIndex={0} data-cursor="DRAG" data-dyn aria-label="Projects spiral. Drag, scroll or use arrow keys. Click a cover to play." />
      <div className="rf-vig" aria-hidden="true" />
      <span className="rf-c rf-tl">B3RL1N ®</span>
      <span className="rf-c rf-tr">SELECTED WORK</span>
      <span className="rf-c rf-bl">{pad(active)} / {pad(PROJECTS.length - 1)}</span>
      <span className="rf-c rf-br">DRAG · SCROLL · CLICK TO PLAY</span>
      <button className="rf-step rf-prev glass-ic glass" onClick={() => sp.current && sp.current.step(-1)} aria-label="Previous" data-cursor="PREV">←</button>
      <button className="rf-step rf-next glass-ic glass" onClick={() => sp.current && sp.current.step(1)} aria-label="Next" data-cursor="NEXT">→</button>
      <a className="rf-more glass glass-btn" href="https://t.me/walkervbot" target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
        <span>MORE WORK · @walkervbot</span>
      </a>
      {open >= 0 && <VideoModal index={open} onClose={() => setOpen(-1)} onGo={go} />}
    </section>
  );
}
