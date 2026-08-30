import { FileText, Ghost, Share2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
] as const;

interface AuthShellProps {
  /** The Clerk form rendered in the right panel. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Two-panel frame for the sign-in and sign-up pages.
 *
 * From `lg` up the viewport splits 50/50: the left half is a raised surface
 * carrying the wordmark, headline, and feature list; the right half is the base
 * background with the centered Clerk form. Below `lg` the left half is dropped
 * and only the form remains.
 */
export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <main className={cn("flex min-h-screen flex-1 bg-base", className)}>
      <section className="relative hidden w-1/2 flex-col border-r border-surface-border bg-surface px-14 py-12 lg:flex">
        {/* Flat brand wash that separates this half from the base background. */}
        <div
          className="pointer-events-none absolute inset-0 bg-accent-dim opacity-25"
          aria-hidden
        />

        <div className="relative flex flex-1 flex-col">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <Ghost className="h-5 w-5 text-base" aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight text-copy-primary">
              Ghost AI
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-16">
            <h1 className="max-w-md font-heading text-4xl leading-tight font-semibold tracking-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-copy-muted">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>

            <ul className="mt-12 space-y-7">
              {features.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim">
                    <Icon className="h-4 w-4 text-brand" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <h2 className="font-heading text-sm font-medium text-copy-primary">
                      {title}
                    </h2>
                    <p className="text-sm leading-relaxed text-copy-muted">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-copy-faint">
            © {new Date().getFullYear()} Ghost AI. All rights reserved.
          </p>
        </div>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {children}
      </section>
    </main>
  );
}
