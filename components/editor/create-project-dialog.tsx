"use client";

import { useId } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Project name input value. */
  name: string;
  onNameChange: (name: string) => void;
  /** Slug derived from `name`, re-rendered on every keystroke. */
  slugPreview: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/** Create Project dialog: a name input with a live slug preview. */
export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  slugPreview,
  isSubmitting,
  onSubmit,
}: CreateProjectDialogProps) {
  const formId = useId();
  const inputId = useId();

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New project"
      description="Name your workspace. You can rename it later."
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
            Create project
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
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Payments Platform"
          autoComplete="off"
          className="h-9 rounded-xl"
        />

        <p className="flex items-baseline gap-2 text-xs text-copy-muted">
          <span>Slug preview</span>
          <span className="truncate font-mono text-copy-secondary empty:hidden">
            {slugPreview}
          </span>
          {slugPreview ? null : (
            <span className="font-mono text-copy-faint">your-project-name</span>
          )}
        </p>
      </form>
    </EditorDialog>
  );
}
