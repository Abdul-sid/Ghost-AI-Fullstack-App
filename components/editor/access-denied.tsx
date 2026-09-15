import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shown in place of a workspace the caller cannot open. Missing and
 * unauthorized projects render the same screen so a project's existence is
 * never revealed.
 */
export function AccessDenied() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-base px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface">
        <Lock className="h-8 w-8 text-copy-muted" />
      </div>

      <h1 className="mt-5 font-heading text-xl font-medium text-copy-primary">
        You don&apos;t have access to this project
      </h1>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-copy-muted">
        It may have been deleted, or it hasn&apos;t been shared with you.
      </p>

      <Link
        href="/editor"
        className={cn(buttonVariants({ size: "lg" }), "mt-6 rounded-xl")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>
    </main>
  );
}
