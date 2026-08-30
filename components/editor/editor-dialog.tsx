"use client";

import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  /** Action buttons rendered in the dialog footer. */
  footer?: ReactNode;
  /** Dialog body. Optional — confirmation dialogs need none. */
  children?: ReactNode;
  /**
   * Element focused when the dialog opens, forwarded to the dialog popup.
   * Defaults to the popup's own focus handling when omitted.
   */
  initialFocus?: ComponentProps<typeof DialogContent>["initialFocus"];
  className?: string;
}

/**
 * Shared dialog shell for the editor: title, optional description, body, and
 * footer actions, styled with the Ghost AI tokens from `globals.css`.
 */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  initialFocus,
  className,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        initialFocus={initialFocus}
        className={cn(
          "rounded-3xl border border-surface-border bg-elevated text-copy-primary ring-0 sm:max-w-md",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        {footer ? (
          <DialogFooter className="rounded-b-3xl border-surface-border bg-surface/60">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
