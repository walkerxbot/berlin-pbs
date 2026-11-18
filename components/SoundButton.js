'use client';
import { useEffect, useState } from 'react';
import { isMuted, isStarted, setMuted, startMusic, initSound, loadPrefs } from '@/lib/sound';

// Music plays by itself. This button only mutes / unmutes it.
export default function SoundButton() {
  const [st, setSt] = useState({ started: false, muted: false });

  useEffect(() => {
    loadPrefs();
    const sync = () => setSt({ started: isStarted(), muted: isMuted() });
    sync();
    window.addEventListener('b3-music', sync);
    return () => window.removeEventListener('b3-music', sync);
  }, []);

  const click = async () => {
    initSound();
    if (!isStarted()) { await startMusic(); return; } // autoplay was blocked: this click starts it
    setMuted(!isMuted());
  };

  return (
    <button className={'sound-btn glass-ic' + (st.muted ? ' m' : '')} onClick={click}
      aria-label={st.muted ? 'Unmute music' : 'Mute music'} data-cursor={st.muted ? 'UNMUTE' : 'MUTE'}>
      <span className={'eq' + (st.started && !st.muted ? ' on' : '')}><i /><i /><i /><i /></span>
    </button>
  );
}
