"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorNavbarProps {
  /** Whether the project sidebar is currently open. */
  isSidebarOpen: boolean;
  /** Toggles the project sidebar. */
  onToggleSidebar: () => void;
  className?: string;
}

/** Fixed-height top bar shared by every editor screen. */
export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
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
      <div className="flex flex-1 items-center justify-center" />

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <UserButton />
      </div>
    </header>
  );
}
