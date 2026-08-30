"use client";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The project being deleted. `null` while the dialog is closed. */
  project: Project | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/** Delete Project dialog: a destructive confirmation with no input. */
export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  isSubmitting,
  onSubmit,
}: DeleteProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete project"
      description={
        project
          ? `"${project.name}" will be permanently deleted. This cannot be undone.`
          : "This project will be permanently deleted. This cannot be undone."
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
            variant="destructive"
            size="lg"
            className="rounded-xl"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            Delete project
          </Button>
        </>
      }
    />
  );
}
