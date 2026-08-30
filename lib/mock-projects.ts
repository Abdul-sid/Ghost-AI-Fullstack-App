import type { Project } from "@/types/project";

/**
 * Placeholder project lists for the editor home.
 *
 * `context/feature-specs/04-project-dialogs.md` is UI-only, so the sidebar is
 * populated from here until `context/feature-specs/07-wire-editor-home.md`
 * replaces both lists with server-fetched data.
 */
export const MOCK_OWNED_PROJECTS: Project[] = [
  { id: "prj_1", name: "Payments Platform", roomId: "payments-platform" },
  { id: "prj_2", name: "Realtime Ingest Pipeline", roomId: "realtime-ingest-pipeline" },
  { id: "prj_3", name: "Auth Service", roomId: "auth-service" },
];

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "prj_4", name: "Billing Redesign", roomId: "billing-redesign" },
];
