'use client';
import Character from '@/components/Character';
import { useEffect, useRef, useState } from 'react';
import { startBurnFX } from '@/lib/burn';
import { useReveal } from '@/lib/useReveal';
import { GlassLink, glassLight } from '@/components/Glass';

const STORY = [
  'B3RL1N is a video editor who builds stories out of motion, sound and timing. Every project begins with a simple question: what should the viewer feel, and when? The answer decides the pace of every cut, the weight of every transition and the silence between them.',
  'Over two years of dedicated work in Adobe After Effects and Premiere Pro, that question has shaped a style that is sharp, cinematic and deliberate. The edits are rhythmic without being rushed, stylised without losing clarity, and always cut to serve the story rather than to decorate it.',
  'That work has led to collaborations with well-known creators and YouTubers, where deadlines are tight, standards are high and every frame is seen by a large audience. Reliability and attention to detail matter as much as creativity, and both are part of the craft.',
  'The approach is the same on every project: understand the idea, find its rhythm, then refine it until nothing is accidental. Whether the format is a short vertical reel or a long-form video, the goal is a finished piece that holds attention from the first frame to the last.',
];
const TIMELINE = [
  ['THE BEGINNING', 'Learning the craft inside After Effects and Premiere Pro.'],
  ['THE CRAFT', 'Two years of focused work, building a sharp and cinematic style.'],
  ['THE COLLABORATIONS', 'Cutting for well-known creators and YouTubers.'],
  ['NOW', 'Open to new projects and new stories.'],
];
const SKILLS = [
  ['After Effects', 'Motion graphics, compositing and visual effects.'],
  ['Premiere Pro', 'Editing, pacing and sound synchronisation.'],
  ['Storytelling', 'Structure, rhythm and emotion in every sequence.'],
];
const SERVICES = [
  ['Video Editing', 'Clean, rhythmic edits that give raw footage structure, pace and a clear point of view.'],
  ['Motion Graphics', 'Titles, transitions and animated elements designed to match the tone of the project.'],
  ['Reels & Shorts', 'Fast, high-impact vertical edits built to hold attention from the first second.'],
  ['YouTube Editing', 'Long-form edits with strong pacing, clear storytelling and a consistent visual identity.'],
];
const APPROACH = [
  ['RHYTHM', 'Every cut is placed on purpose.'],
  ['STORY', 'Footage serves the idea, never the other way around.'],
  ['PRECISION', 'Details are checked until nothing is left to chance.'],
];

export default function AboutPage() {
  const root = useRef(null), cv = useRef(null);
  const [tier, setTier] = useState('mid');
  useReveal(root);

  useEffect(() => {
    const t = document.documentElement.dataset.tier || 'mid';
    setTier(t);
    return startBurnFX(cv.current, { tier: t });
  }, []);

  return (
    <div ref={root} className="about" data-tier={tier}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="burnA" x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.055" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="burnB" x="-15%" y="-35%" width="130%" height="170%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="9" result="n">
              {tier === 'high' && <animate attributeName="baseFrequency" dur="6s" values="0.012 0.04;0.017 0.052;0.012 0.04" repeatCount="indefinite" />}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="64" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <section className="hero a-hero">
        <Character name="vagabond" className="ch-vag" />
        <canvas ref={cv} className="a-fx" aria-hidden="true" />
        <svg className="a-ink" viewBox="0 0 1000 700" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
          <path className="ink i1" d="M1000 700 C 900 560, 820 500, 720 380 S 560 230, 430 130" />
          <path className="ink i2" d="M780 470 C 740 430, 700 420, 650 425" />
          <path className="ink i2" d="M650 330 C 610 300, 600 270, 560 262" />
          <path className="ink i2" d="M860 585 C 900 540, 930 520, 980 520" />
          <path className="ink i3" d="M520 200 C 500 170, 470 160, 440 165" />
          {[[650, 425], [560, 262], [440, 165], [980, 520], [720, 380], [600, 285]].map(([x, y], i) => (
            <circle key={i} className="blossom" cx={x} cy={y} r={7 + (i % 3) * 3} style={{ '--d': 1.4 + i * 0.18 + 's' }} />
          ))}
        </svg>
        <div className="a-word" aria-label="B3RL1N">
          <span className="aw aw-glow" aria-hidden="true">B3RL1N</span>
          <span className="aw aw-fire" aria-hidden="true">B3RL1N</span>
          <h1 className="aw aw-main">B3RL1N</h1>
        </div>
        <p className="a-sub">BUILT FRAME BY FRAME.</p>
        <p className="a-sub2">VIDEO EDITOR · AFTER EFFECTS · PREMIERE PRO</p>
        <div className="a-vig" aria-hidden="true" />
      </section>

      <div className="a-body">
        <section className="a-sec a-story">
          <p className="a-lab" data-rv>01 — ABOUT</p>
          <p className="a-lead" data-rv>{STORY[0]}</p>
          <div className="a-cols">
            {STORY.slice(1).map((t, i) => <p key={i} data-rv style={{ '--d': i * 0.12 + 's' }}>{t}</p>)}
          </div>
        </section>

        <section className="a-sec">
          <p className="a-lab" data-rv>02 — TIMELINE</p>
          <ol className="a-tl">
            {TIMELINE.map(([t, d], i) => (
              <li key={t} data-rv style={{ '--d': i * 0.1 + 's' }}>
                <i className="dot" /><small>0{i + 1}</small><b>{t}</b><span>{d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="a-sec">
          <p className="a-lab" data-rv>03 — SKILLS</p>
          <div className="a-grid g3">
            {SKILLS.map(([t, d], i) => (
              <article key={t} className="a-card glass" onPointerMove={glassLight} data-rv style={{ '--d': i * 0.1 + 's' }}>
                <small>0{i + 1}</small><h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="a-sec">
          <p className="a-lab" data-rv>04 — SERVICES</p>
          <div className="a-grid g2">
            {SERVICES.map(([t, d], i) => (
              <article key={t} className="a-card big glass" onPointerMove={glassLight} data-rv style={{ '--d': i * 0.08 + 's' }}>
                <small>0{i + 1}</small><h3>{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="a-sec">
          <p className="a-lab" data-rv>05 — APPROACH</p>
          <div className="a-appr">
            {APPROACH.map(([t, d], i) => (
              <div key={t} className="ap" data-rv style={{ '--d': i * 0.12 + 's' }}><b>{t}</b><span>{d}</span></div>
            ))}
          </div>
        </section>

        <section className="a-sec a-cta">
          <h2 data-rv>HAVE AN IDEA?<br /><em>LET&apos;S MAKE IT WORTH WATCHING.</em></h2>
          <div data-rv style={{ '--d': '.2s' }}><GlassLink href="/contact/" cursor="OPEN" className="alt">START A PROJECT</GlassLink></div>
        </section>
      </div>
    </div>
  );
}
