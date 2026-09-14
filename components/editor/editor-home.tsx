"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
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

  const {
    openDialog,
    targetProject,
    name,
    roomIdPreview,
    hasNameWarning,
    error,
    isSubmitting,
    setName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = projectActions;

  /**
   * Dialogs only ever close from the inside — opening goes through the hook.
   * A request in flight holds its dialog open so its outcome stays visible.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      closeDialog();
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreateDialog}
        projects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-xl font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>

        <Button size="lg" className="mt-6 rounded-xl" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

      <CreateProjectDialog
        open={openDialog === "create"}
        onOpenChange={handleOpenChange}
        name={name}
        onNameChange={setName}
        roomIdPreview={roomIdPreview}
        hasWarning={hasNameWarning}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={submitCreate}
      />

      <RenameProjectDialog
        open={openDialog === "rename"}
        onOpenChange={handleOpenChange}
        project={targetProject}
        name={name}
        onNameChange={setName}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={submitRename}
      />

      <DeleteProjectDialog
        open={openDialog === "delete"}
        onOpenChange={handleOpenChange}
        project={targetProject}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={submitDelete}
      />
    </div>
  );
}
