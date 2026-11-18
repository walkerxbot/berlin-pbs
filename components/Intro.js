'use client';
import { useEffect, useRef, useState } from 'react';
import { initSound, startMusic, whoosh, tock, boom } from '@/lib/sound';

// ~14 s trailer-style intro. Stages (data-s):
// 1 bars + REC · 2 card one · 3 card two (the cut) · 4 six-word montage · 5 silence + card three
// 6 B3RL1N title · 7 white flash · 8 hard cut to Home
const WORDS = ['FRAME.', 'BY FRAME.', 'BEAT.', 'BY BEAT.', 'CUT.', 'BY CUT.'];

export default function Intro({ onOpen, onDone }) {
  const [s, setS] = useState(0);
  const [gate, setGate] = useState(false);
  const timers = useRef([]);
  const begun = useRef(false);

  useEffect(() => {
    initSound();
    let alive = true;
    // try to start the music right away; browsers may refuse until a click, then we ask for one (ENTER)
    startMusic().then((ok) => { if (!alive) return; if (ok) begin(); else setGate(true); });
    return () => { alive = false; timers.current.forEach(clearTimeout); };
    // eslint-disable-next-line
  }, []);

  const enter = async () => { setGate(false); await startMusic(); begin(); };

  function begin() {
    if (begun.current) return; begun.current = true;
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(300, () => setS(1));
    at(1300, () => setS(2));
    at(3900, () => { setS(3); whoosh(); });
    at(6100, () => setS(4));
    WORDS.forEach((_, i) => at(6100 + i * 430, tock));
    at(8800, () => setS(5));
    at(10300, () => { setS(6); boom(); });
    at(13300, () => setS(7));
    at(13420, () => { onOpen && onOpen(); });
    at(13520, () => setS(8));
    at(14200, () => onDone());
  }

  const skip = () => {
    begun.current = true; setGate(false); startMusic();
    timers.current.forEach(clearTimeout);
    setS(7);
    setTimeout(() => { onOpen && onOpen(); setS(8); }, 120);
    setTimeout(onDone, 800);
  };

  return (
    <div className="intro" data-s={s} role="dialog" aria-label="Intro">
      <div className="i-stage">
        <div className="i-glow" />
        <div className="i-leak" />
        <div className="i-dust" />
        <div className="i-scan" />
        <i className="i-bar bt" /><i className="i-bar bb" />
        <div className="i-rec"><i />REC</div>
        <i className="i-c c1" /><i className="i-c c2" /><i className="i-c c3" /><i className="i-c c4" />

        <div className="i-beat b1">
          <p className="t small">EVERY STORY</p>
          <p className="t big1">STARTS IN THE DARK.</p>
        </div>

        <div className="i-beat b2">
          <p className="t small">THEN SOMEONE</p>
          <p className="t mid">MAKES THE</p>
          <p className="t cutw" data-t="CUT.">CUT.</p>
        </div>

        <div className="i-beat b3">
          {WORDS.map((w, i) => (
            <span key={i} className={'mw ' + (i % 2 ? 'dk' : 'lt')} style={{ '--i': i }}><b>{w}</b></span>
          ))}
        </div>

        <div className="i-beat b4">
          <p className="t small">NOTHING IS</p>
          <p className="t mid">ACCIDENTAL.</p>
        </div>

        <div className="i-flare" />
        <div className="i-mark" data-t="B3RL1N">B3RL1N</div>
        <div className="i-sweep" />
        <div className="i-sub">
          <p className="s1">VIDEO EDITOR</p>
          <p className="s2">AFTER EFFECTS · PREMIERE PRO</p>
        </div>
      </div>
      <div className="i-flash" />
      {gate && (
        <div className="i-gate">
          <p>SOUND ON · HEADPHONES RECOMMENDED</p>
          <button onClick={enter} data-cursor="ENTER">ENTER</button>
        </div>
      )}
      <button className="i-skip glass" onClick={skip} data-cursor="SKIP">SKIP</button>
    </div>
  );
}
