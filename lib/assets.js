// Prefix public assets with the base path (needed on GitHub Pages sub-paths).
export const asset = (p) => (process.env.NEXT_PUBLIC_BASE_PATH || '') + p;
