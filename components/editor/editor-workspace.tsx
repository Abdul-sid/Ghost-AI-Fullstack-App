"use client";

import { useState } from "react";
import { Sparkles, SquareDashed, X } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import { useShareDialog } from "@/hooks/use-share-dialog";
import type { ProjectRole } from "@/lib/project-access";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface EditorWorkspaceProps {
  /** The open project, already access-checked by `app/editor/[roomId]/page.tsx`. */
  project: Project;
  /** The signed-in user's role on `project`, decided on the server. */
  role: ProjectRole;
  /** Projects the signed-in user owns. */
  ownedProjects: Project[];
  /** Projects shared with the signed-in user. */
  sharedProjects: Project[];
}

/**
 * The `/editor/[roomId]` workspace shell: navbar, project sidebar with the
 * current room highlighted, the canvas area, and the AI sidebar. The canvas
 * and AI sidebar are placeholders until their own chapters.
 */
export function EditorWorkspace({
  project,
  role,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const projectActions = useProjectActions();
  const shareDialog = useShareDialog(project);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        workspace={{
          projectName: project.name,
          isAiSidebarOpen,
          onToggleAiSidebar: () => setIsAiSidebarOpen((open) => !open),
          onOpenShare: shareDialog.open,
        }}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={projectActions.openCreateDialog}
        projects={ownedProjects}
        sharedProjects={sharedProjects}
        activeRoomId={project.roomId}
        onRenameProject={projectActions.openRenameDialog}
        onDeleteProject={projectActions.openDeleteDialog}
      />

      {/* Canvas placeholder — fills everything below the navbar. */}
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center bg-base px-6 text-center">
        <SquareDashed className="h-8 w-8 text-copy-faint" />
        <p className="mt-3 text-sm font-medium text-copy-secondary">
          Canvas coming soon
        </p>
        <p className="mt-1 max-w-sm text-sm text-copy-muted">
          The collaborative canvas for {project.name} will appear here.
        </p>
      </main>

      {/* AI sidebar placeholder — floats over the canvas from the right. */}
      <aside
        aria-label="AI assistant"
        aria-hidden={!isAiSidebarOpen}
        inert={!isAiSidebarOpen}
        className={cn(
          "fixed top-16 right-3 bottom-3 z-40 flex w-80 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/90 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
          isAiSidebarOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-surface-border px-3">
          <h2 className="flex items-center gap-2 text-sm font-medium text-copy-primary">
            <Sparkles className="h-4 w-4 text-ai-text" />
            AI Assistant
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-xl text-copy-muted hover:bg-subtle hover:text-copy-primary"
            onClick={() => setIsAiSidebarOpen(false)}
            aria-label="Close AI sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <Sparkles className="h-8 w-8 text-copy-faint" />
          <p className="text-sm text-copy-muted">AI chat is coming soon.</p>
        </div>
      </aside>

      <ProjectDialogs actions={projectActions} />

      <ShareDialog
        projectName={project.name}
        canManageAccess={role === "owner"}
        actions={shareDialog}
      />
    </div>
  );
}
