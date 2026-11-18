// Three automatic quality tiers: high / mid / low.
export function detectTier() {
  if (typeof window === 'undefined') return 'mid';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  let tier = 'high';
  if (coarse || cores <= 4 || mem <= 4) tier = 'mid';
  if (reduce || cores <= 2 || mem <= 2) tier = 'low';
  return tier;
}

export const COUNTS = {
  high: { embers: 90, smoke: 14 },
  mid: { embers: 45, smoke: 8 },
  low: { embers: 0, smoke: 0 },
};
