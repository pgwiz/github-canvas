# Project Memory & Architectural Context

## Project Identification
- **Repository**: `pgwiz/github-canvas`
- **Hosted Domain**: `https://github-canvas.pgwiz.cloud` (Vercel alias: `github-canvas-chi.vercel.app`)
- **Vercel Project**: `pgwizs-projects/github-canvas`
- **Active Git Branch**: `main`

## Core Architectural Guardrails
1. **Zero Emojis**: The user requires crisp vector icons across all UI components and SVG outputs. Never re-introduce raw Unicode emojis in card SVG templates, navigation, tooltips, or markdown generators.
2. **Color Palette & Visual Theme**:
   - Primary: Electric Blue (`#3B82F6` / `hsl(217, 91%, 60%)`)
   - Secondary: Cyan (`#06B6D4` / `hsl(199, 89%, 48%)`)
   - Dark Background: Oceanic Midnight (`#090D16` / `#0B1220`)
   - Avoid blinding neon green (`#0CF709`) and multi-layer infinite drifting blur particles.
3. **Card Generation Engine**:
   - Resides in `src/lib/cardRenderer.ts`, `api/card.ts`, and `api/pin.ts`.
   - Runs natively on Vercel Serverless (Node.js) and in client `CardPreview.tsx`.
   - Supports: `stats`, `languages`, `streak`, `activity`, `quote`, `banner`, `contribution`, `pin`/`repo`, `skills`/`stack`, and `custom`.
   - Skills & Stack Matrix Card Engine (`type=skills` / `type=stack`): Replaces repetitive, ugly shields.io badge walls with clean, theme-coordinated vector cards. Supports minimalist icon grid (`icons` layout with vector icons and native hover tooltips), categorized deduplication (`matrix` layout: Languages, Frameworks, Databases, DevOps), and stack cluster rows (`stacks` layout: FARM, PERN, LEMP, Django, Core Languages, DevOps). Full customization supported via `TechStackModal` popup window.
   - Fetches live GitHub API metrics (`stars`, `repos`, `followers`, `forks`, `languages`).
   - Contribution & Streak Engine: Multi-tier fallback (GraphQL -> jogruber all-time API -> GitHub profile scrape) with in-memory 30m cache, accurately computing real longest streak (e.g. 97d for pgwiz from 2026-05-26 to 2026-08-30), real current streak (e.g. 59d continuing today), real total contributions (16,691), and 53-week heatmap cells.
   - SVG Animation Rule: Never use CSS transform on SVG elements with transform attributes. Only use pure opacity transitions (fadeIn with animation-fill-mode: both) or subtlePulse.
   - Transparent Background Standard: Use fill="none" on the SVG root <rect> when transparent mode is enabled.
   - Border Thinness & Radius: Supported via strokeWidth (from 0.5px hairline to 6.0px bold) and borderRadius (0 to 32px), with configurable inner padding.
   - Pinned Repo Card Engine (/api/pin): Supports github-readme-stats parameter aliases, hex normalizer, trailing slash rewrites (/api/pin/(.*)), and graceful fallback for custom domain repos.
4. **AI Services Hierarchy**:
   - Primary Service: `https://cr.pgwiz.cloud/api/chat` (Header: `x-api-key: pgwiz2026!`) with payload `{ message: prompt }`.
   - Secondary: Mistral API (`mistral-small-latest`) with `MISTRAL_API_KEY`.
   - Tertiary: Gemini Generative AI with `GEMINI_API_KEY`.
   - Fallback: High-quality deterministic profile generator in `api/ai.ts`.
5. **Regex & Event Performance**:
   - Do not use greedy wildcards like `/\[[\s\S]*\]/` or `/\{[\s\S]*"quote"[\s\S]*\}/` to parse JSON from LLMs, as they cause catastrophic backtracking on long text. Always use linear `indexOf` / `lastIndexOf` slicing.
   - Use `useMotionValue` and `useMotionTemplate` for mouse-tracking UI elements (e.g. `SpotlightCard`, `SpotlightGrid`) to prevent React state re-renders on mousemove.
6. **No Glowing Blobs or Green Dots/Indicators**:
   - Never use ambient blur glowing blobs (`rounded-full blur-[120px]`), pulsing green dots, or neon glow blobs. Always ask the user first before introducing any glow or blob effects.

## Routing Reference
- `/`: Home landing page with live interactive card showcases.
- `/generator`: Interactive SVG card generator with URL searchParams synchronization (`?theme=...&type=...&username=...`).
- `/themes`: Dedicated theme gallery with swatches, category filters, and live card previews.
- `/profile-customizer` (and `/ai`): CV upload, AI README architect, and split Markdown previewer.
- `/docs`: REST API documentation and parameter specs.
- `/setup`: Supabase and Vercel deployment setup guide.
