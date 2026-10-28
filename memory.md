# Project Memory & Architectural Context

## Project Identification
- **Repository**: `pgwiz/github-canvas`
- **Hosted Domain**: `https://github-canvas.vercel.app`
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
   - Resides in `src/lib/cardRenderer.ts` and `api/card.ts`.
   - Runs natively on Vercel Serverless (Node.js) and in client `CardPreview.tsx`.
   - Does NOT depend on un-updated remote Supabase functions.
   - Fetches live GitHub API metrics (`stars`, `repos`, `followers`, `forks`, `languages`).
4. **AI Services Hierarchy**:
   - Primary Service: `https://cr.pgwiz.cloud/api/chat` (Header: `x-api-key: pgwiz2026!`) with payload `{ message: prompt }`.
   - Secondary: Mistral API (`mistral-small-latest`) with `MISTRAL_API_KEY`.
   - Tertiary: Gemini Generative AI with `GEMINI_API_KEY`.
   - Fallback: High-quality deterministic profile generator in `api/ai.ts`.
5. **Regex & Event Performance**:
   - Do not use greedy wildcards like `/\[[\s\S]*\]/` or `/\{[\s\S]*"quote"[\s\S]*\}/` to parse JSON from LLMs, as they cause catastrophic backtracking on long text. Always use linear `indexOf` / `lastIndexOf` slicing.
   - Use `useMotionValue` and `useMotionTemplate` for mouse-tracking UI elements (e.g. `SpotlightCard`, `SpotlightGrid`) to prevent React state re-renders on mousemove.

## Routing Reference
- `/`: Home landing page with live interactive card showcases.
- `/generator`: Interactive SVG card generator with URL searchParams synchronization (`?theme=...&type=...&username=...`).
- `/themes`: Dedicated theme gallery with swatches, category filters, and live card previews.
- `/profile-customizer` (and `/ai`): CV upload, AI README architect, and split Markdown previewer.
- `/docs`: REST API documentation and parameter specs.
- `/setup`: Supabase and Vercel deployment setup guide.
