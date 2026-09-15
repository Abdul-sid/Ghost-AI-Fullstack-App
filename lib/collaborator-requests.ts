import {
  FALLBACK_ERROR,
  sendApiRequest,
  type ApiFailure,
  type ApiResult,
} from "@/lib/api-client";
import { projectUrl } from "@/lib/project-requests";
import type { Collaborator } from "@/types/collaborator";

export type CollaboratorListResult =
  | { ok: true; collaborators: Collaborator[] }
  | ApiFailure;

export type CollaboratorInviteResult =
  | { ok: true; collaborator: Collaborator }
  | ApiFailure;

const MALFORMED_RESPONSE: ApiFailure = {
  ok: false,
  status: null,
  error: FALLBACK_ERROR,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isCollaborator(value: unknown): value is Collaborator {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    isNullableString(value.name) &&
    isNullableString(value.avatarUrl)
  );
}

function collaboratorsUrl(projectId: string): string {
  return `${projectUrl(projectId)}/collaborators`;
}

/** Collaborators of a project, with Clerk names and avatars when available. */
export async function listCollaborators(
  projectId: string,
): Promise<CollaboratorListResult> {
  const result = await sendApiRequest(collaboratorsUrl(projectId), "GET");

  if (!result.ok) return result;

  const collaborators = isRecord(result.data)
    ? result.data.collaborators
    : undefined;

  if (!Array.isArray(collaborators) || !collaborators.every(isCollaborator)) {
    return MALFORMED_RESPONSE;
  }

  return { ok: true, collaborators };
}

/** Invites `email` to a project. Owner only — the API enforces it. */
export async function inviteCollaborator(
  projectId: string,
  email: string,
): Promise<CollaboratorInviteResult> {
  const result = await sendApiRequest(collaboratorsUrl(projectId), "POST", {
    email,
  });

  if (!result.ok) return result;

  const collaborator = isRecord(result.data)
    ? result.data.collaborator
    : undefined;

  if (!isCollaborator(collaborator)) {
    return MALFORMED_RESPONSE;
  }

  return { ok: true, collaborator };
}

/** Removes a collaborator from a project. Owner only — the API enforces it. */
export function removeCollaborator(
  projectId: string,
  collaboratorId: string,
): Promise<ApiResult> {
  return sendApiRequest(
    `${collaboratorsUrl(projectId)}/${encodeURIComponent(collaboratorId)}`,
    "DELETE",
  );
}
