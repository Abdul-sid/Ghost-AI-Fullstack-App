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
import { MOCK_OWNED_PROJECTS, MOCK_SHARED_PROJECTS } from "@/lib/mock-projects";

/**
 * The `/editor` home screen: the editor chrome, the empty state shown when no
 * workspace is open, and the project dialogs.
 *
 * Project lists are still mock data —
 * `context/feature-specs/07-wire-editor-home.md` replaces them with lists
 * fetched by the server component in `app/editor/page.tsx`.
 */
export function EditorHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectActions = useProjectActions();

  const {
    openDialog,
    targetProject,
    name,
    slugPreview,
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

  /** Dialogs only ever close from the inside — opening goes through the hook. */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
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
        projects={MOCK_OWNED_PROJECTS}
        sharedProjects={MOCK_SHARED_PROJECTS}
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
        slugPreview={slugPreview}
        isSubmitting={isSubmitting}
        onSubmit={submitCreate}
      />

      <RenameProjectDialog
        open={openDialog === "rename"}
        onOpenChange={handleOpenChange}
        project={targetProject}
        name={name}
        onNameChange={setName}
        isSubmitting={isSubmitting}
        onSubmit={submitRename}
      />

      <DeleteProjectDialog
        open={openDialog === "delete"}
        onOpenChange={handleOpenChange}
        project={targetProject}
        isSubmitting={isSubmitting}
        onSubmit={submitDelete}
      />
    </div>
  );
}
