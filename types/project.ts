/** A project as rendered by the editor UI. */
export interface Project {
  id: string;
  name: string;
  /**
   * URL / Liveblocks room identifier, derived from the project name when the
   * project is created. `context/feature-specs/08-editor-workspace-shell.md`
   * routes on this value (`/editor/[roomId]`).
   */
  roomId: string;
}
