import { readJsonBody } from "@/lib/api-request";
import { errorResponse, unauthenticatedResponse } from "@/lib/api-response";
import {
  checkProjectOwnership,
  getCurrentUserId,
  isRecordNotFoundError,
} from "@/lib/project-access";
import { parseRenameProjectInput } from "@/lib/project-input";
import { prisma } from "@/lib/prisma";

type ProjectRouteContext = RouteContext<"/api/projects/[projectId]">;

const PROJECT_NOT_FOUND_MESSAGE = "Project not found.";

/** Maps a non-owner outcome to its response, or `null` when the caller owns it. */
async function ownerOnlyError(
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

/** Renames a project. Owner only. */
export async function PATCH(request: Request, ctx: ProjectRouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthenticatedResponse();
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return errorResponse(400, body.error);
  }

  const input = parseRenameProjectInput(body.value);

  if (!input.success) {
    return errorResponse(400, input.error);
  }

  const { projectId } = await ctx.params;
  const denied = await ownerOnlyError(projectId, userId);

  if (denied) {
    return denied;
  }

  try {
    // `ownerId` in the filter keeps the write itself owner-scoped.
    const project = await prisma.project.update({
      where: { id: projectId, ownerId: userId },
      data: { name: input.data.name },
    });

    return Response.json({ project });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return errorResponse(404, PROJECT_NOT_FOUND_MESSAGE);
    }

    throw error;
  }
}

/** Deletes a project and, by cascade, its collaborators. Owner only. */
export async function DELETE(_request: Request, ctx: ProjectRouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthenticatedResponse();
  }

  const { projectId } = await ctx.params;
  const denied = await ownerOnlyError(projectId, userId);

  if (denied) {
    return denied;
  }

  try {
    const project = await prisma.project.delete({
      where: { id: projectId, ownerId: userId },
    });

    return Response.json({ project });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return errorResponse(404, PROJECT_NOT_FOUND_MESSAGE);
    }

    throw error;
  }
}
