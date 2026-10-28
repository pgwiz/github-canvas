# Changelog

All notable changes to the GitHub Canvas / GitStats project are documented in this file.

## [2.0.0] - 2026-10-28

### Visual & Architectural Overhaul
- **Theme Shift to Electric Blue**: Transitioned primary UI aesthetic from harsh neon green (`115 96% 52%`) to an elegant, high-contrast electric blue (`217 91% 60%`) and cyan (`199 89% 48%`).
- **Eliminated Glare and Flickering**:
  - Removed 5 continuous drifting particle keyframe animations in `GlassPanel` that induced jitter and CPU load.
  - Toned down multi-layered text bloom (`drop-shadow` / `box-shadow`) to accessible levels.
  - Fixed HTML5 canvas matrix transformation bug in `Particles.tsx` where resize events repeatedly stacked `scale(dpr, dpr)` without resetting the transform.
- **Zero-Emoji Policy**: Removed 100% of emojis across the entire project (SVG card generation, customization panels, hero metrics, toasts, and markdown templates) and replaced them with crisp Lucide vector icons.
- **Enhanced 6 Card Types Showcase**: Replaced raw text strings in `CardTypesSection` with realistic, high-fidelity mockups featuring metric badges, progress bars, and sparkline graphs.

### Features Added
- **Theme Gallery Page (`/themes`)**:
  - Created a dedicated theme directory displaying all 18 curated themes with category filters (`Modern`, `Popular`, `Cyber`, `Minimal`, `Vibrant`).
  - Added live card mockup previewers for each theme (`stats`, `streak`, `banner`).
  - Implemented 1-click color swatch hex copying and CSS variable export.
  - Integrated "Use Theme" direct deep-linking into `/generator?theme={id}`.
- **AI Profile Customizer & Markdown Studio (`/profile-customizer`, `/ai`)**:
  - Implemented client-side CV text extraction supporting `.txt`, `.md`, `.json`, and `.pdf`.
  - Added multi-tier AI backend in `api/ai.ts` querying the production AI service (`cr.pgwiz.cloud`), Mistral API, Gemini API, and a robust deterministic fallback generator.
  - Built an interactive split-view workspace featuring an editable raw Markdown editor and a real-time GitHub README rendered preview embedding live SVG stats cards.
  - Added 1-click Markdown copy and `README.md` file download.

### Performance & Security Fixes
- **Catastrophic Backtracking Elimination**:
  - Replaced exponential regex in `supabase/functions/generate-quote/index.ts` with linear boundary index slicing.
  - Replaced exponential regex in `supabase/functions/generate-batch-quotes/index.ts` with linear bracket index slicing.
- **Local Dev Proxy**: Added Vite development server middleware and Supabase card proxy in `vite.config.ts`.
