// Static export so the site can be hosted on GitHub Pages (or any static host).
// For GitHub Pages under /repo-name set NEXT_PUBLIC_BASE_PATH=/repo-name before `npm run build`.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: base,
  assetPrefix: base || undefined,
};
