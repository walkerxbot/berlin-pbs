'use client';
import Character from '@/components/Character';
import { useEffect, useRef } from 'react';
import { startLightning } from '@/lib/lightning';
import { glassLight } from '@/components/Glass';

const KEYS = [
  { id: 'tg', name: 'TELEGRAM', handle: '@MI6XW', href: 'https://t.me/MI6XW' },
  { id: 'ig', name: 'INSTAGRAM', handle: '@ali.ezt3', href: 'https://instagram.com/ali.ezt3' },
  { id: 'bot', name: 'TELEGRAM BOT', handle: '@walkervbot', href: 'https://t.me/walkervbot' },
];

// Thin-line icons
const ICONS = {
  tg: <path d="M21 4 3 11.2l5.6 2 2 6 3.2-3.8 4.6 3.4L21 4ZM8.6 13.2 21 4l-9.4 10.6" />,
  ig: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" /></>,
  bot: <><rect x="4" y="8" width="16" height="11" rx="3.5" /><path d="M12 4v4M9 13v1.5M15 13v1.5M2.5 13v2.5M21.5 13v2.5" /><circle cx="12" cy="3.4" r="1" /></>,
};

const CODE = 'const cut = (frame, beat) => beat.sync(frame); 0x1F 0xA3 render(timeline); if (story) hold(attention); 01001000 export default frame; seq.add(cut, 24); mix(audio, 0.4); 0xE0 0x12 0x2F while(rec) trim(); fade(in, 12); 10110010 loop(beat); keyframe[7].ease(); '.repeat(6);

export default function ContactPage() {
  const cv = useRef(null), keys = useRef([]), box = useRef(null), flash = useRef(null);

  useEffect(() => {
    const tier = document.documentElement.dataset.tier || 'mid';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stop = startLightning(cv.current, { tier, reduce });
    let t1;
    const zap = () => {
      if (flash.current) { flash.current.classList.remove('go'); void flash.current.offsetWidth; flash.current.classList.add('go'); }
      if (box.current) { box.current.classList.add('zap'); clearTimeout(t1); t1 = setTimeout(() => box.current && box.current.classList.remove('zap'), 260); }
    };
    window.addEventListener('b3-zap', zap);
    return () => { stop(); clearTimeout(t1); window.removeEventListener('b3-zap', zap); };
  }, []);

  // pressing a key sends a wave of light to its neighbours
  const press = (i) => {
    keys.current.forEach((el, j) => {
      if (!el) return;
      if (j === i) { el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 500); return; }
      setTimeout(() => { el.classList.add('wv'); setTimeout(() => el.classList.remove('wv'), 700); }, 140 * Math.abs(j - i));
    });
  };

  return (
    <section className="hero contact">
      <Character name="code" className="ch-code" />
      <Character name="akira" className="ch-akira" />
      <canvas ref={cv} className="c-bolt" aria-hidden="true" />
      <div className="c-flash" ref={flash} aria-hidden="true" />
      <div className="c-code cl" aria-hidden="true">{CODE}</div>
      <div className="c-code cr" aria-hidden="true">{CODE}</div>
      <svg className="c-rings" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="500" cy="500" r="300" /><circle cx="500" cy="500" r="420" /><circle cx="500" cy="500" r="560" />
        <path d="M0 500H1000M500 0V1000" />
      </svg>
      <div className="c-vig" aria-hidden="true" />

      <div className="c-head">
        <p className="kicker">CONTACT</p>
        <h1 className="c-title" data-t="LET'S START.">LET&apos;S START.</h1>
        <p className="c-steps"><span>Send a message</span><i>→</i><span>Share your idea</span><i>→</i><span>Let&apos;s start.</span></p>
      </div>

      <div className="c-keys" ref={box}>
        {KEYS.map((k, i) => (
          <a key={k.id} ref={(el) => (keys.current[i] = el)} className="key glass" href={k.href} target="_blank" rel="noopener noreferrer"
             data-cursor="OPEN" onPointerMove={glassLight} onPointerDown={() => press(i)} style={{ '--i': i }}>
            <svg className="key-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k.id]}</svg>
            <small>{k.name}</small>
            <b>{k.handle}</b>
            <em>OPEN →</em>
          </a>
        ))}
      </div>
    </section>
  );
}
