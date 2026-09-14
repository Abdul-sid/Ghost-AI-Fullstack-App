"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  createProject,
  deleteProject,
  renameProject,
} from "@/lib/project-requests";
import { buildRoomId, createRoomIdSuffix } from "@/lib/room-id";
import {
  hasUnsupportedCharacters,
  NAME_NEEDS_SLUG_MESSAGE,
  slugifyProjectName,
  SUPPORTED_NAME_MESSAGE,
} from "@/lib/slug";
import type { Project } from "@/types/project";

/** Which project dialog is currently open, if any. */
export type ProjectDialogKind = "create" | "rename" | "delete";

const RENAME_NEEDS_NAME_MESSAGE = "Enter a project name.";

export interface ProjectActions {
  /** The open dialog, or `null` when every dialog is closed. */
  openDialog: ProjectDialogKind | null;
  /** The project the rename/delete dialogs act on. `null` for create. */
  targetProject: Project | null;
  /** Project name input value, shared by the create and rename dialogs. */
  name: string;
  /**
   * The room ID the create dialog will submit — slugified name plus the
   * dialog's unique suffix. Empty while the name has no slug.
   */
  roomIdPreview: string;
  /**
   * Whether `name` holds characters the slug cannot keep — true while the
   * create dialog should be warning the user.
   */
  hasNameWarning: boolean;
  /**
   * Message from a rejected submit — a validation failure or an API error —
   * or `null`. Cleared as soon as the name changes again.
   */
  error: string | null;
  /** Whether a submit is in flight — dialogs disable their actions while true. */
  isSubmitting: boolean;
  setName: (name: string) => void;
  openCreateDialog: () => void;
  openRenameDialog: (project: Project) => void;
  openDeleteDialog: (project: Project) => void;
  closeDialog: () => void;
  submitCreate: () => Promise<void>;
  submitRename: () => Promise<void>;
  submitDelete: () => Promise<void>;
}

/**
 * Owns the editor's project dialog state and the project mutations behind
 * them: create (then open the new workspace), rename (then refresh), and
 * delete (then leave the workspace if it was the open one, else refresh).
 */
export function useProjectActions(): ProjectActions {
  const router = useRouter();
  const params = useParams();
  const activeRoomId = typeof params.roomId === "string" ? params.roomId : null;

  const [openDialog, setOpenDialog] = useState<ProjectDialogKind | null>(null);
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [roomIdSuffix, setRoomIdSuffix] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = useCallback(() => {
    setOpenDialog(null);
    setTargetProject(null);
    setName("");
    setError(null);
    setIsSubmitting(false);
  }, []);

  /** Typing always clears a previous submit error — the name just changed. */
  const updateName = useCallback((next: string) => {
    setName(next);
    setError(null);
  }, []);

  /** Each create dialog gets a fresh suffix, fixed while it stays open. */
  const openCreateDialog = useCallback(() => {
    setTargetProject(null);
    setName("");
    setRoomIdSuffix(createRoomIdSuffix());
    setError(null);
    setOpenDialog("create");
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName(project.name);
    setError(null);
    setOpenDialog("rename");
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    setTargetProject(project);
    setName("");
    setError(null);
    setOpenDialog("delete");
  }, []);

  const slug = useMemo(() => slugifyProjectName(name), [name]);

  const roomIdPreview = useMemo(
    () => (slug ? buildRoomId(name, roomIdSuffix) : ""),
    [name, roomIdSuffix, slug],
  );

  const hasNameWarning = useMemo(() => hasUnsupportedCharacters(name), [name]);

  /**
   * Create is the only flow that validates the name against the slug, because
   * it is the only one that derives an ID from it — rename edits the display
   * name and leaves the room ID alone.
   *
   * Two ways a name fails. Unsupported characters are reported first, since
   * that message is the more specific of the two. An empty slug is the catch
   * for names built only from characters the slug trims — blank, whitespace,
   * or hyphens — which pass the character check but leave nothing to derive a
   * room ID from.
   *
   * The submitted ID is exactly the previewed one, so the project ID, the URL,
   * and the Liveblocks room stay aligned. On an ID collision a new suffix is
   * drawn so the next attempt can succeed.
   */
  const submitCreate = useCallback(async () => {
    if (isSubmitting) return;

    if (hasNameWarning) {
      setError(SUPPORTED_NAME_MESSAGE);
      return;
    }

    if (roomIdPreview === "") {
      setError(NAME_NEEDS_SLUG_MESSAGE);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await createProject(name, roomIdPreview);

    if (!result.ok) {
      if (result.status === 409) {
        setRoomIdSuffix(createRoomIdSuffix());
      }

      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    closeDialog();
    router.push(`/editor/${roomIdPreview}`);
  }, [closeDialog, hasNameWarning, isSubmitting, name, roomIdPreview, router]);

  const submitRename = useCallback(async () => {
    if (!targetProject || isSubmitting) return;

    if (name.trim() === "") {
      setError(RENAME_NEEDS_NAME_MESSAGE);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await renameProject(targetProject.id, name);

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    closeDialog();
    router.refresh();
  }, [closeDialog, isSubmitting, name, router, targetProject]);

  const submitDelete = useCallback(async () => {
    if (!targetProject || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const result = await deleteProject(targetProject.id);

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    closeDialog();

    // The open workspace no longer exists, so staying on its URL is a dead end.
    if (targetProject.roomId === activeRoomId) {
      router.replace("/editor");
    } else {
      router.refresh();
    }
  }, [activeRoomId, closeDialog, isSubmitting, router, targetProject]);

  return {
    openDialog,
    targetProject,
    name,
    roomIdPreview,
    hasNameWarning,
    error,
    isSubmitting,
    setName: updateName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
