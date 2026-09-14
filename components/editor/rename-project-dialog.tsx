"use client";

import { useId, useRef } from "react";

import { DialogErrorMessage } from "@/components/editor/dialog-error-message";
import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/project";

interface RenameProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The project being renamed. `null` while the dialog is closed. */
  project: Project | null;
  /** Project name input value, prefilled with the current name on open. */
  name: string;
  onNameChange: (name: string) => void;
  /** Message from a rejected submit, shown as an error. `null` otherwise. */
  error: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * Rename Project dialog: a prefilled name input that auto-focuses on open and
 * submits on Enter.
 */
export function RenameProjectDialog({
  open,
  onOpenChange,
  project,
  name,
  onNameChange,
  error,
  isSubmitting,
  onSubmit,
}: RenameProjectDialogProps) {
  const formId = useId();
  const inputId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      initialFocus={inputRef}
      title="Rename project"
      description={
        project ? `Currently named "${project.name}".` : "Choose a new name."
      }
      footer={
        <>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            size="lg"
            className="rounded-xl"
            disabled={isSubmitting}
          >
            Save changes
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-copy-secondary"
        >
          Project name
        </label>

        <Input
          id={inputId}
          ref={inputRef}
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          className="h-9 rounded-xl"
        />

        {error ? <DialogErrorMessage id={messageId} message={error} /> : null}
      </form>
    </EditorDialog>
  );
}
