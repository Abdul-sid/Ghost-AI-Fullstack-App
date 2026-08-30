"use client";

import { useCallback, useMemo, useState } from "react";

import {
  hasUnsupportedCharacters,
  slugifyProjectName,
  SUPPORTED_NAME_MESSAGE,
} from "@/lib/slug";
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
  /**
   * Whether `name` holds characters the slug cannot keep — true while the
   * create dialog should be warning the user.
   */
  hasNameWarning: boolean;
  /**
   * Validation message raised by a rejected submit, or `null`. Cleared as soon
   * as the name changes again.
   */
  nameError: string | null;
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
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = useCallback(() => {
    setOpenDialog(null);
    setTargetProject(null);
    setName("");
    setNameError(null);
    setIsSubmitting(false);
  }, []);

  /** Typing always clears a previous submit error — the name just changed. */
  const updateName = useCallback((next: string) => {
    setName(next);
    setNameError(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setTargetProject(null);
    setName("");
    setNameError(null);
    setOpenDialog("create");
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName(project.name);
    setNameError(null);
    setOpenDialog("rename");
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName("");
    setNameError(null);
    setOpenDialog("delete");
  }, []);

  const slugPreview = useMemo(() => slugifyProjectName(name), [name]);

  const hasNameWarning = useMemo(() => hasUnsupportedCharacters(name), [name]);

  /**
   * Create is the only flow that validates the name, because it is the only
   * one that derives a slug from it — rename edits the display name and leaves
   * the room ID alone (`context/feature-specs/07-wire-editor-home.md`).
   */
  const submitCreate = useCallback(() => {
    if (hasNameWarning) {
      setNameError(SUPPORTED_NAME_MESSAGE);
      return;
    }

    closeDialog();
  }, [closeDialog, hasNameWarning]);

  return {
    openDialog,
    targetProject,
    name,
    slugPreview,
    hasNameWarning,
    nameError,
    isSubmitting,
    setName: updateName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename: closeDialog,
    submitDelete: closeDialog,
  };
}
