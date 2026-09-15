"use client";

import {
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Navbar content that only exists inside an open project workspace. */
export interface WorkspaceNavbarProps {
  /** Name of the open project, shown in the center of the bar. */
  projectName: string;
  /** Whether the AI sidebar is currently open. */
  isAiSidebarOpen: boolean;
  /** Toggles the AI sidebar. */
  onToggleAiSidebar: () => void;
}

interface EditorNavbarProps {
  /** Whether the project sidebar is currently open. */
  isSidebarOpen: boolean;
  /** Toggles the project sidebar. */
  onToggleSidebar: () => void;
  /** Present on `/editor/[roomId]`; the editor home omits it. */
  workspace?: WorkspaceNavbarProps;
  className?: string;
}

/** Fixed-height top bar shared by every editor screen. */
export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  workspace,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-base px-3",
        className
      )}
    >
      {/* Left */}
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          onClick={onToggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Center */}
      <div className="flex min-w-0 flex-1 items-center justify-center">
        {workspace ? (
          <h1
            className="truncate text-sm font-medium text-copy-primary"
            title={workspace.projectName}
          >
            {workspace.projectName}
          </h1>
        ) : null}
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-2">
        {workspace ? (
          <>
            {/* Sharing behavior arrives with `09-share-dialog.md`. */}
            <Button
              variant="outline"
              className="rounded-xl border-surface-border text-copy-secondary hover:bg-subtle hover:text-copy-primary"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl hover:bg-subtle",
                workspace.isAiSidebarOpen
                  ? "bg-subtle text-ai-text"
                  : "text-copy-secondary hover:text-copy-primary"
              )}
              onClick={workspace.onToggleAiSidebar}
              aria-expanded={workspace.isAiSidebarOpen}
              aria-label={
                workspace.isAiSidebarOpen
                  ? "Close AI sidebar"
                  : "Open AI sidebar"
              }
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </>
        ) : null}

        <UserButton />
      </div>
    </header>
  );
}
