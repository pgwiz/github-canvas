# Changelog

All notable changes to the GitHub Canvas / GitStats project are documented in this file.

## [2.3.8] - 2026-10-29

### Expanded Tech Icon Catalog & Universal Full-Stack Stack Engines
- **Comprehensive Vector Icon Suite (`src/lib/techIcons.ts`)**:
  - Integrated 16 new official brand vector icons with exact brand hex colors:
    - `Android` (`#3DDC84`), `Firebase` (`#FFCA28`), `GitHub` (`#FFFFFF`), `GitHub Actions` (`#2088FF`), `DigitalOcean` (`#0080FF`), `JWT` (`#D63AFF`), `OAuth` (`#EB5424`), `SSL/TLS` (`#0095D5`), `Postman` (`#FF6C37`), `VS Code` (`#007ACC`), `Hugging Face` (`#FFD21E`), `LangChain` (`#00A67E`), `AWS` (`#FF9900`), `Azure` (`#0078D4`), `Google Cloud` (`#4285F4`), and `Oracle Cloud` (`#F80000`).
  - Added comprehensive alias map entries (`actions`, `gh-actions`, `do`, `jwt`, `oauth`, `auth0`, `ssl`, `tls`, `postman`, `vscode`, `hf`, `huggingface`, `langchain`, `aws`, `azure`, `gcp`, `googlecloud`, `oracle`, `oci`, `c#`, `csharp`).
- **Expanded Preset Stacks Engine (`src/lib/cardRenderer.ts`, `api/card.ts`)**:
  - Added new 1-click preset stacks: `flutter` (Flutter, Android, Firebase), `security` (JWT, OAuth, SSL/TLS), `tools` (Git, GitHub, Postman, VS Code), `ai` (Python, FastAPI, PostgreSQL, Hugging Face, LangChain), and `cloud` (AWS, Azure, Google Cloud, Oracle Cloud).
  - Categorized Matrix layout now groups into 5 structured tiers including `AI, Security & Tools`, rendering official brand color dots for all skills.
- **Dynamic URL Query Support (`skills=...` & `stacks=...`)**:
  - Allows linking any combination of programming languages, tools, frameworks, and cloud platforms directly via URL query parameters in `layout=matrix`, `layout=icons`, and `layout=stacks`.

## [2.3.7] - 2026-10-29

### Mobile-Responsive Navbar & Ultra-Thin Screen Optimization
- **Ultra-Thin Screen Architecture (`src/components/layout/Header.tsx`)**:
  - Eliminated horizontal screen overflow and clipping on mobile devices (<480px, down to 320px).
  - Scaled logo badge (`w-8 h-8 sm:w-9 sm:h-9`) with truncated brand text and tight gap spacing (`gap-2 sm:gap-2.5`), ensuring comfortable fit even on 320px screens with over 80px margin remaining.
  - Kept desktop & tablet floating pill navigation for `md` (768px) and above with smooth spring pill animations (`layoutId="nav-pill"`).
  - Added dedicated mobile search icon button (`Search`) and theme toggle on the mobile bar.
- **Mobile Navigation Drawer (`Sheet`)**:
  - Integrated Radix-powered slide-out drawer (`SheetContent side="right"`) on mobile screens (`md:hidden`).
  - Automatically auto-closes on route change (`location.pathname`).
  - Drawer contents:
    - Branded studio header with title and subtitle.
    - 1-click command search trigger button with `⌘K` keyboard badge.
    - Primary navigation links with large touch targets, vector icons, active highlight badges, and descriptions.
    - Quick Studio Jumps grid linking directly to User Stats, Streak, Tech Stack, and Pinned Repo card generators.
    - Bottom action bar with direct ThemeToggle and external GitHub repository link.
- **Global Overflow & Scrollbar Guardrails (`src/components/layout/Layout.tsx`, `src/index.css`)**:
  - Applied `overflow-x: hidden` and `max-width: 100vw` across `html`, `body`, and `<Layout>` root containers, permanently preventing mobile horizontal wobble.
  - Updated `<main>` vertical clearance to `pt-14 sm:pt-16` to seamlessly match the responsive header height (`h-14 sm:h-16`).

## [2.3.6] - 2026-10-29

### General Code Cleanliness & Architecture Hygiene
- **Zero ESLint Warnings Across Entire Codebase**:
  - Eliminated all 16 ESLint warnings down to a clean 0 errors and 0 warnings.
  - Wrapped `fetchStats` in `useCallback` inside `src/hooks/useGitHubStats.ts` and added it to the dependency array of `useEffect` in `src/pages/Generator.tsx`, preventing unnecessary re-subscriptions and satisfying `react-hooks/exhaustive-deps`.
  - Scoped exported constants and helper functions in `src/pages/ProfileCustomizer.tsx` (`createDefaultSections`, `compileSectionsToMarkdown`, `parseMarkdownToSections`, `getCardApiBase`, `SECTION_ICONS`, `CARD_TEMPLATES`) to module-internal to comply with Vite Fast Refresh (`react-refresh/only-export-components`).
  - Configured `eslint.config.js` to handle shadcn/ui variant exports cleanly.
- **Type Safety & Build Verification**:
  - `npx tsc --noEmit`: 100% clean check, 0 TypeScript compilation errors.
  - `pnpm build`: Production build passes cleanly with tree-shaking and optimized bundles.
- **Strict User Global Rules Verification**:
  - Confirmed 0 rogue `.md` files; strictly maintaining only `readme.md`, `changelog.md`, `memory.md`, and `agent.md`.
  - Confirmed 0 glowing blobs, ambient blur background circles, or glowing green dots/indicators.
  - Confirmed 0 orphan scratch scripts or residual `console.log` statements in source files.

## [2.3.5] - 2026-10-29

### Profile Customizer Section & Card Rearranging Engine
- **Visual Section & Card Reordering (`src/pages/ProfileCustomizer.tsx`)**:
  - Added dedicated **"Rearrange Order"** tab in the Right Column workspace with active section counter badge.
  - Added deterministic **Move Up** (`ChevronUp`) and **Move Down** (`ChevronDown`) arrow controls with boundary disabling and accessible labels.
  - Implemented smooth drag-and-drop reordering with dedicated drag handle (`GripVertical`), drop target highlight indicators, and flicker-free transition behavior.
  - Added section visibility toggling (`Eye` / `EyeOff`) to omit sections without deleting them.
  - Added inline markdown snippet editor (`Code2`) to customize section content in place.
  - Added quick 1-click layout reset (`RotateCcw`) restoring standard section ordering.
  - Center Stage workspace header includes quick-access "Rearrange Order" button linking directly to the order management tab.
- **Robust Markdown-to-Section Round-Trip Parsing**:
  - Fixed heading detachment bug where regex lookahead split headings away from their child SVG cards.
  - Unified section boundary detection that keeps headings and image card bodies together.
  - Preserves section IDs and previously disabled sections across re-parses.
  - Atomic state synchronization (`getFreshSections`) on textarea blur, tab switch, and stage button clicks, preventing stale closure races and manual edit regressions.

## [2.3.4] - 2026-10-29

### Universal Language Library & Tech Stack "+ Add" Engine
- **Universal Programming Language Library (`src/lib/techIcons.ts`)**:
  - Expanded technology catalog to 70+ programming languages modeled after Devicon, Simple Icons, and GitHub Linguist specs:
    - Added full SVG paths, official brand hex colors, and aliases for: Solidity, Zig, Julia, R, Scala, Elixir, Erlang, Clojure, Haskell, Lua, Perl, Groovy, F#, OCaml, Nim, Mojo, Crystal, V, D, Fortran, COBOL, Pascal, Delphi, Ada, Prolog, Lisp, Assembly, WebAssembly, Dart, Kotlin, Swift, HTML5, CSS3, SQL, GraphQL, and more.
  - Added universal fallback vector generator: any custom language typed in the world automatically generates a clean vector code-bracket tile with deterministic color hashing.
  - Added comprehensive alias mapping (`js`, `ts`, `py`, `rs`, `golang`, `cpp`, `c#`, `cs`, `rb`, `kt`, `sh`, `bash`, `ps`, `wasm`, `asm`, `sol`, `postgres`, `mongo`, `k8s`, `tailwind`, `node`).
- **Tech Stack Modal "+ Add" Fix (`src/components/generator/TechStackModal.tsx`)**:
  - **Inline Search Bar "+ Add" Action**: Embedded an instant `+ Add` button directly inside the search bar and added `Enter` key form submission. Typing any language and hitting Enter or clicking Add immediately appends it to the active stack.
  - **Bottom "+ Add" Action**: Fixed bottom form handler with visual button state, active chip creation, and instant toast confirmation.
  - **Live Dynamic Grid Tiles**: Synthesizes and displays custom user-added skills directly in the catalog grid with active state indicators so they can be toggled visually.
- **Custom Language Stacks & Langs Card Support**:
  - **Cluster Retention in Stacks Layout (`skillsLayout === 'stacks'`)**: Fixed bug where custom skills were omitted in stacks layout; now automatically preserves them in a dynamic "Custom & Active Stack" row.
  - **Top Languages Customization (`type="languages"`)**: Added "Customize Languages in Popup" button to the Generator sidebar, allowing users to override GitHub's auto-detected languages with their custom tech stack.

## [2.3.3] - 2026-10-29

### Palette Themes, Transparent Background & Border Thinness
- **Visual Palette Themes Gallery**:
  - Restored visual 2-column theme swatch grid in the Generator sidebar with category filtering (`All`, `Modern`, `Cyber`, `Minimal`, `Popular`, `Vibrant`).
  - Added live circular color previews for primary and secondary accents with active selection indicators.
  - Included 1-click "Magic Theme" randomizer with particle celebration.
- **Transparent Background (`fill="none"`)**:
  - Added dedicated transparent background toggle and "Transparent" theme preset across `templates.ts`, `cardRenderer.ts`, and `api/card.ts`.
  - Generates SVG root rectangle with `fill="none"` to allow embedding seamlessly in dark or light GitHub profile READMEs without background bounding box mismatch.
  - Preview canvas dynamically removes container backgrounds when transparent mode is active, showing the grid matrix through the card.
- **Border Radius & Stroke Width (Thinness) Engine**:
  - Added border stroke width control from `0.5px` (hairline) up to `6.0px` (bold) with quick preset chips.
  - Prominent border radius slider (`0px` to `32px`) with instant preset chips (`Sharp`, `Subtle`, `Smooth`, `Pill`).
  - Added horizontal edge padding (`paddingLeft`, `paddingRight`) and vertical padding controls for precise card edge spacing.
  - Parsed `strokeWidth`, `stroke_width`, and `stroke` query parameters across `/api/card` and `/api/pin`.

### SVG Coordinate Collapse & Bounce Elimination
- **Fixed SVG Multi-Column Merging Glitch**:
  - Root cause resolved: CSS `transform: translateY` applied to `<g>` tags with SVG attributes `transform="translate(x, y)"` was wiping out horizontal coordinate offsets, causing stats and streak columns to momentarily collapse onto $x=0$.
  - Replaced all SVG animations with pure opacity transitions (`fadeIn` with `animation-fill-mode: both`), preventing flash before delay and eliminating text overlap.
  - Fixed quote card bouncing by removing unstable CSS transform animations.

### Accurate GitHub Streak Engine
- **Accurate All-Time Streak Calculations**:
  - Evaluated full 2,557-day contribution history for `pgwiz` via jogruber API, confirming exact longest streak of 97 days (May 26 - Aug 30, 2026) and current active streak of 59 days.

### Pinned Repositories & Trailing Slash Rewrites
- **Pinned Repo API (`/api/pin` & `/api/pin/`)**:
  - Added stroke width and transparent background support to `api/pin.ts`.
  - Added trailing slash rewrites in `vercel.json` (`/api/pin/(.*)` and `/api/card/(.*)`) matching `github-readme-stats` URL specifications.

## [2.3.2] - 2026-10-29

### 3-Column Studio Workspace for Profile Customizer (`/profile-customizer`)
- **Full 3-Column Workspace Architecture**:
  - **Left Column**: Collapsible Resume / CV Uploader (`<details>` accordion) with drag-and-drop extraction (.pdf, .txt, .md, .json), document removal, target role / headline input, tone selector, card inclusion checkboxes, and "Generate AI Profile README" action with loading feedback.
  - **Center Column (Core Stage)**: Dynamic canvas with view mode tabs:
    - `Preview`: Full rendered GitHub README in a backdrop-blurred container with real dynamic SVG cards.
    - `Code`: Monospace Markdown editor with character & word counts.
    - `Split`: Side-by-side split screen with synced editing and live rendering.
    - Bottom Dock with one-click `Copy Markdown` and `Download README.md`.
  - **Right Column (Card Library & Quick Injector)**: 1-click chips to append cards (`Hero Banner`, `GitHub Stats`, `Streak Tracker`, `Top Languages`, `Tech Stack Matrix`, `Weekly Activity`, `Dev Quote`, `Pinned Repo`) and README section templates (`About Me Bio`, `Featured Projects Table`, `Social Badges`, `GitHub Trophies`).

### Bug Fixes: 404 Errors on Cards & API Rewrites
- **Resolved 6x 404 Console Errors**:
  - Replaced hardcoded dead domain `https://github-canvas.vercel.app/api/card` in `src/pages/ProfileCustomizer.tsx` and `api/ai.ts` with dynamic `getCardApiBase()` resolving to `https://github-canvas.pgwiz.cloud` and active browser origin.
  - Updated `vercel.json` with explicit rewrites for `/card` -> `/api/card` and `/pin` -> `/api/pin`.

### Tech Stack "+ Add" Language Fix (`TechStackModal.tsx`)
- **Fixed State Wiping on Keystrokes & Add**:
  - Replaced buggy `useMemo` reset with an isolated `useEffect([isOpen])` hook, ensuring user selections and added custom languages are never cleared while the modal is open.
  - Wrapped custom input and "+ Add" button in a native form submit handler to support both button clicks and Enter key submissions.
  - Added direct 1-click addition when typing unmatched languages in the search bar.

### Share Popup Modal & Link Scrollbar Elimination
- **Interactive Share Modal (`src/components/generator/ShareModal.tsx`)**:
  - Added popup modal with direct SVG URLs, README Markdown embed, HTML tag, and clickable badge.
  - Integrated 1-click social sharing to Twitter/X, LinkedIn, Reddit, WhatsApp, and Telegram.
  - Added "Share" button to `/generator` and `/profile-customizer`.
- **Global Link & Textarea Scrollbar Removal**:
  - Replaced link textarea with sleek readonly input eliminating horizontal/vertical scrollbars on Windows Chrome/Edge.
  - Enhanced global CSS rules for `input`, `textarea`, `pre`, and `code` with `scrollbar-width: none !important` and `::-webkit-scrollbar { display: none !important }`.

### Scrollbar Removal & Minimalist Tech Stack Modal
- **Global Scrollbar Removal**:
  - Implemented `scrollbar-width: none !important` and `::-webkit-scrollbar { display: none !important }` in `src/index.css`.
  - Hidden all distracting scrollbars across the Studio Workspace (canvas stage, icon rail, settings sidebar, and dock) while maintaining smooth mousewheel, touch, and trackpad navigation.
- **Tech Stack & Language Customization Popup (`src/components/generator/TechStackModal.tsx`)**:
  - Added dedicated popup window allowing full customization of programming languages, frameworks, and tools.
  - Search filter indexing 150+ predefined technologies with category tabs (`All`, `Languages`, `Frontend`, `Backend`, `Databases`, `DevOps & Tools`).
  - Interactive selection chips with 1-click removal, count badge, and "Clear All" action.
  - Quick Stack Presets: 1-click loading of curated stacks (`FARM`, `PERN`, `LEMP`, `Django`, `Core Languages`).
  - Custom Language & Tool Input: allows typing any programming language (e.g. Mojo, Zig, Solidity, Fortran, Nim) and immediately adding it to the stack card.
- **Minimalist Icon Grid Mode (`layout=icons`)**:
  - Introduced minimalist icon tile grid mode for `type=skills` in `src/lib/cardRenderer.ts` and `api/card.ts`.
  - Displays crisp vector icons in theme-matching rounded tiles with subtle borders.
  - Embeds `<title>${skillName}</title>` inside each tile, providing native browser hover tooltips that display the full language/tool name.
  - Built comprehensive vector icon catalog in `src/lib/techIcons.ts` with SVG paths for top languages and tools.

## [2.3.0] - 2026-10-29

### Studio Workspace Overhaul (`src/pages/Generator.tsx`)
- **Ported 3-Pane Studio Workspace Philosophy**:
  - **Far Left Icon Rail**: Dedicated vertical toolbar with crisp Lucide icons and uppercase indicators for all 10 card engines (`Stats`, `Langs`, `Streak`, `Active`, `Quote`, `Banner`, `Grid`, `Pinned`, `Skills`, `Custom`).
  - **Center Live Stage**:
    - Top status bar displaying real-time dimensions (`495 × 195 px`, `500 × 260 px`, `720 × 250 px`), `Single` vs `Stack` view toggle, and quick `@username` input with live data synchronization.
    - Centered preview container with subtle `.canvas-grid` dot matrix background and responsive SVG scaling.
    - Integrated **Stack Mode**: Vertical gallery rendering all profile cards concurrently (Stats, Languages, Streak, Tech Stack, Contribution Graph, Quote, Pinned Repo) so developers can preview their entire README layout at a glance.
  - **Seamless Bottom Export Dock**:
    - Format switcher tabs for `URL`, `Markdown`, and `HTML`.
    - One-click `Download SVG` button delivering raw SVG files directly.
    - One-click `Copy Snippet` button with interactive 2-second "Copied!" feedback state.
    - Monospace readonly snippet box with instant select-on-click.
  - **Right Properties Sidebar**:
    - Native/styled accordions for `General` (user sync, card-specific options, theme selector with random magic button), `Appearance & Colors` (gradient toggle, individual color pickers with hex text inputs for bg, primary, secondary, text, border, and border visibility), `Layout & Sizing` (border radius slider, animation mode), and `Content Overrides` (custom header title and tag).

### Skills & Tech Stack Matrix Card Engine (`type=skills` & `type=stack`)
- **Resolved Redundant Shields.io Badge Wall (`media_1793230479955_acd3790a.png`)**:
  - Solved user problem where developer README profiles contained sprawling, disjointed walls of shields.io badges repeating identical technologies multiple times (e.g., Python 3x, PostgreSQL 3x, Nginx 2x, PHP 2x across FARM, PERN, LEMP, Django stacks).
  - Implemented cohesive **Skills & Stack Matrix Card** in `src/lib/cardRenderer.ts` and `api/card.ts`.
  - Added two viewing modes:
    1. **Categorized Matrix (`layout=matrix`)**: Automatically de-duplicates all skills across selected stacks and groups them into clean rows: `Core Languages`, `Frameworks & Runtimes`, `Databases & Storage`, and `DevOps & Systems`.
    2. **Stack Clusters (`layout=stacks`)**: Displays organized stack rows (e.g. `FastAPI · FARM`, `PERN · Node`, `LEMP · Laravel`, `Django Stack`, `Core Languages`).
  - Sleek pill badges with subtle theme borders (`${primaryColor}35`), soft fills, canonical technology dot accents, and unified typography.
  - Dynamic line wrapping so cards scale smoothly regardless of stack combinations.

### Template Engine & Color Synchronization Fix
- **Root Cause Identified**: Selecting a template in `ThemeSelector.tsx` or `Generator.tsx` only updated the `theme` string identifier while leaving `bgColor`, `primaryColor`, `secondaryColor`, `textColor`, and `borderColor` populated with previous values. In `CardPreview.tsx` and `api/card.ts`, explicit color parameters took precedence over the theme's colors, causing selected templates to appear completely non-functional.
- **Resolution**:
  - Bound theme selection to simultaneously update all five core palette colors in state.
  - Updated Magic Theme randomizer to assign matching palette colors, gradients, and angles.
  - Optimized `LinkGenerator.tsx` and `/generator` code output to omit redundant color parameters when they match the active template's defaults, keeping URLs minimal and clean.

### Visual Rule Compliance
- Removed residual background blur orbs (`blur-[140px]`, `blur-[120px]`) from `src/pages/Themes.tsx`.
- Removed `TiltCard` wobble and glare artifacts from `CardPreview.tsx` to prevent card jitter.

### Visual Stabilization (Removed Card Bouncing & Floating)
- **Eliminated Hero Card Floating / Bouncing**:
  - Removed `animate-float` keyframe bobbing and asynchronous delays (`delay-0`, `delay-500`, `delay-1000`) from `HeroSection.tsx` and `NotFound.tsx`.
  - Replaced 3D mouse wobble `TiltCard` with stable, solid containers to prevent erratic movement on mouse interaction.
  - Aligned all three hero cards evenly on the horizontal axis without vertical staggered offsets.
  - Removed continuous `animate-pulse` animations from badges and card icons.

## [2.2.0] - 2026-10-28

### Real Contribution Heatmap & Accurate Streak Engine (`/api/card?type=contribution` & `type=streak`)
- **Resolved Broken Contribution Graph**:
  - Implemented complete 53-week (cols) by 7-day (rows) SVG heatmap rendering in `api/card.ts` and `src/lib/cardRenderer.ts`.
  - Added month axis indicators (Jan - Dec), weekday indicators (Mon, Wed, Fri), header stats badges, and 5-tier intensity scale legend.
- **Fixed Fake Streak Calculation**:
  - **Root Cause**: Previous implementation calculated streak using a mock formula based on public repo counts (`Math.floor(repos.length * 3.2)` yielded 145, `Math.floor(repos.length * 1.5)` yielded 32), generating inaccurate metrics that contradicted real commit history.
  - **Resolution**: Integrated live multi-tiered contribution engine (GitHub GraphQL API with `GITHUB_TOKEN` -> jogruber all-time contributions API -> direct GitHub profile scrape fallback).
  - Accurately tracks all-time longest streak (e.g. real 97-day streak for `@pgwiz` from May 26 to Aug 30, 2026), current active streak (e.g. 58 days continuing today), and lifetime total contributions (16,691).
  - Added in-memory 30-minute caching for sub-5ms response times and rate-limit immunity.

### Pinned Repository Card Engine (`/api/pin` & `/api/card?type=pin`)
- **New Dedicated Endpoint `/api/pin`**:
  - Full compatibility with `github-readme-stats` parameters: `username`, `repo`, `theme`, `border_color`, `title_color`, `text_color`, `icon_color`, `bg_color`, `show_owner`, `description`.
  - Added automatic color normalizer supporting hex with or without `#`, `transparent` theme/background, and truncated hex typo resolution (e.g. `bg_color=0d11` -> `#0d1117`).
  - Added graceful fallback for private or custom domain projects (e.g. `pgwiz.cloud`), ensuring pinned cards render rich vector graphics without throwing 404 or returning broken images.
  - Added `Pinned` tab, repository inputs, and custom description options to `Generator.tsx` and `CustomizationPanel.tsx`.
  - Added `/api/pin` documentation and live example to `/docs`.

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
