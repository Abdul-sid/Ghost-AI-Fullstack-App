"use client";

import { FolderOpen, Plus, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  /** Whether the sidebar is visible. */
  isOpen: boolean;
  /** Closes the sidebar. */
  onClose: () => void;
  /** Invoked by the bottom `New Project` button. */
  onNewProject?: () => void;
  className?: string;
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}

function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <Icon className="h-8 w-8 text-copy-faint" />
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  );
}

/**
 * Floating project sidebar. It overlays the editor canvas rather than
 * occupying layout space, so opening it never pushes page content.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-label="Projects"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed top-16 bottom-3 left-3 z-40 flex w-72 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/90 backdrop-blur-md transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        className
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-surface-border px-3">
        <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-xl text-copy-muted hover:bg-subtle hover:text-copy-primary"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="mine" className="min-h-0 flex-1 gap-0">
        <TabsList className="mx-3 mt-3 w-[calc(100%-1.5rem)] bg-subtle">
          <TabsTrigger value="mine">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="flex min-h-0 flex-col">
          <ScrollArea className="min-h-0 flex-1">
            <EmptyState icon={FolderOpen} message="No projects yet." />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="shared" className="flex min-h-0 flex-col">
          <ScrollArea className="min-h-0 flex-1">
            <EmptyState icon={Users} message="No shared projects yet." />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-surface-border p-3">
        <Button className="w-full rounded-xl" onClick={onNewProject}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
