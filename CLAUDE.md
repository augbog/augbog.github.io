# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

Personal portfolio website for Augustus Yuan, built with React 18 + Vite. Deployed to GitHub Pages at `augustusyuan.com`. Features an interactive 3D scene (Three.js), an animated quotes carousel, and social links.

There are two pages:
- **Homepage** (`index.html` / `src/main.jsx`) — the main portfolio with 3D cubes and hero overlay
- **Quotes page** (`quotes.html` / `src/quotes.jsx`) — a dedicated quotes carousel

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI components |
| Vite 5 | Dev server and production build |
| Tailwind CSS 3 | Utility-first styling |
| Three.js | 3D interactive scene |
| TWEEN.js | Smooth animations |
| PostCSS + Autoprefixer | CSS processing |
| GitHub Actions | CI/CD to GitHub Pages |

## Directory Structure

```
augbog.github.io/
├── src/                    # Active source code
│   ├── main.jsx            # Homepage entry point
│   ├── quotes.jsx          # Quotes page entry point
│   ├── App.jsx             # Root component (wires ThreeScene + HeroOverlay)
│   ├── components/
│   │   ├── Header.jsx      # Fixed header with email link
│   │   ├── ThreeScene.jsx  # Canvas wrapper (forwardRef, exposes setTheme())
│   │   ├── HeroOverlay.jsx # Central hero: profile, name, title, quotes
│   │   └── SocialIcons.jsx # Social links with icon hover → theme change
│   ├── hooks/
│   │   └── useThreeScene.js  # All Three.js scene logic (~300 lines)
│   ├── pages/
│   │   └── Quotes.jsx      # Quotes page component
│   ├── constants/
│   │   └── themes.js       # Color palettes and social media brand colors
│   └── styles/
│       └── index.css       # Tailwind directives + custom @layer utilities
├── public/                 # Static assets (served at root)
│   └── quotes.json         # Quote data: array of { quote, author }
├── index.html              # Homepage HTML shell
├── quotes.html             # Quotes page HTML shell
├── vite.config.js          # Vite config (two entry points, outputs to dist/)
├── tailwind.config.js      # Tailwind config (scans .html + src/**/*.{js,jsx})
├── postcss.config.js       # PostCSS plugins
├── .github/workflows/
│   └── deploy.yml          # Deploy to GitHub Pages on push to master
├── CNAME                   # Custom domain: augustusyuan.com
├── llms.txt                # LLM usage policy
└── [legacy, do not modify]
    ├── Gulpfile.js         # Old Gulp build (superseded by Vite)
    ├── sass/               # Old SCSS stylesheets
    ├── build/              # Old Gulp build output
    ├── js/                 # Old plain JavaScript files
    └── vendor/             # Third-party lib copies
```

## Development Workflow

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server with HMR
npm run build     # Build production output to dist/
npm run preview   # Serve dist/ locally to verify build
```

The dev server runs at `http://localhost:5173` by default.

Deployment is fully automated: push to `master` → GitHub Actions builds and deploys `dist/` to GitHub Pages.

## Key Conventions

### Component Patterns

- **`ThreeScene`** uses `forwardRef` + `useImperativeHandle` to expose a `setTheme(colors)` method to its parent. Do not break this API.
- **`useThreeScene`** is a custom hook that owns all Three.js lifecycle (setup, animation loop, event listeners, teardown). Keep Three.js logic inside this hook.
- Prop drilling is used intentionally: `onIconHover` flows App → HeroOverlay → SocialIcons. No state management library.

### Styling

- **Prefer Tailwind utility classes** for layout and spacing.
- **Custom utilities** go in `src/styles/index.css` under `@layer components`.
- Dynamic/computed styles (e.g., animations, theme-driven colors) use inline `style={}` in JSX.
- Dark mode is handled via `window.matchMedia('(prefers-color-scheme: dark)')` in JS — not via Tailwind's `dark:` variant. Match this pattern for any dark mode additions.
- Do not edit files in `sass/` — they are deprecated.

### Interactivity

Key interactions to be aware of when modifying components:

| Interaction | Component | Behavior |
|---|---|---|
| Hover cube | `useThreeScene` | Increment score, elastic scale/rotate animation |
| Hover social icon | `SocialIcons` → `App` → `ThreeScene` | Change scene colors to brand palette |
| Arrow keys | `useThreeScene` | Cycle through color themes |
| Konami code (↑↑↓↓←→←→BA) | `useThreeScene` | Explode all cubes |
| Mobile device orientation | `useThreeScene` | Gyroscope-driven camera |

### Mobile vs Desktop

- Mobile breakpoint: **600px**
- Desktop renders 1000 cubes; mobile renders 250
- Icon hover effects are disabled on mobile
- Camera positioning differs between breakpoints

### Accessibility

Maintain existing accessibility patterns:
- `aria-live="polite"` on quote text (dynamic content)
- `aria-hidden="true"` on decorative SVG/canvas elements
- Semantic HTML (`<header>`, `<section>`, `<h1>`–`<h3>`)

### Adding Quotes

Edit `public/quotes.json`. Each entry must have:
```json
{ "quote": "The quote text.", "author": "Author Name" }
```

### Adding Social Icons

Edit `src/components/SocialIcons.jsx`. Each entry in the icons array needs:
- `brand` — key matching a color in `src/constants/themes.js`
- `href` — link URL
- `title` — accessible label
- `svgId` — ID of the `<symbol>` in the SVG sprite in `index.html`
- `fill` — brand hex color

Then add the matching brand color palette in `src/constants/themes.js`.

## Build Output

Vite outputs to `dist/`. The GitHub Actions workflow uploads this directory as the Pages artifact. Do not commit `dist/` — it is gitignored.

## What Not to Touch

- `Gulpfile.js`, `sass/`, `build/`, `js/`, `vendor/` — legacy artifacts, kept for reference only
- `.nvmrc` specifies Node 6.12.0 but the CI workflow uses Node 20; local dev should also use Node 20+
- `CNAME` — changing this will break the custom domain
