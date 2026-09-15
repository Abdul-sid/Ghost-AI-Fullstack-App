"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/types/project";

interface EditorHomeProps {
  /** Projects the signed-in user owns, fetched by `app/editor/page.tsx`. */
  ownedProjects: Project[];
  /** Projects shared with the signed-in user, fetched by `app/editor/page.tsx`. */
  sharedProjects: Project[];
}

/**
 * The `/editor` home screen: the editor chrome, the empty state shown when no
 * workspace is open, and the project dialogs.
 */
export function EditorHome({ ownedProjects, sharedProjects }: EditorHomeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectActions = useProjectActions();

  return (
    <div className="flex flex-1 flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={projectActions.openCreateDialog}
        projects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-xl font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>

        <Button
          size="lg"
          className="mt-6 rounded-xl"
          onClick={projectActions.openCreateDialog}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

      <ProjectDialogs actions={projectActions} />
    </div>
  );
}
