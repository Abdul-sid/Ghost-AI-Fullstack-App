"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";

/**
 * The `/editor` home screen: the editor chrome plus the empty state shown when
 * no workspace is open.
 *
 * This is the client boundary for the editor home — it owns the sidebar's open
 * state and is where `context/feature-specs/04-project-dialogs.md` adds the
 * project dialogs and their state hook.
 */
export function EditorHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-xl font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>

        <Button size="lg" className="mt-6 rounded-xl">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>
    </div>
  );
}
