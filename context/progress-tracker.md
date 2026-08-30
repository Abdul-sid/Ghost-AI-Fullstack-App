# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor chrome (complete) → auth next

## Current Goal

- `context/feature-specs/02-editor-chrome.md` is implemented. Next: `context/feature-specs/03-auth.md`.

## Completed

- Design system & UI primitives (`context/feature-specs/01-design-system.md`): shadcn/ui initialized (`components.json`, style `base-nova`, baseColor `neutral`, RSC + CSS variables); Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea added to `components/ui/`; `lucide-react` installed; `lib/utils.ts` created with `cn()` (clsx + tailwind-merge). `app/globals.css` rewritten so the Ghost AI dark palette from `context/ui-context.md` is the only theme (no `.dark` class, no light `:root`) and is wired both into shadcn's semantic tokens (`background`, `card`, `primary`, `border`, etc.) and into the custom utility names ui-context.md calls out (`bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, ...). Verified with `tsc --noEmit`, `next build`, and a dev-server render showing `--bg-base: #080809` compiled into the served CSS.
- Editor chrome (`context/feature-specs/02-editor-chrome.md`): `components/editor/editor-navbar.tsx` — `h-14` top bar, `border-b border-surface-border bg-base`, three equal flex sections (left holds the sidebar toggle using `PanelLeftClose` when open / `PanelLeftOpen` when closed; center and right are empty placeholders for later chapters). `components/editor/project-sidebar.tsx` — floating overlay (`fixed top-16 bottom-3 left-3 z-40 w-72`, `rounded-2xl`, `bg-surface/90` + backdrop blur) that slides in from the left via `translate-x` and never occupies layout space, with a `Projects` header + close button, shadcn `Tabs` (`My Projects` / `Shared`) whose panels each show a muted `h-8 w-8` icon empty state, and a full-width `New Project` button with a `Plus` icon pinned at the bottom. `components/editor/editor-dialog.tsx` — reusable dialog shell over `components/ui/dialog` taking `open`/`onOpenChange`/`title`/`description`/`footer`/`children`, styled with the Ghost AI tokens (`rounded-3xl`, `bg-elevated`, `border-surface-border`, `text-copy-primary`/`text-copy-muted`); no concrete dialogs built yet. Verified with `tsc --noEmit`, `next build`, and a temporary smoke route rendered against `next dev` (navbar, sidebar tabs, empty state, and `New Project` button all rendered; `bg-surface/90`, `text-copy-faint`, `border-surface-border` confirmed present in the compiled CSS) — the smoke route was removed afterwards.

## In Progress

- None.

## Next Up

- `context/feature-specs/03-auth.md`.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Editor chrome components live in `components/editor/` and are presentational shells: they take state (`isSidebarOpen`, `isOpen`, `open`) and callbacks from their parent and hold no state of their own, so later chapters can own project/dialog state without rewriting them.
- The project sidebar is an overlay (`fixed`, `z-40`), never a layout column — opening it must not resize or push the canvas.
- Editor dialogs are composed through `EditorDialog` rather than by using `components/ui/dialog` directly, so the modal styling (`rounded-3xl`, elevated surface, token colors) stays defined in one place.
- Theme is dark-only: `app/globals.css` defines the Ghost AI palette once in `:root` (no `.dark` class, no light variant) and maps it onto shadcn's semantic tokens plus the custom utility names in `context/ui-context.md`. New components must consume those tokens (`bg-base`, `text-copy-*`, `border-surface-border`, `text-brand`, etc.) — no raw Tailwind color classes or hardcoded hex values.
- `components/ui/*` are shadcn-generated and should not be hand-edited; extend/wrap them elsewhere if custom behavior is needed.

## Session Notes

- `EditorNavbar`'s center and right sections are intentionally empty; `context/feature-specs/08-editor-workspace-shell.md` fills them with the project name, share button, and AI sidebar toggle.
- `ProjectSidebar` renders placeholder empty states only. Project lists, per-item rename/delete actions, and the mobile backdrop arrive in `context/feature-specs/04-project-dialogs.md`.
- `EditorDialog` is unused so far by design — `04-project-dialogs.md` is the first consumer (create / rename / delete).
- Pre-existing lint warning unrelated to this unit: unused `Button` import in `app/page.tsx`.
