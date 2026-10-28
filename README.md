# GitStats & GitHub Canvas

A modern, high-performance SVG card generator and AI profile architect for developer GitHub profiles.

[![Live App](https://img.shields.io/badge/Live-github--canvas.vercel.app-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://github-canvas.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

---

## Highlights & Features

- **Electric Blue Design System:** Shifted from harsh neon green to an elegant, high-contrast electric blue and cyan aesthetic. Removed flickering infinite particle loops, text-shadow bloom, and fixed canvas matrix scaling accumulation.
- **Zero Emojis Policy:** All legacy unicode emojis across the UI and generated SVG cards have been replaced with vector Lucide icons for a clean, consistent developer aesthetic.
- **6 Rich Card Types:**
  - **Stats Card:** Total stars, commits, PRs, and followers with sparklines and metric badges.
  - **Contribution Streak Card:** Active streak counter, day progress, and consistency badges.
  - **Top Languages Card:** Real-time percentage progress bars and language badges.
  - **Weekly Activity Card:** Interactive sparkline chart displaying weekly commit density.
  - **Developer Quote Card:** AI-generated developer philosophy quotes with author attribution.
  - **Hero Banner:** Customizable full-width profile banner with animated wave styles.
- **Theme Palette Directory (`/themes`):** Interactive gallery showcasing 18+ themes with category filtering, live card mockups, one-click color swatch copying, and direct generator integration.
- **AI Profile Customizer & Live Markdown Previewer (`/profile-customizer` / `/ai`):**
  - Extract text directly from uploaded CVs (`.pdf`, `.txt`, `.md`, `.json`).
  - Generate a tailored GitHub Profile `README.md` embedding live stats cards.
  - Interactive split editor and real-time GitHub-style rendered preview with 1-click Markdown copying and file download.
- **Hardened Edge Functions:** Replaced catastrophic backtracking regular expressions in Supabase quote generation functions with linear `O(n)` index slicing parsers.

---

## Project Structure

```
├── api/
│   ├── ai.ts              # Multi-tier AI Profile Architect endpoint (Vercel Serverless)
│   ├── card.ts            # SVG Card generation proxy
│   └── health.ts          # API health check endpoint
├── src/
│   ├── components/
│   │   ├── generator/     # Card preview, customization panel, theme selector
│   │   ├── home/          # Hero, card types, features, how-it-works sections
│   │   ├── layout/        # Header, footer, command menu
│   │   ├── profile/       # Live Markdown previewer component
│   │   └── ui/            # Radix UI and GlassPanel components
│   ├── lib/
│   │   ├── cvExtractor.ts # Client-side document text extraction (.pdf, .txt, .md)
│   │   ├── templates.ts   # 18 curated themes and color palettes
│   │   └── utils.ts       # Styling and string utilities
│   ├── pages/
│   │   ├── Generator.tsx  # Interactive card builder with URL searchParams sync
│   │   ├── Themes.tsx     # Theme catalog and swatch inspector
│   │   ├── ProfileCustomizer.tsx # AI Profile architect & split markdown editor
│   │   ├── Docs.tsx       # API documentation
│   │   └── Setup.tsx      # Self-hosting setup guide
│   └── index.css          # Theme tokens and electric blue styling
└── supabase/
    └── functions/         # Edge functions (generate-card, generate-quote, generate-batch-quotes)
```

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/pgwiz/github-canvas.git
cd github-canvas

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will be running at `http://localhost:8080`.

### Build & Lint

```bash
# Check code style and type definitions
pnpm run lint

# Build production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## API Usage

### Card Generator Endpoint

```
GET https://github-canvas.vercel.app/api/card?type={type}&username={username}&theme={theme}&animation={animation}
```

#### Parameters:
- `type`: `stats` | `streak` | `languages` | `activity` | `quote` | `banner`
- `username`: GitHub username (e.g. `pgwiz`)
- `theme`: `electric-blue`, `midnight`, `tokyo-night`, `dracula`, `ocean`, `cyberpunk`, `nord`, etc.
- `animation`: `fadeIn`, `wave`, `glow`, `pulse`

---

## License

MIT © [pgwiz](https://github.com/pgwiz)
