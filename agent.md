# Agent Guide & Development Standards

## Purpose
This document outlines operational guidance and engineering constraints for AI coding agents working on `pgwiz/github-canvas`.

## Rules & Constraints
1. **Markdown File Restriction**:
   - Only maintain `readme.md`, `changelog.md`, `memory.md`, and `agent.md` in the repository root. Do not create unrequested arbitrary `.md` documentation files.
2. **Icon & Visual Language**:
   - Use `lucide-react` icons exclusively.
   - Do not insert emojis into button labels, toasts, headings, SVG card generators, or generated Markdown templates.
3. **Canvas & Animation Performance**:
   - In 2D HTML5 canvas components, always reset the transformation matrix before re-scaling on window resize (e.g., `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`).
   - Keep CSS animations subtle and performant (prefer `transform` and `opacity` transitions).
4. **Edge & Serverless Functions**:
   - Functions under `api/` execute in the Vercel Node.js runtime.
   - Functions under `supabase/functions/` execute in Deno. Eslint is configured to ignore `supabase/**` to prevent linting collisions between Deno and Node/Browser environments.
5. **Testing & Validation**:
   - Always run `pnpm run lint` and `pnpm run build` prior to committing. Ensure 0 lint errors and successful Vite production bundling.
