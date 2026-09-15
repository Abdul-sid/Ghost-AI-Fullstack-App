import { readJsonBody } from "@/lib/api-request";
import { errorResponse, unauthenticatedResponse } from "@/lib/api-response";
import {
  findCollaboratorByEmail,
  listCollaboratorRecords,
  withClerkProfiles,
} from "@/lib/collaborator-data";
import {
  normalizeEmail,
  parseInviteCollaboratorInput,
} from "@/lib/collaborator-input";
import {
  getCurrentIdentity,
  getProjectAccess,
  isRecordNotFoundError,
  isUniqueConstraintError,
} from "@/lib/project-access";
import {
  ownerOnlyError,
  PROJECT_NOT_FOUND_MESSAGE,
} from "@/lib/project-guards";
import { prisma } from "@/lib/prisma";

type CollaboratorsRouteContext =
  RouteContext<"/api/projects/[projectId]/collaborators">;

function alreadyCollaboratorResponse(email: string): Response {
  return errorResponse(409, `${email} is already a collaborator.`);
}

/**
 * Lists a project's collaborators with their Clerk names and avatars. Open to
 * the owner and to collaborators; anyone else gets the same `404` as for a
 * project that does not exist.
 */
export async function GET(_request: Request, ctx: CollaboratorsRouteContext) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return unauthenticatedResponse();
  }

  const { projectId } = await ctx.params;
  const access = await getProjectAccess(projectId, identity);

  if (!access) {
    return errorResponse(404, PROJECT_NOT_FOUND_MESSAGE);
  }

  const records = await listCollaboratorRecords(projectId);
  const collaborators = await withClerkProfiles(records);

  return Response.json({ collaborators });
}

/** Invites a collaborator by email. Owner only. */
export async function POST(request: Request, ctx: CollaboratorsRouteContext) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return unauthenticatedResponse();
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return errorResponse(400, body.error);
  }

  const input = parseInviteCollaboratorInput(body.value);

  if (!input.success) {
    return errorResponse(400, input.error);
  }

  const { projectId } = await ctx.params;
  const denied = await ownerOnlyError(projectId, identity.userId);

  if (denied) {
    return denied;
  }

  const { email } = input.data;

  if (identity.email && normalizeEmail(identity.email) === email) {
    return errorResponse(400, "You already own this project.");
  }

  if (await findCollaboratorByEmail(projectId, email)) {
    return alreadyCollaboratorResponse(email);
  }

  try {
    // Connecting through `ownerId` keeps the write itself owner-scoped.
    const record = await prisma.projectCollaborator.create({
      data: {
        email,
        project: { connect: { id: projectId, ownerId: identity.userId } },
      },
    });

    const [collaborator] = await withClerkProfiles([record]);

    return Response.json({ collaborator }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return alreadyCollaboratorResponse(email);
    }

    if (isRecordNotFoundError(error)) {
      return errorResponse(404, PROJECT_NOT_FOUND_MESSAGE);
    }

    throw error;
  }
}
