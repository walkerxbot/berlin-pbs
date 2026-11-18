# B3RL1N — personal site (Next.js)

## Run locally (VS Code terminal)
```
npm install
npm run dev
```
Open http://localhost:3000

## Build a static site
```
npm run build      # output goes to /out
npm run preview    # serves /out locally
```

## GitHub Pages
Set the repo name as base path before building:
- Windows (PowerShell):  `$env:NEXT_PUBLIC_BASE_PATH="/your-repo"; npm run build`
- macOS/Linux:           `NEXT_PUBLIC_BASE_PATH=/your-repo npm run build`

Status: checkpoint 3b — all four pages built (Home, Projects with Reel Flux, About, Contact), scroll-past-the-end page navigation, bigger Ae/Pr icons.
Next: mobile polish, testing, GitHub Pages.
Next: Contact, About, Projects, mobile polish, testing, deploy.

## See it on your phone (same Wi-Fi)
```
npm run dev:phone
```
Find your computer's local IP (Windows: `ipconfig`, look for IPv4) and open `http://THAT-IP:3000` on the phone. If it does not load, allow Node.js through the Windows firewall for private networks.

## v3c changes
- Projects: Spiral Flux (helix) with poster-style covers: title + tagline per project (edit in `lib/projects.js`), videos play on click.
- Cursor: viewfinder brackets instead of a circle.
- Intro: music starts with the intro; if the browser blocks autoplay an ENTER button appears first.
- Characters (Vagabond / Tyler / Akira / code-anime) added as faded red-on-B&W layers (`components/Character.js`, `public/chars`).
