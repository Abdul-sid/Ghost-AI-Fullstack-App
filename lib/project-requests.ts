import { sendApiRequest, type ApiResult } from "@/lib/api-client";

export type ProjectRequestResult = ApiResult;

export function projectUrl(projectId: string): string {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

/** Creates a project whose ID is `roomId`. */
export function createProject(
  name: string,
  roomId: string,
): Promise<ProjectRequestResult> {
  return sendApiRequest("/api/projects", "POST", { name, id: roomId });
}

export function renameProject(
  projectId: string,
  name: string,
): Promise<ProjectRequestResult> {
  return sendApiRequest(projectUrl(projectId), "PATCH", { name });
}

export function deleteProject(
  projectId: string,
): Promise<ProjectRequestResult> {
  return sendApiRequest(projectUrl(projectId), "DELETE");
}
