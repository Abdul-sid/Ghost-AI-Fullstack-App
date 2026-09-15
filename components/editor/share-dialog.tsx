"use client";

import { useId } from "react";
import {
  Check,
  Link2,
  Loader2,
  RotateCw,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

import { CollaboratorAvatar } from "@/components/editor/collaborator-avatar";
import { DialogErrorMessage } from "@/components/editor/dialog-error-message";
import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShareDialogActions } from "@/hooks/use-share-dialog";
import type { Collaborator } from "@/types/collaborator";

interface ShareDialogProps {
  projectName: string;
  /**
   * Owners invite, remove, and copy the link; collaborators only see the
   * list. Presentation only — the API enforces ownership itself.
   */
  canManageAccess: boolean;
  /** The `useShareDialog()` result of the workspace. */
  actions: ShareDialogActions;
}

interface CollaboratorRowProps {
  collaborator: Collaborator;
  canManageAccess: boolean;
  removingId: string | null;
  onRemove: (collaborator: Collaborator) => void;
}

function CollaboratorRow({
  collaborator,
  canManageAccess,
  removingId,
  onRemove,
}: CollaboratorRowProps) {
  const { name, email } = collaborator;
  const isRemoving = removingId === collaborator.id;

  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2">
      <CollaboratorAvatar collaborator={collaborator} />

      <div className="min-w-0 flex-1">
        {name ? (
          <>
            <p className="truncate text-sm text-copy-primary" title={name}>
              {name}
            </p>
            <p className="truncate text-xs text-copy-muted" title={email}>
              {email}
            </p>
          </>
        ) : (
          <p className="truncate text-sm text-copy-primary" title={email}>
            {email}
          </p>
        )}
      </div>

      {canManageAccess ? (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-xl text-copy-muted hover:bg-subtle hover:text-error"
          onClick={() => onRemove(collaborator)}
          disabled={removingId !== null}
          aria-label={`Remove ${email}`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserMinus className="h-4 w-4" />
          )}
        </Button>
      ) : null}
    </li>
  );
}

/**
 * Share dialog for an open project. Owners get the invite form, remove
 * buttons, and the copy-link action; collaborators get a read-only list.
 */
export function ShareDialog({
  projectName,
  canManageAccess,
  actions,
}: ShareDialogProps) {
  const {
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
    close,
    reloadCollaborators,
    setInviteEmail,
    submitInvite,
    removeCollaborator,
    copyLink,
  } = actions;

  const inputId = useId();
  const inviteMessageId = useId();
  const listHeadingId = useId();

  return (
    <EditorDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title="Share project"
      description={
        canManageAccess
          ? `Invite collaborators to "${projectName}" by email.`
          : `People with access to "${projectName}". Only the project owner can manage access.`
      }
      footer={
        canManageAccess ? (
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl"
            onClick={() => void copyLink()}
          >
            {isLinkCopied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            <span aria-live="polite">
              {isLinkCopied ? "Copied!" : "Copy link"}
            </span>
          </Button>
        ) : undefined
      }
    >
      {canManageAccess ? (
        <form
          noValidate
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void submitInvite();
          }}
        >
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-copy-secondary"
          >
            Invite by email
          </label>

          <div className="flex gap-2">
            <Input
              id={inputId}
              type="email"
              inputMode="email"
              placeholder="name@example.com"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              disabled={isInviting}
              autoComplete="off"
              aria-invalid={Boolean(inviteError)}
              aria-describedby={inviteError ? inviteMessageId : undefined}
              className="h-9 min-w-0 flex-1 rounded-xl"
            />
            <Button
              type="submit"
              size="lg"
              className="shrink-0 rounded-xl"
              // An invite landing mid-load would be overwritten by the list.
              disabled={isInviting || listStatus === "loading"}
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Invite
            </Button>
          </div>

          {inviteError ? (
            <DialogErrorMessage id={inviteMessageId} message={inviteError} />
          ) : null}
        </form>
      ) : null}

      <section aria-labelledby={listHeadingId} className="flex flex-col gap-2">
        <h3
          id={listHeadingId}
          className="text-sm font-medium text-copy-secondary"
        >
          Collaborators
          {listStatus === "ready" ? (
            <span className="ml-1.5 text-copy-muted">
              {collaborators.length}
            </span>
          ) : null}
        </h3>

        {actionError ? <DialogErrorMessage message={actionError} /> : null}

        {listStatus === "loading" ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-copy-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading collaborators…
          </div>
        ) : null}

        {listStatus === "error" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <DialogErrorMessage
              message={listError ?? "Could not load collaborators."}
            />
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={reloadCollaborators}
            >
              <RotateCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        ) : null}

        {listStatus === "ready" && collaborators.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Users className="h-8 w-8 text-copy-faint" />
            <p className="text-sm text-copy-muted">No collaborators yet.</p>
          </div>
        ) : null}

        {listStatus === "ready" && collaborators.length > 0 ? (
          <ul className="-mx-2 flex max-h-64 flex-col overflow-y-auto">
            {collaborators.map((collaborator) => (
              <CollaboratorRow
                key={collaborator.id}
                collaborator={collaborator}
                canManageAccess={canManageAccess}
                removingId={removingId}
                onRemove={(target) => void removeCollaborator(target)}
              />
            ))}
          </ul>
        ) : null}
      </section>
    </EditorDialog>
  );
}
