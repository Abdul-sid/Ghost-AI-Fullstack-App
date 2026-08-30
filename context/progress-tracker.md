# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Design system setup

## Current Goal

- Implement `context/feature-specs/01-design-system.md`: install and configure shadcn/ui, add UI primitives, set up `cn()` helper, and align theming with `context/ui-context.md`.

## Completed

- Design system & UI primitives (`context/feature-specs/01-design-system.md`): shadcn/ui initialized (`components.json`, style `base-nova`, baseColor `neutral`, RSC + CSS variables); Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea added to `components/ui/`; `lucide-react` installed; `lib/utils.ts` created with `cn()` (clsx + tailwind-merge). `app/globals.css` rewritten so the Ghost AI dark palette from `context/ui-context.md` is the only theme (no `.dark` class, no light `:root`) and is wired both into shadcn's semantic tokens (`background`, `card`, `primary`, `border`, etc.) and into the custom utility names ui-context.md calls out (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, ...). Verified with `tsc --noEmit`, `next build`, and a dev-server render showing `--bg-base: #080809` compiled into the served CSS.

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Theme is dark-only: `app/globals.css` defines the Ghost AI palette once in `:root` (no `.dark` class, no light variant) and maps it onto shadcn's semantic tokens plus the custom utility names in `context/ui-context.md`. New components must consume those tokens (`bg-base`, `text-copy-*`, `border-surface-border`, `text-brand`, etc.) — no raw Tailwind color classes or hardcoded hex values.
- `components/ui/*` are shadcn-generated and should not be hand-edited; extend/wrap them elsewhere if custom behavior is needed.

## Session Notes

- Add context needed to resume work in the next session.
