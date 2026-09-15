"use client";

import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import type { ProjectActions } from "@/hooks/use-project-actions";

interface ProjectDialogsProps {
  /** The `useProjectActions()` result of the screen rendering the dialogs. */
  actions: ProjectActions;
}

/**
 * The create, rename, and delete project dialogs, wired to one
 * `useProjectActions()` instance. Shared by the editor home and the workspace.
 */
export function ProjectDialogs({ actions }: ProjectDialogsProps) {
  const {
    openDialog,
    targetProject,
    name,
    roomIdPreview,
    hasNameWarning,
    error,
    isSubmitting,
    setName,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = actions;

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
    <>
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
    </>
  );
}
