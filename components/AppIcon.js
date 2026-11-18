// App-style icons for After Effects and Premiere Pro: rounded dark tile, coloured outline and letters, glass sheen,
// a soft halo, a slow orbit ring and a tilt that follows the pointer. Redrawn in the app-icon style (not Adobe's files).
import { glassLight } from '@/components/Glass';

const SPEC = {
  ae: { t: 'Ae', c: '#9999FF', label: 'After Effects' },
  pr: { t: 'Pr', c: '#EA77FF', label: 'Premiere Pro' },
};

export default function AppIcon({ app, className = '' }) {
  const d = SPEC[app];
  return (
    <div className={'app-ic ' + className} onPointerMove={glassLight} role="img" aria-label={d.label} style={{ '--ac': d.c }}>
      <i className="ai-halo" />
      <i className="ai-ring r1" /><i className="ai-ring r2" />
      <div className="ai-tile">
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={'g-' + app} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0a6e" /><stop offset="1" stopColor="#00003f" /></linearGradient>
            <linearGradient id={'s-' + app} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".38" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
          </defs>
          <rect x="4" y="4" width="112" height="112" rx="26" fill={`url(#g-${app})`} />
          <rect x="9" y="9" width="102" height="102" rx="21" fill="none" stroke={d.c} strokeWidth="5" opacity=".95" />
          <text x="60" y="76" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="500" fontSize="52" fill={d.c} letterSpacing="-1">{d.t}</text>
          <rect x="4" y="4" width="112" height="56" rx="26" fill={`url(#s-${app})`} />
        </svg>
        <i className="ai-sheen" />
      </div>
    </div>
  );
}
