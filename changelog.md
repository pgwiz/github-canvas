# Changelog

All notable changes to the GitHub Canvas / GitStats project are documented in this file.

## [2.1.2] - 2026-10-28

### SVG Coordinate Preservation Bugfix
- **Fixed SVG Keyframe Transformation Collapse**:
  - **Root Cause**: `@keyframes fadeIn` in `cardRenderer.ts` and `api/card.ts` animated `transform: translateY(-6px)` to `transform: translateY(0)` with `animation-fill-mode: forwards`. In SVG, CSS `transform` properties override the XML `transform="translate(x, y)"` attributes on `<g>` elements. When the animation reached its final state, it reset the horizontal and vertical offsets to 0, causing all metrics, labels, and columns to collapse into a single overlapping smear at `(0,0)`.
  - **Resolution**: Replaced keyframe translation with a pure opacity fade (`opacity: 0` to `opacity: 1`), fully preserving XML coordinate geometry across all browsers, embeds, and GitHub Camo proxies.
  - **Cleanup**: Removed residual `<circle filter="blur(20px)" />` ambient glow element from the stats SVG template.

## [2.1.1] - 2026-10-28

### Visual Cleanliness & Rule Enforcement
- **Eliminated Ambient Glowing Blobs & Green Indicators**:
  - Removed all ambient blur background orbs (`w-96 h-96 rounded-full blur-[140px]`) from `HeroSection.tsx`, `CardTypesSection.tsx`, `Footer.tsx`, and `NotFound.tsx`.
  - Removed glowing backdrop blur blob from `ScrollToTop.tsx`.
  - Replaced emerald/green status dots and checks with clean electric blue and neutral vectors in `CardTypesSection.tsx`, `Generator.tsx`, `ProfileCustomizer.tsx`, and `Themes.tsx`.
- **Global & Project Rule Enforcement**:
  - Added global user rule to `~/.gemini/GEMINI.md`, `memory.md`, and `agent.md` prohibiting glowing blobs and green pulsing indicators without explicit prior user consent.

## [2.1.0] - 2026-10-28

### Native Card Generation Engine & Zero-Emoji Architecture
- **Self-Contained Card Generator (`src/lib/cardRenderer.ts`, `api/card.ts`)**:
  - Replaced legacy proxy in `api/card.ts` that pointed to an un-updated remote Supabase function returning old neon green cards with raw emojis (`⭐`, `📦`, `👥`, `🔀`).
  - Implemented a complete native TypeScript SVG generation engine running directly in Vercel Serverless with GitHub REST API integration for real user stats, repositories, forks, and language breakdowns.
  - Zero-latency client-side preview in `CardPreview.tsx` using the shared rendering engine, eliminating flicker and offline failures.
  - Default theme is electric blue (`#3B82F6` and `#06B6D4`) with 100% SVG vector paths for all icons.

### Performance & PR Consolidation
- **Consolidated & Closed 9 Open PRs (#42, #41, #37, #36, #34, #29, #26, #25, #24)**:
  - **`ScrollProgress.tsx`**: Added top-of-page gradient scroll indicator with spring physics.
  - **`ThemeToggle.tsx`**: Added smooth animated Sun/Moon mode switcher with `next-themes` and wrapped `App.tsx` with `ThemeProvider`.
  - **`SpotlightCard.tsx` & `SpotlightGrid.tsx`**: Replaced stateful mouse tracking with `useMotionValue` and `useMotionTemplate`, achieving silky 60fps animations without triggering React re-renders.
  - **`skeleton.tsx`**: Upgraded loading skeleton to directional shimmer animation.
- **Vite Dev Server Bug Fix**:
  - Fixed `ReferenceError: parsed is not defined` scoping bug in `/api/ai` catch block in `vite.config.ts`.
  - Added dev server handler for `/api/card` in `vite.config.ts` so cards render consistently in local development.
- **Deep-linking & UI Polish**:
  - Deep-linked `/generator?type={id}` directly from `CardTypesSection.tsx`.
  - Enhanced `MarkdownPreview.tsx` with Markdown table rendering, task list checkboxes, and standalone HTML tag preservation.
  - Eliminated remaining green accent panels and hover glows in `Generator.tsx`.

## [2.0.0] - 2026-10-28

### Visual & Architectural Overhaul
- **Theme Shift to Electric Blue**: Transitioned primary UI aesthetic from harsh neon green (`115 96% 52%`) to electric blue (`217 91% 60%`) and cyan (`199 89% 48%`).
- **Eliminated Glare and Flickering**:
  - Removed continuous drifting particle keyframe animations in `GlassPanel` that induced jitter and CPU load.
  - Toned down multi-layered text bloom (`drop-shadow` / `box-shadow`) to accessible levels.
  - Fixed HTML5 canvas matrix transformation bug in `Particles.tsx`.
- **Zero-Emoji Policy**: Removed emojis across the UI and card templates, replacing them with Lucide vector icons.
- **Theme Gallery Page (`/themes`)**: Dedicated theme directory displaying all 18 curated themes with category filters and live previews.
- **AI Profile Customizer & Markdown Studio (`/profile-customizer`, `/ai`)**: Client-side CV extraction and live Markdown preview studio.
