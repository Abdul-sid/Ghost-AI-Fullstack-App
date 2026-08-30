"use client";

import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  /** Whether the sidebar is visible. */
  isOpen: boolean;
  /** Closes the sidebar. */
  onClose: () => void;
  /** Invoked by the bottom `New Project` button. */
  onNewProject?: () => void;
  /** Projects owned by the current user. Rename/delete are offered on these. */
  projects?: Project[];
  /** Projects shared with the current user. Rendered without item actions. */
  sharedProjects?: Project[];
  onRenameProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
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

interface ProjectListItemProps {
  project: Project;
  /** Owned projects get rename/delete; shared projects get neither. */
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

function ProjectListItem({ project, onRename, onDelete }: ProjectListItemProps) {
  const hasActions = Boolean(onRename || onDelete);

  return (
    <li className="group/item flex items-center gap-1 rounded-xl px-2 py-1.5 transition-colors hover:bg-subtle">
      <span className="min-w-0 flex-1 truncate text-sm text-copy-secondary">
        {project.name}
      </span>

      {hasActions ? (
        <div className="flex shrink-0 items-center gap-0.5 transition-opacity sm:opacity-0 sm:group-focus-within/item:opacity-100 sm:group-hover/item:opacity-100">
          {onRename ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-lg text-copy-muted hover:bg-elevated hover:text-copy-primary"
              onClick={() => onRename(project)}
              aria-label={`Rename ${project.name}`}
            >
              <Pencil />
            </Button>
          ) : null}

          {onDelete ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-lg text-copy-muted hover:bg-elevated hover:text-error"
              onClick={() => onDelete(project)}
              aria-label={`Delete ${project.name}`}
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

interface ProjectListProps {
  projects: Project[];
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyMessage: string;
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

function ProjectList({
  projects,
  emptyIcon,
  emptyMessage,
  onRename,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  return (
    <ul className="flex flex-col gap-0.5 p-2">
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

/**
 * Floating project sidebar. It overlays the editor canvas rather than
 * occupying layout space, so opening it never pushes page content.
 *
 * Below `lg` it sits above a backdrop scrim; tapping the scrim closes it.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  projects = [],
  sharedProjects = [],
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition-opacity duration-200 ease-out lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

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
              <ProjectList
                projects={projects}
                emptyIcon={FolderOpen}
                emptyMessage="No projects yet."
                onRename={onRenameProject}
                onDelete={onDeleteProject}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="flex min-h-0 flex-col">
            <ScrollArea className="min-h-0 flex-1">
              <ProjectList
                projects={sharedProjects}
                emptyIcon={Users}
                emptyMessage="No shared projects yet."
              />
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
    </>
  );
}
