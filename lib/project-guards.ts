import { errorResponse } from "@/lib/api-response";
import { checkProjectOwnership } from "@/lib/project-access";

export const PROJECT_NOT_FOUND_MESSAGE = "Project not found.";

/**
 * Maps a non-owner outcome to its API response — `404` for an unknown project,
 * `403` for anyone but the owner — or `null` when the caller owns the project.
 */
export async function ownerOnlyError(
  projectId: string,
  userId: string,
): Promise<Response | null> {
  const ownership = await checkProjectOwnership(projectId, userId);

  if (ownership === "not-found") {
    return errorResponse(404, PROJECT_NOT_FOUND_MESSAGE);
  }

  if (ownership === "forbidden") {
    return errorResponse(403, "Only the project owner can do this.");
  }

  return null;
}
