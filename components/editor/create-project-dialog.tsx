"use client";

import { useId } from "react";
import { CircleAlert, TriangleAlert } from "lucide-react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_NAME_MESSAGE } from "@/lib/slug";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Project name input value. */
  name: string;
  onNameChange: (name: string) => void;
  /** Slug derived from `name`, re-rendered on every keystroke. */
  slugPreview: string;
  /** True when the name holds characters the slug cannot keep. */
  hasWarning: boolean;
  /** Message from a rejected submit, shown as an error. `null` when valid. */
  error: string | null;
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
  hasWarning,
  error,
  isSubmitting,
  onSubmit,
}: CreateProjectDialogProps) {
  const formId = useId();
  const inputId = useId();
  const messageId = useId();

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
          aria-invalid={Boolean(error)}
          aria-describedby={error || hasWarning ? messageId : undefined}
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

        {/* A rejected submit outranks the typing warning: same row, same id. */}
        {error ? (
          <p
            id={messageId}
            role="alert"
            className="flex items-start gap-1.5 text-xs text-error"
          >
            <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        ) : hasWarning ? (
          <p
            id={messageId}
            className="flex items-start gap-1.5 text-xs text-warning"
          >
            <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{SUPPORTED_NAME_MESSAGE}</span>
          </p>
        ) : null}
      </form>
    </EditorDialog>
  );
}
