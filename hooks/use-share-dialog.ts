"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { INVALID_EMAIL_MESSAGE, isValidEmail } from "@/lib/collaborator-input";
import {
  inviteCollaborator,
  listCollaborators,
  removeCollaborator as removeCollaboratorRequest,
} from "@/lib/collaborator-requests";
import type { Collaborator } from "@/types/collaborator";
import type { Project } from "@/types/project";

/** How long the copy-link button reads `Copied!` after a successful copy. */
const COPIED_FEEDBACK_MS = 2000;

const COPY_FAILED_MESSAGE =
  "Could not copy the link. Copy it from the address bar instead.";

export type CollaboratorListStatus = "loading" | "ready" | "error";

export interface ShareDialogActions {
  isOpen: boolean;
  collaborators: Collaborator[];
  listStatus: CollaboratorListStatus;
  /** Why the collaborator list failed to load. `null` unless `listStatus` is `error`. */
  listError: string | null;
  /** Email input value of the invite form. */
  inviteEmail: string;
  /** Validation or API message from a rejected invite. Cleared on typing. */
  inviteError: string | null;
  isInviting: boolean;
  /** ID of the collaborator whose removal is in flight, if any. */
  removingId: string | null;
  /** Message from a failed removal or copy. */
  actionError: string | null;
  /** Whether the copy-link button should currently read `Copied!`. */
  isLinkCopied: boolean;
  open: () => void;
  close: () => void;
  reloadCollaborators: () => void;
  setInviteEmail: (email: string) => void;
  submitInvite: () => Promise<void>;
  removeCollaborator: (collaborator: Collaborator) => Promise<void>;
  copyLink: () => Promise<void>;
}

/**
 * Owns the share dialog: loads the collaborator list each time the dialog
 * opens, invites and removes collaborators, and copies the project link.
 *
 * Every open starts a new session. Responses that arrive after the dialog was
 * closed (or reopened) belong to an old session and are dropped, so a slow
 * request can never write into a dialog it did not start in.
 *
 * Invite and remove are only offered to owners by the UI, but the API enforces
 * ownership on its own — this hook is not the access check.
 */
export function useShareDialog(project: Project): ShareDialogActions {
  const { id: projectId, roomId } = project;

  const sessionRef = useRef(0);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [listStatus, setListStatus] =
    useState<CollaboratorListStatus>("loading");
  const [listError, setListError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmailValue] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const clearCopiedTimer = useCallback(() => {
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearCopiedTimer, [clearCopiedTimer]);

  const loadCollaborators = useCallback(
    async (session: number) => {
      setListStatus("loading");
      setListError(null);

      const result = await listCollaborators(projectId);

      if (session !== sessionRef.current) return;

      if (!result.ok) {
        setListError(result.error);
        setListStatus("error");
        return;
      }

      setCollaborators(result.collaborators);
      setListStatus("ready");
    },
    [projectId],
  );

  const open = useCallback(() => {
    const session = ++sessionRef.current;

    clearCopiedTimer();
    setCollaborators([]);
    setInviteEmailValue("");
    setInviteError(null);
    setIsInviting(false);
    setRemovingId(null);
    setActionError(null);
    setIsLinkCopied(false);
    setIsOpen(true);

    void loadCollaborators(session);
  }, [clearCopiedTimer, loadCollaborators]);

  /** Content is left in place so the closing animation does not flash empty. */
  const close = useCallback(() => {
    sessionRef.current += 1;
    clearCopiedTimer();
    setIsOpen(false);
  }, [clearCopiedTimer]);

  const reloadCollaborators = useCallback(() => {
    void loadCollaborators(sessionRef.current);
  }, [loadCollaborators]);

  const setInviteEmail = useCallback((email: string) => {
    setInviteEmailValue(email);
    setInviteError(null);
  }, []);

  const submitInvite = useCallback(async () => {
    if (isInviting) return;

    if (!isValidEmail(inviteEmail)) {
      setInviteError(INVALID_EMAIL_MESSAGE);
      return;
    }

    const session = sessionRef.current;

    setInviteError(null);
    setActionError(null);
    setIsInviting(true);

    const result = await inviteCollaborator(projectId, inviteEmail);

    if (session !== sessionRef.current) return;

    setIsInviting(false);

    if (!result.ok) {
      setInviteError(result.error);
      return;
    }

    setCollaborators((current) => [
      ...current.filter(({ id }) => id !== result.collaborator.id),
      result.collaborator,
    ]);
    setInviteEmailValue("");
  }, [inviteEmail, isInviting, projectId]);

  const removeCollaborator = useCallback(
    async (collaborator: Collaborator) => {
      if (removingId) return;

      const session = sessionRef.current;

      setActionError(null);
      setRemovingId(collaborator.id);

      const result = await removeCollaboratorRequest(
        projectId,
        collaborator.id,
      );

      if (session !== sessionRef.current) return;

      setRemovingId(null);

      if (!result.ok) {
        setActionError(result.error);
        return;
      }

      setCollaborators((current) =>
        current.filter(({ id }) => id !== collaborator.id),
      );
    },
    [projectId, removingId],
  );

  const copyLink = useCallback(async () => {
    const session = sessionRef.current;
    const link = `${window.location.origin}/editor/${roomId}`;

    try {
      // `navigator.clipboard` is missing outside secure contexts; the throw
      // lands in the same catch as a denied permission.
      await navigator.clipboard.writeText(link);
    } catch {
      if (session === sessionRef.current) {
        setActionError(COPY_FAILED_MESSAGE);
      }
      return;
    }

    if (session !== sessionRef.current) return;

    setActionError(null);
    setIsLinkCopied(true);
    clearCopiedTimer();
    copiedTimerRef.current = setTimeout(() => {
      copiedTimerRef.current = null;
      setIsLinkCopied(false);
    }, COPIED_FEEDBACK_MS);
  }, [clearCopiedTimer, roomId]);

  return {
    isOpen,
    collaborators,
    listStatus,
    listError,
    inviteEmail,
    inviteError,
    isInviting,
    removingId,
    actionError,
    isLinkCopied,
    open,
    close,
    reloadCollaborators,
    setInviteEmail,
    submitInvite,
    removeCollaborator,
    copyLink,
  };
}
