import { errorResponse, unauthenticatedResponse } from "@/lib/api-response";
import {
  getCurrentUserId,
  isRecordNotFoundError,
} from "@/lib/project-access";
import { ownerOnlyError } from "@/lib/project-guards";
import { prisma } from "@/lib/prisma";

type CollaboratorRouteContext =
  RouteContext<"/api/projects/[projectId]/collaborators/[collaboratorId]">;

/** Removes a collaborator from a project. Owner only. */
export async function DELETE(_request: Request, ctx: CollaboratorRouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthenticatedResponse();
  }

  const { projectId, collaboratorId } = await ctx.params;
  const denied = await ownerOnlyError(projectId, userId);

  if (denied) {
    return denied;
  }

  try {
    // The project and owner filters keep the delete scoped to this owner's
    // project, so a collaborator ID from another project matches nothing.
    const collaborator = await prisma.projectCollaborator.delete({
      where: { id: collaboratorId, projectId, project: { ownerId: userId } },
    });

    return Response.json({ collaborator });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return errorResponse(404, "Collaborator not found.");
    }

    throw error;
  }
}
