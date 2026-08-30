import { dark } from "@clerk/ui/themes";

/**
 * Clerk appearance for every Clerk component in the app.
 *
 * Clerk's `dark` theme is the base; every colour is overridden with the Ghost AI
 * CSS custom properties defined in `app/globals.css`, so Clerk's UI stays in sync
 * with the rest of the app and no colour is hardcoded here.
 */
export const clerkAppearance = {
  theme: dark,
  variables: {
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorNeutral: "var(--text-primary)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    colorShadow: "var(--bg-base)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorModalBackdrop: "color-mix(in srgb, var(--bg-base), transparent 30%)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    borderRadius: "0.75rem",
  },
} as const;
