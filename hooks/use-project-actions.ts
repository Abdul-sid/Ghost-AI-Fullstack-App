"use client";

import { useCallback, useMemo, useState } from "react";

import { slugifyProjectName } from "@/lib/slug";
import type { Project } from "@/types/project";

/** Which project dialog is currently open, if any. */
export type ProjectDialogKind = "create" | "rename" | "delete";

export interface ProjectActions {
  /** The open dialog, or `null` when every dialog is closed. */
  openDialog: ProjectDialogKind | null;
  /** The project the rename/delete dialogs act on. `null` for create. */
  targetProject: Project | null;
  /** Project name input value, shared by the create and rename dialogs. */
  name: string;
  /** Live slug derived from `name`, shown as a preview in the create dialog. */
  slugPreview: string;
  /** Whether a submit is in flight — dialogs disable their actions while true. */
  isSubmitting: boolean;
  setName: (name: string) => void;
  openCreateDialog: () => void;
  openRenameDialog: (project: Project) => void;
  openDeleteDialog: (project: Project) => void;
  closeDialog: () => void;
  submitCreate: () => void;
  submitRename: () => void;
  submitDelete: () => void;
}

/**
 * Owns the editor's project dialog state: which dialog is open, the shared form
 * state behind the create/rename inputs, and the submit-in-flight flag.
 *
 * `context/feature-specs/04-project-dialogs.md` scopes this to UI state only —
 * the submit handlers close their dialog and nothing else. The API calls,
 * navigation, and router refreshes hang off those three handlers in
 * `context/feature-specs/07-wire-editor-home.md`.
 */
export function useProjectActions(): ProjectActions {
  const [openDialog, setOpenDialog] = useState<ProjectDialogKind | null>(null);
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = useCallback(() => {
    setOpenDialog(null);
    setTargetProject(null);
    setName("");
    setIsSubmitting(false);
  }, []);

  const openCreateDialog = useCallback(() => {
    setTargetProject(null);
    setName("");
    setOpenDialog("create");
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName(project.name);
    setOpenDialog("rename");
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName("");
    setOpenDialog("delete");
  }, []);

  const slugPreview = useMemo(() => slugifyProjectName(name), [name]);

  return {
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
    submitCreate: closeDialog,
    submitRename: closeDialog,
    submitDelete: closeDialog,
  };
}
